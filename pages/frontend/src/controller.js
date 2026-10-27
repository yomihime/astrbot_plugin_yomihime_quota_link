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
 /** @type {import("./contracts").State} */
 const state={units:null,unitsBusy:false,unitsUnknown:false,unitsNotice:'',alertStatus:null,alertBusy:false,alertNotice:'',ready:false,theme:'light',locale:'zh-CN',snapshot:null,draft:null,secret:null,plan:null,busy:false,stale:true,unknown:false,notice:'正在连接宿主管理会话…',tone:'neutral',edit:0,route:'accounts',selected:null};
 let unitsSerial=0;
 let epoch=0,serial=0,contextKey=null,contextSeen=false,closed=false,off,active=null;
 const emit=()=>changed();
 const notice=(text,tone='neutral')=>{state.notice=text;state.tone=tone;};
 const dirty=()=>!!state.snapshot&&!!state.draft&&JSON.stringify(state.snapshot.config)!==JSON.stringify(state.draft);
 function prepareDraft(){if(state.snapshot)state.draft=clone(state.snapshot.config);}
 function clearSecret(){if(state.secret){state.secret.value='';state.secret.environment='';}state.secret=null;}
 function wipe(){unitsSerial++;state.units=null;state.unitsBusy=false;state.unitsUnknown=false;state.unitsNotice='';state.alertStatus=null;state.alertBusy=false;state.alertNotice='';clearSecret();state.plan=null;state.draft=null;state.edit++;}
 function invalidate(message){epoch++;active=null;state.busy=false;wipe();state.snapshot=null;state.ready=false;state.stale=true;contextKey=null;notice(message,'error');emit();}
 const current=t=>!closed&&state.ready&&t.epoch===epoch&&active===t;
 function apply(snapshot){unitsSerial++;state.units=null;state.unitsBusy=false;state.unitsUnknown=false;state.unitsNotice='';state.alertStatus=null;state.alertNotice='';state.snapshot=snapshot;prepareDraft();state.stale=false;state.unknown=false;state.plan=null;state.edit++;}
 async function post(operation,body,token){if(!operations.has(operation)||!current(token))throw Error('stale_context');const response=await bridge.apiPost('admin/'+operation,body);if(!current(token))throw Error('stale_context');return response;}
 async function run(operation,body,{write=false,plan=false}={}){
  if(closed||!state.ready||state.busy||write&&(state.stale||!state.snapshot||state.snapshot.migration.pending&&operation!=='legacy-config-execute'))return false;
  const token={epoch,serial:++serial,write};active=token;state.busy=true;clearSecret();state.plan=null;notice(write?'正在提交，请勿重复操作…':'正在读取最新状态…');emit();
  try{
   const response=await post(operation,body,token);if(!current(token))return false;
   if(plan){state.plan=validatePlan(response);notice(state.plan.legacy_conflict?'旧配置与当前存储不一致。不会覆盖现有存储或清理新的旧配置。':state.plan.cleanup_pending?'迁移已保存，可重试清理原来的宿主旧字段。':state.plan.pending?'迁移预览已就绪。执行前请核对下方范围。':'没有待迁移的旧配置。');}
   else {const snapshot=validateSnapshot(response);if(write&&(snapshot.revision<body.revision||operation!=='legacy-config-execute'&&snapshot.revision===body.revision))throw Error('invalid_response');apply(snapshot);notice(snapshot.migration.cleanup_pending?'配置已迁移，但宿主旧字段清理尚未完成，请在配置维护中重新预览并完成清理。':write?'已保存，当前状态已重新核对。':'已读取最新配置。',snapshot.migration.cleanup_pending?'warning':'success');}
   return true;
  }catch(error){
   if(!current(token))return false;
   const kind=safeError(error);clearSecret();
   if(kind==='auth'){invalidate('管理授权已失效。所有草稿已清空，请从 AstrBot 插件管理重新打开。');return false;}
   if(kind==='conflict'){state.stale=true;state.unknown=false;notice('配置已被其他页面修改。请重新读取，再核对并提交；不会自动重试。','warning');}
   else if(kind==='validation'){notice('提交未通过校验。请检查字段和凭据类型；敏感输入已清空。','error');}
   else {state.stale=true;state.unknown=write;notice(write?'提交结果尚未确认，敏感输入已清空。请重新读取状态后再决定，切勿直接重复提交。':'无法读取可信的配置状态。请重新读取，或从宿主重新打开。','warning');}
   return false;
  }finally{if(current(token)){state.busy=false;active=null;emit();}}
 }
 async function refresh(){if(!state.ready||state.busy)return false;clearSecret();return run('read',{});}
 async function refreshAlerts(){
  if(closed||!state.ready||state.busy||state.alertBusy)return false;
  const requestEpoch=epoch,revision=state.snapshot?.revision;state.alertBusy=true;state.alertNotice='正在读取预警运行状态…';emit();
  try{const response=await bridge.apiPost('admin/alert-status',{});if(closed||!state.ready||requestEpoch!==epoch||revision!==state.snapshot?.revision)return false;state.alertStatus=validateAlertStatus(response);state.alertNotice='';return true;}
  catch(error){if(closed||requestEpoch!==epoch)return false;if(safeError(error)==='auth'){invalidate('管理授权已失效。所有草稿已清空，请从 AstrBot 插件管理重新打开。');return false;}state.alertStatus=null;state.alertNotice='无法读取可信的预警运行状态，请稍后重试。';return false;}
  finally{if(!closed&&requestEpoch===epoch){state.alertBusy=false;emit();}}
 }
 async function refreshUnits(){
  if(closed||!state.ready||!state.snapshot||state.busy||state.unitsBusy)return false;
  const request={epoch,revision:state.snapshot.revision,serial:++unitsSerial,selected:state.selected};state.unitsBusy=true;state.unitsNotice='';emit();
  const valid=()=>!closed&&state.ready&&request.epoch===epoch&&request.serial===unitsSerial&&request.revision===state.snapshot?.revision&&request.selected===state.selected;
  try{const response=await bridge.apiPost('admin/alert-units',{});if(!valid())return false;state.units=validateAlertUnits(response);state.unitsUnknown=false;return true;}
  catch(error){if(!valid())return false;state.units=null;if(safeError(error)==='auth')invalidate('管理授权已失效，请重新打开。');else state.unitsNotice='单位获取失败，请刷新。';return false;}
  finally{if(valid()){state.unitsBusy=false;emit();}}
 }
 async function bindUnit(accountId,choiceId){
  if(closed||!state.ready||state.stale||state.busy||state.unitsBusy||state.unitsUnknown||!state.snapshot||dirty()||state.route!=='accounts'||state.selected!==accountId)return false;
  const account=state.snapshot.config.providers.find(a=>a.id===accountId),entry=state.units?.accounts.find(a=>a.account_id===accountId),choice=entry?.choices.find(c=>c.id===choiceId&&c.metric===account?.balance_alert?.metric);
  if(!entry||!(['ambiguous','changed'].includes(entry.unit_state)||entry.unit_state==='unidentified'&&entry.choices.filter(c=>c.metric===account?.balance_alert?.metric).length===1)||!choice||state.snapshot.migration.pending)return false;
  const token={epoch,serial:++serial,write:true};active=token;unitsSerial++;state.busy=true;state.unitsBusy=true;state.unitsNotice='';clearSecret();emit();
  try{const response=await bridge.apiPost('admin/alert-bind-unit',{revision:state.snapshot.revision,account_id:accountId,choice_id:choice.id});if(!current(token))return false;state.units=validateAlertUnits(response);state.unitsUnknown=false;state.unitsNotice='单位已确认。';return true;}
  catch(error){if(!current(token))return false;state.units=null;const kind=safeError(error);if(kind==='auth'){invalidate('管理授权已失效，请重新打开。');return false;}if(kind==='conflict'){state.stale=true;state.unitsNotice='配置已改变，请重新读取。';notice('配置已改变，请重新读取。','warning');}else if(kind==='validation')state.unitsNotice='单位已变化，请刷新后重试。';else{state.unitsUnknown=true;state.unitsNotice='确认结果未知，请刷新单位后再操作。';}return false;}
  finally{if(current(token)){state.busy=false;state.unitsBusy=false;active=null;emit();}}
 }
 function accept(context){
  if(closed)return;contextSeen=true;state.theme=context?.isDark===true||context?.theme==='dark'?'dark':'light';state.locale=typeof context?.locale==='string'?context.locale:'zh-CN';
  let next;try{next=boundary(context);}catch{invalidate('宿主管理上下文无效。请从 AstrBot 插件管理打开此页。');return;}
  if(state.ready&&next===contextKey){emit();return;}
  epoch++;active=null;state.busy=false;wipe();state.snapshot=null;state.stale=true;state.unknown=false;state.ready=true;contextKey=next;emit();void refresh();
 }
 function edit(mutator){if(!state.ready||state.stale||state.busy||!state.draft)return;mutator(state.draft);state.edit++;state.plan=null;emit();}
 /** @param {string} route @param {string|null} selected */
 function navigate(route,selected=null){
  const wasWrite=active?.write;epoch++;unitsSerial++;state.units=null;state.unitsBusy=false;state.unitsNotice='';state.alertBusy=false;active=null;state.busy=false;clearSecret();state.plan=null;state.edit++;
  state.route=route;state.selected=selected;prepareDraft();
  if(wasWrite){state.stale=true;state.unknown=true;notice('已离开原设置。已发出的请求无法撤回，请重新读取确认结果。','warning');}emit();
 }
 async function save(){if(!state.draft)return false;const errors=validateDraft(state.draft);if(errors.length){notice(errors.join(' '),'error');emit();return false;}return run('update',{revision:state.snapshot?.revision,config:clone(state.draft)},{write:true});}
 function beginSecret(account,field,mode='value'){if(state.stale||state.busy||!state.ready||!state.snapshot)return;clearSecret();state.secret={account,field,mode,value:'',environment:''};state.edit++;emit();}
 function changeSecret(key,value){if(!state.secret||state.busy)return;state.secret[key]=value;state.edit++;emit();}
 async function replace(){const secret=state.secret;if(!secret||dirty())return false;const value=secret.mode==='environment'?secret.environment:secret.value;if(!value.trim()||secret.mode==='environment'&&!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)){notice(secret.mode==='environment'?'请输入有效的环境变量名，不要填写变量的值。':'请输入新凭据；留空不会执行清除。','error');emit();return false;}const body={revision:state.snapshot.revision,account_id:secret.account,field:secret.field,...(secret.mode==='environment'?{environment:value}:{value})};return run('credential-replace',body,{write:true});}
 async function clear(account,field){if(dirty())return false;return run('credential-clear',{revision:state.snapshot?.revision,account_id:account,field},{write:true});}
 function cancelSecret(){clearSecret();state.edit++;emit();}
 function discard(){clearSecret();state.plan=null;prepareDraft();state.edit++;notice('未保存的草稿已丢弃。');emit();}
 function close(){if(closed)return;closed=true;epoch++;active=null;state.busy=false;wipe();state.snapshot=null;state.ready=false;off?.();emit();}
 function start(){if(!bridge||typeof bridge.apiPost!=='function'||typeof bridge.ready!=='function'||typeof bridge.onContext!=='function'){notice('请从 AstrBot 插件管理页面打开此页。','warning');emit();return;}off=bridge.onContext(accept);Promise.resolve(bridge.ready()).then(context=>{if(!contextSeen)accept(context);}).catch(()=>{if(!contextSeen&&!closed)invalidate('宿主管理会话不可用，请重新打开此页。');});}
 return {state,start,accept,close,refresh,refreshUnits,bindUnit,refreshAlerts,save,dirty,edit,navigate,beginSecret,changeSecret,replace,clear,cancelSecret,discard,interactionKey:()=>JSON.stringify([epoch,state.edit,state.route,state.selected,state.snapshot?.revision,state.busy,state.ready,state.stale,unitsSerial]),plan:()=>run('legacy-config-plan',{}, {plan:true}),migrate:()=>(state.plan?.pending||state.plan?.cleanup_pending)&&!state.plan?.legacy_conflict&&!dirty()?run('legacy-config-execute',{revision:state.snapshot?.revision,plan_id:state.plan.plan_id,confirm:true},{write:true}):Promise.resolve(false)};
}
