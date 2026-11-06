import {resolveLocale,translate} from './i18n.js';
import {validateAlertStatus,validateAlertUnits} from './alert-config.js';
import {clone,validateSnapshot,validatePlan,validateDraft} from './config.js';
const presentation=new Set(['isDark','theme','locale','i18n','displayName','pageTitle']);
const operations=new Set(['read','update','credential-status','credential-replace','credential-clear','legacy-config-plan','legacy-config-execute']);
export const safeError=error=>{
 const values=[error?.code,error?.error_code,error?.message,error?.error?.code];
 if([error?.status,error?.response?.status].some(v=>v===401||v===403)||values.some(v=>['admin_authorization_denied','page_revoked','asset_revoked','stale_context','unauthorized','forbidden'].includes(v)))return 'auth';
 if([error?.status,error?.response?.status].includes(409)||values.some(v=>['revision_conflict','stale_revision','conflict'].includes(v)))return 'conflict';
 if([error?.status,error?.response?.status].includes(400)||values.some(v=>['validation_error','invalid_config','invalid_request','invalid_credential','invalid_environment','invalid_field','invalid_account'].includes(v)))return 'validation';
 return 'unknown';
};
function boundary(context){
 if(!context||typeof context!=='object'||Array.isArray(context)||context.pluginName!=='astrbot_plugin_yomihime_quota_link'||context.pageName!=='00-quota-link')throw Error('invalid_context');
 const normalize=(value,depth=0)=>{if(depth>16)throw Error('invalid_context');if(value===null||['string','boolean'].includes(typeof value))return value;if(typeof value==='number'&&Number.isFinite(value))return value;if(Array.isArray(value))return value.map(v=>normalize(v,depth+1));if(value&&typeof value==='object'&&[Object.prototype,null].includes(Object.getPrototypeOf(value)))return Object.fromEntries(Object.keys(value).sort().map(k=>[k,normalize(value[k],depth+1)]));throw Error('invalid_context');};
 return JSON.stringify(normalize(Object.fromEntries(Object.entries(context).filter(([k])=>!presentation.has(k)))));
}
export function createController(bridge,changed=()=>{}){
 let hostLocale,noticeValue='web.notice.connecting',alertNotice='',unitsNotice='';
 const display=value=>typeof value==='function'?value(state.locale):value?translate(value,state.locale):'';
 /** @type {import("./contracts").State} */
 const state={get locale(){return resolveLocale(state.snapshot?.config.language,hostLocale);},
  get notice(){return display(noticeValue);},get alertNotice(){return display(alertNotice);},get unitsNotice(){return display(unitsNotice);},units:null,unitsBusy:false,unitsUnknown:false,alertStatus:null,alertBusy:false,ready:false,theme:'light',snapshot:null,draft:null,secret:null,plan:null,busy:false,stale:true,unknown:false,tone:'neutral',edit:0,route:'accounts',selected:null};
 let unitsSerial=0,alertsSerial=0;
 let epoch=0,serial=0,contextKey=null,contextSeen=false,closed=false,off,active=null;
 const emit=()=>changed();
 const notice=(text,tone='neutral')=>{noticeValue=text;state.tone=tone;};
 const dirty=()=>!!state.snapshot&&!!state.draft&&JSON.stringify(state.snapshot.config)!==JSON.stringify(state.draft);
 function prepareDraft(){if(state.snapshot)state.draft=clone(state.snapshot.config);}
 function clearSecret(){if(state.secret){state.secret.value='';state.secret.environment='';}state.secret=null;}
 function wipe(){unitsSerial++;alertsSerial++;state.units=null;state.unitsBusy=false;state.unitsUnknown=false;unitsNotice='';state.alertStatus=null;state.alertBusy=false;alertNotice='';clearSecret();state.plan=null;state.draft=null;state.edit++;}
 function invalidate(message){epoch++;active=null;state.busy=false;wipe();state.snapshot=null;state.ready=false;state.stale=true;contextKey=null;notice(message,'error');emit();}
 const current=t=>!closed&&state.ready&&t.epoch===epoch&&active===t;
 function apply(snapshot){unitsSerial++;alertsSerial++;state.alertBusy=false;state.units=null;state.unitsBusy=false;state.unitsUnknown=false;unitsNotice='';state.alertStatus=null;alertNotice='';state.snapshot=snapshot;prepareDraft();state.stale=false;state.unknown=false;state.plan=null;state.edit++;}
 async function post(operation,body,token){if(!operations.has(operation)||!current(token))throw Error('stale_context');const response=await bridge.apiPost('admin/'+operation,body);if(!current(token))throw Error('stale_context');return response;}
 async function run(operation,body,{write=false,plan=false}={}){
  if(closed||!state.ready||state.busy||write&&(state.stale||!state.snapshot||state.snapshot.migration.pending&&operation!=='legacy-config-execute'))return false;
  const token={epoch,serial:++serial,write};active=token;state.busy=true;clearSecret();state.plan=null;notice(write?'web.notice.saving':'web.notice.reading');emit();
  try{
   const response=await post(operation,body,token);if(!current(token))return false;
   if(plan){state.plan=validatePlan(response);notice(state.plan.legacy_conflict?'web.notice.legacy_conflict':state.plan.cleanup_pending?'web.notice.legacy_cleanup_retry':state.plan.pending?'web.notice.legacy_preview_ready':'web.notice.legacy_not_pending');}
   else {const snapshot=validateSnapshot(response);if(write&&(snapshot.revision<body.revision||operation!=='legacy-config-execute'&&snapshot.revision===body.revision))throw Error('invalid_response');apply(snapshot);notice(snapshot.migration.cleanup_pending?'web.notice.legacy_cleanup_incomplete':write?'web.notice.saved':'web.notice.loaded',snapshot.migration.cleanup_pending?'warning':'success');}
   return true;
  }catch(error){
   if(!current(token))return false;
   const kind=safeError(error);clearSecret();
   if(kind==='auth'){invalidate('web.notice.authorization_lost');return false;}
   if(kind==='conflict'){state.stale=true;state.unknown=false;notice('web.notice.revision_conflict','warning');}
   else if(kind==='validation'){notice('web.notice.validation_failed','error');}
   else {state.stale=true;state.unknown=write;notice(write?'web.notice.write_uncertain':'web.notice.read_failed','warning');}
   return false;
  }finally{if(current(token)){state.busy=false;active=null;emit();}}
 }
 async function refresh(){if(!state.ready||state.busy)return false;clearSecret();return run('read',{});}
 async function refreshAlerts(){
  if(closed||!state.ready||state.busy||state.alertBusy)return false;
  const request={epoch,revision:state.snapshot?.revision,serial:++alertsSerial};state.alertBusy=true;alertNotice='web.notice.alert_loading';emit();
  const valid=()=>!closed&&state.ready&&request.epoch===epoch&&request.revision===state.snapshot?.revision&&request.serial===alertsSerial;
  try{const response=await bridge.apiPost('admin/alert-status',{});if(!valid())return false;state.alertStatus=validateAlertStatus(response);alertNotice='';return true;}
  catch(error){if(!valid())return false;if(safeError(error)==='auth'){invalidate('web.notice.authorization_lost');return false;}state.alertStatus=null;alertNotice='web.notice.alert_read_failed';return false;}
  finally{if(valid()){state.alertBusy=false;emit();}}
 }
 async function refreshUnits(){
  if(closed||!state.ready||!state.snapshot||state.busy||state.unitsBusy)return false;
  const request={epoch,revision:state.snapshot.revision,serial:++unitsSerial,selected:state.selected};state.unitsBusy=true;unitsNotice='';emit();
  const valid=()=>!closed&&state.ready&&request.epoch===epoch&&request.serial===unitsSerial&&request.revision===state.snapshot?.revision&&request.selected===state.selected;
  try{const response=await bridge.apiPost('admin/alert-units',{});if(!valid())return false;state.units=validateAlertUnits(response);state.unitsUnknown=false;return true;}
  catch(error){if(!valid())return false;state.units=null;if(safeError(error)==='auth')invalidate('web.notice.authorization_reopen');else unitsNotice='web.notice.unit_read_failed';return false;}
  finally{if(valid()){state.unitsBusy=false;emit();}}
 }
 async function queryUnits(accountId){
  if(closed||!state.ready||state.stale||state.busy||state.unitsBusy||!state.snapshot||dirty()||state.secret||state.snapshot.migration.pending||state.route!=='accounts'||state.selected!==accountId||!state.snapshot.config.providers.some(a=>a.id===accountId))return false;
  const token={epoch,serial:++serial,write:false};active=token;unitsSerial++;state.busy=true;state.unitsBusy=true;unitsNotice='web.notice.unit_querying';emit();
  try{const response=await bridge.apiPost('admin/alert-refresh-units',{revision:state.snapshot.revision,account_id:accountId});if(!current(token))return false;state.units=validateAlertUnits(response);state.unitsUnknown=false;const entry=state.units.accounts.find(a=>a.account_id===accountId);unitsNotice=entry?.unit_state==='verified'?'web.notice.unit_current':entry?.choices.length?'web.notice.unit_candidates':'web.notice.unit_no_candidates';return true;}
  catch(error){if(!current(token))return false;state.units=null;const kind=safeError(error);if(kind==='auth')invalidate('web.notice.authorization_reopen');else if(kind==='conflict'){state.stale=true;unitsNotice='web.notice.config_changed';notice('web.notice.config_changed','warning');}else unitsNotice='web.notice.unit_unverified_candidates';return false;}
  finally{if(current(token)){state.busy=false;state.unitsBusy=false;active=null;emit();}}
 }
 async function bindUnit(accountId,choiceId){
  if(closed||!state.ready||state.stale||state.busy||state.unitsBusy||state.unitsUnknown||!state.snapshot||dirty()||state.route!=='accounts'||state.selected!==accountId)return false;
  const account=state.snapshot.config.providers.find(a=>a.id===accountId),entry=state.units?.accounts.find(a=>a.account_id===accountId),choice=entry?.choices.find(c=>c.id===choiceId&&c.metric===account?.balance_alert?.metric);
  if(!entry||entry.choices_state&&entry.choices_state!=='fresh'||!(['ambiguous','changed'].includes(entry.unit_state)||entry.unit_state==='unidentified'&&entry.choices.filter(c=>c.metric===account?.balance_alert?.metric).length===1)||!choice||state.snapshot.migration.pending)return false;
  const token={epoch,serial:++serial,write:true};active=token;unitsSerial++;state.busy=true;state.unitsBusy=true;unitsNotice='';clearSecret();emit();
  try{const response=await bridge.apiPost('admin/alert-bind-unit',{revision:state.snapshot.revision,account_id:accountId,choice_id:choice.id});if(!current(token))return false;state.units=validateAlertUnits(response);state.unitsUnknown=false;unitsNotice='web.notice.unit_confirmed';return true;}
  catch(error){if(!current(token))return false;state.units=null;const kind=safeError(error);if(kind==='auth'){invalidate('web.notice.authorization_reopen');return false;}if(kind==='conflict'){state.stale=true;unitsNotice='web.notice.config_changed';notice('web.notice.config_changed','warning');}else if(kind==='validation')unitsNotice='web.notice.unit_candidate_changed';else{state.unitsUnknown=true;unitsNotice='web.notice.unit_confirm_uncertain';}return false;}
  finally{if(current(token)){state.busy=false;state.unitsBusy=false;active=null;emit();}}
 }
 function accept(context){
  if(closed)return;contextSeen=true;state.theme=context?.isDark===true||context?.theme==='dark'?'dark':'light';hostLocale=context?.locale;
  let next;try{next=boundary(context);}catch{invalidate('web.notice.invalid_context');return;}
  if(state.ready&&next===contextKey){emit();return;}
  epoch++;active=null;state.busy=false;wipe();state.snapshot=null;state.stale=true;state.unknown=false;state.ready=true;contextKey=next;emit();void refresh();
 }
 function edit(mutator){if(!state.ready||state.stale||state.busy||!state.draft)return;mutator(state.draft);state.edit++;state.plan=null;emit();}
 /** @param {string} route @param {string|null} selected */
 function navigate(route,selected=null){
  const wasWrite=active?.write;epoch++;unitsSerial++;alertsSerial++;state.units=null;state.unitsBusy=false;unitsNotice='';state.alertBusy=false;active=null;state.busy=false;clearSecret();state.plan=null;state.edit++;
  state.route=route;state.selected=selected;prepareDraft();
  if(wasWrite){state.stale=true;state.unknown=true;notice('web.notice.left_during_write','warning');}emit();
 }
 async function save(){if(!state.draft)return false;const errors=validateDraft(state.draft,state.locale);if(errors.length){const invalid=clone(state.draft);notice(locale=>validateDraft(invalid,locale).join(' '),'error');emit();return false;}return run('update',{revision:state.snapshot?.revision,config:clone(state.draft)},{write:true});}
 function beginSecret(account,field,mode='value'){if(state.stale||state.busy||!state.ready||!state.snapshot)return;clearSecret();state.secret={account,field,mode,value:'',environment:''};state.edit++;emit();}
 function changeSecret(key,value){if(!state.secret||state.busy)return;state.secret[key]=value;state.edit++;emit();}
 async function replace(){const secret=state.secret;if(!secret||dirty())return false;const value=secret.mode==='environment'?secret.environment:secret.value;if(!value.trim()||secret.mode==='environment'&&!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)){notice(secret.mode==='environment'?'web.notice.invalid_environment':'web.notice.missing_credential','error');emit();return false;}const body={revision:state.snapshot.revision,account_id:secret.account,field:secret.field,...(secret.mode==='environment'?{environment:value}:{value})};return run('credential-replace',body,{write:true});}
 async function clear(account,field){if(dirty())return false;return run('credential-clear',{revision:state.snapshot?.revision,account_id:account,field},{write:true});}
 function cancelSecret(){clearSecret();state.edit++;emit();}
 function discard(){clearSecret();state.plan=null;prepareDraft();state.edit++;notice('web.notice.discarded');emit();}
 function close(){if(closed)return;closed=true;epoch++;active=null;state.busy=false;wipe();state.snapshot=null;state.ready=false;off?.();emit();}
 function start(){if(!bridge||typeof bridge.apiPost!=='function'||typeof bridge.ready!=='function'||typeof bridge.onContext!=='function'){notice('web.notice.open_in_host','warning');emit();return;}off=bridge.onContext(accept);Promise.resolve(bridge.ready()).then(context=>{if(!contextSeen)accept(context);}).catch(()=>{if(!contextSeen&&!closed)invalidate('web.notice.session_unavailable');});}
 return {state,start,accept,close,refresh,refreshUnits,queryUnits,bindUnit,refreshAlerts,save,dirty,edit,navigate,beginSecret,changeSecret,replace,clear,cancelSecret,discard,interactionKey:()=>JSON.stringify([epoch,state.edit,state.route,state.selected,state.snapshot?.revision,state.busy,state.ready,state.stale,unitsSerial]),plan:()=>run('legacy-config-plan',{}, {plan:true}),migrate:()=>(state.plan?.pending||state.plan?.cleanup_pending)&&!state.plan?.legacy_conflict&&!dirty()?run('legacy-config-execute',{revision:state.snapshot?.revision,plan_id:state.plan.plan_id,confirm:true},{write:true}):Promise.resolve(false)};
}
