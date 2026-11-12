import {MessageError,errorText,translate} from './i18n.js';
import {createApp,defineComponent,h,ref,onMounted,onBeforeUnmount,type VNodeChild} from 'vue';
import {NButton} from 'naive-ui';
import {UiProvider,SettingsLayout,Surface} from './ui/shared-components';
import {PageHeader,SettingsGroup,ActionBar,StatusHint,FormField,FormGrid,type FormFieldSlot} from './ui/components';
import {createInlineConfirmation} from './confirmation';
import {createController} from './controller.js';
import {selectProviderLogo} from './provider-logo-data.js';
import {globals,globalGroups,globalLabels,fieldLabels,languageField,fieldHint,optionLabel,providerName,providerHelp,isGatewayProvider,templates,providerOptions,newAccount,templateFor,credentialFields,clone} from './config.js';
import {alertDefaults,defaultMetric,metricOptions,normalizeAlert,normalizeAdminIds,parseTargetsText,formatTargets,alertDraftErrors,fixedAlertUnit,unitLabel as localizedUnit,metricLabel as localizedMetric,localTime,alertDetailLabel} from './alert-config.js';
import './ui/tokens.css';
import './shell.css';
import './quota.css';

declare global {interface Window{AstrBotPluginView:any}}
type Dict=Record<string,any>;
const ProviderEmblem=defineComponent({
 props:{account:{type:Object,required:true}},
 setup(props){
  const failedSrc=ref<string|null>(null);
  return ()=>{
   const logo=selectProviderLogo(props.account),failed=failedSrc.value===logo.src;
   return h('span',{class:'workspace-emblem quota-provider-emblem','aria-hidden':'true','data-provider-logo':logo.key,'data-logo-kind':failed?'load-error':logo.classification},[
    failed?h('span',{class:'quota-provider-emblem-fallback'},'API'):h('img',{key:logo.src,src:logo.src,alt:'',width:32,height:32,draggable:false,onError:()=>{failedSrc.value=logo.src;}}),
   ]);
  };
 },
});
const App=defineComponent({setup(){
 const tick=ref(0),root=ref<HTMLElement|null>(null),main=ref<HTMLElement|null>(null),newType=ref('deepseek'),raw=ref<Record<string,string>>({}),errors=ref<Record<string,unknown>>({}),sliderValues=ref<Record<string,number>>({});
 const confirmation=createInlineConfirmation(document,()=>t('web.common.cancel')),unitChoices=ref<Record<string,string>>(Object.create(null));let lastDraft:unknown,lastUnits:unknown;
 const controller=createController(window.AstrBotPluginView,()=>{if(lastDraft!==controller.state.draft){raw.value={};errors.value={};sliderValues.value={};lastDraft=controller.state.draft;}if(lastUnits!==controller.state.units){unitChoices.value=Object.create(null);lastUnits=controller.state.units;}confirmation.invalidate();tick.value++;});
 const s=controller.state;
 const t=(id:string,args?:Record<string,unknown>)=>translate(id,s.locale,args);
 const unitLabel=(unit:unknown)=>localizedUnit(unit,s.locale);
 const metricLabel=(metric:unknown)=>localizedMetric(metric,s.locale);
 const fieldError=(id:string)=>errors.value[id]?errorText(errors.value[id],s.locale):undefined;
 const button=(text:string,attrs:Dict={})=>h(NButton,{size:'large',...attrs},()=>text);
 const ordinaryDisabled=()=>!s.ready||s.busy||s.stale||!!s.snapshot?.migration.pending;
 const credentialDisabled=()=>ordinaryDisabled()||controller.dirty()||!s.snapshot?.encryption.ready;
 const guard=async(kind:'navigation'|'credential-clear'|'legacy-config'|'maintenance',copy:()=>[string,string,string],action:()=>void|Promise<unknown>)=>{
  const key=controller.interactionKey();if(await confirmation.ask({kind,copy,isCurrent:()=>key===controller.interactionKey()&&s.ready})){await action();}
 };
 const navigation=async(route:string,selected:string|null=null)=>{
  const go=()=>{controller.navigate(route,selected);if(route==='accounts'&&selected&&s.snapshot?.config.providers.some(a=>a.id===selected))void controller.refreshUnits();};
  if(controller.dirty()||s.secret||s.busy){await guard('navigation',()=>[t('web.navigation.leave_title'),t('web.navigation.leave_body'),t('web.navigation.leave_action')],go);}
  else go();
 };
 const reload=async()=>{const read=async()=>{if(await controller.refresh()&&s.route==='accounts'&&s.selected)await controller.refreshUnits();};if(controller.dirty()||s.secret)await guard('navigation',()=>[t('web.navigation.reload_title'),t('web.navigation.reload_body'),t('web.navigation.reload_action')],read);else await read();};
 const icon=(kind:string)=>h('svg',{class:'shell-icon',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':1.5,'aria-hidden':'true'},kind==='account'?[h('rect',{x:3,y:5,width:18,height:14,rx:2}),h('path',{d:'M3 10h18M7 15h4'})]:kind==='settings'?[h('circle',{cx:12,cy:12,r:4}),h('path',{d:'M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2'})]:[h('path',{d:'M4 12a8 8 0 1 1 2 6M4 12V5m0 7h7'})]);
 const navLink=(title:string,route:string,kind:string)=>h('a',{href:'#/'+route,'aria-current':s.route===route?'page':undefined,onClick:(event:Event)=>{event.preventDefault();void navigation(route);}},[icon(kind),h('span',title)]);
 const brand=()=>h('div',{class:'shell-brand'},[h('span',{class:'shell-brand-mark','aria-hidden':'true'},'✧'),h('span',[h('span',{class:'shell-brand-line'},t('web.shell.brand_author')),h('span',{class:'shell-brand-line'},t('web.shell.brand_name'))])]);
 const readPath=(object:Dict,path:string[])=>path.reduce((value,key)=>value?.[key],object);
 const change=(path:string[],value:unknown,index:number|null)=>controller.edit((config:Dict)=>{let target=index===null?config:config.providers[index];for(const key of path.slice(0,-1)){if(!target[key]||typeof target[key]!=='object')target[key]={};target=target[key];}target[path.at(-1)!]=value;if(index!==null&&path.length===1&&path[0]==='id')s.selected=String(value);});
 const changeProfile=async(index:number,value:string)=>{
  const account=s.draft?.providers[index];if(!account||value===account.service_profile)return;
  const alert=account.balance_alert,protectedRule=alert?.threshold!==null&&alert?.threshold!==undefined||alert?.recovery_threshold!==null&&alert?.recovery_threshold!==undefined||alert?.enabled;
  const reset=()=>controller.edit((config:Dict)=>{const current=config.providers[index];current.service_profile=value;current.balance_alert={...current.balance_alert,enabled:false,metric:defaultMetric(current),threshold:null,recovery_threshold:null};});
  if(protectedRule)await guard('maintenance',()=>[t('web.account.profile_title'),t('web.account.profile_body'),t('web.account.profile_action')],reset);else reset();
 };
 function field(key:string,descriptor:Dict,index:number|null,path:string[]=[key],extra:Dict={}){
  const account=index===null?s.draft:s.draft?.providers[index];if(!account)return null;
  const controlId='field-'+(index===null?'global':index)+'-'+path.join('-'),value=readPath(account,path)??descriptor.default??'',label=extra.label??t(key==='language'?'web.settings.language':((index===null?globalLabels:fieldLabels) as Record<string,string>)[key]);
  const locked=extra.locked||ordinaryDisabled();
  const setValue=(value:unknown)=>{delete errors.value[controlId];if(index!==null&&path.length===1&&key==='service_profile'){void changeProfile(index,String(value));return;}change(path,value,index);};
  let control:(attrs:FormFieldSlot['controlAttrs'])=>VNodeChild;
  if(descriptor.type==='bool')control=attrs=>h('label',{class:'ui-check-label'},[h('input',{...attrs,type:'checkbox',checked:!!value,disabled:locked,onChange:(e:Event)=>setValue((e.target as HTMLInputElement).checked)}),h('span',value?t('web.common.on'):t('web.common.off'))]);
  else if(descriptor.options)control=attrs=>h('select',{...attrs,class:'ui-control',value,disabled:locked,onChange:(e:Event)=>setValue((e.target as HTMLSelectElement).value)},[(!descriptor.options.includes(value)?[h('option',{value},value||t('web.common.choose'))]:[]),...descriptor.options.map((option:string)=>h('option',{value:option},optionLabel(key,option,s.locale)))]);
  else if(descriptor.type==='list')control=attrs=>h('textarea',{...attrs,class:'ui-control',rows:3,value:raw.value[controlId]??(Array.isArray(value)?value.join('\n'):''),disabled:locked,placeholder:t('web.common.one_per_line'),onInput:(e:Event)=>{const text=(e.target as HTMLTextAreaElement).value;raw.value[controlId]=text;setValue(text.split('\n').map(v=>v.trim()).filter(Boolean));}});
  else if(descriptor.type==='dict')control=attrs=>h('textarea',{...attrs,class:'ui-control quota-json',rows:4,value:raw.value[controlId]??JSON.stringify(value||{},null,2),disabled:locked,spellcheck:false,onInput:(e:Event)=>{const text=(e.target as HTMLTextAreaElement).value;raw.value[controlId]=text;try{const parsed=JSON.parse(text||'{}');if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error();setValue(parsed);}catch{errors.value[controlId]=new MessageError('web.validation.json_object');}}});
  else control=attrs=>h('input',{...attrs,class:'ui-control',type:['float','int'].includes(descriptor.type)?'number':'text',min:descriptor.type==='int'?1:descriptor.type==='float'?0.001:undefined,max:key==='max_concurrency'?32:key==='total_timeout_seconds'?300:key==='timeout_seconds'?120:key==='cache_ttl_seconds'?86400:undefined,step:descriptor.type==='int'?1:descriptor.type==='float'?'any':undefined,value,disabled:locked,autocomplete:'off',onInput:(e:Event)=>{const text=(e.target as HTMLInputElement).value;setValue(['float','int'].includes(descriptor.type)?text===''?'':Number(text):text);}});
  return h(FormField,{key:controlId,controlId,label,hint:extra.hint??fieldHint(descriptor,s.locale),error:fieldError(controlId),class:descriptor.type==='list'||descriptor.type==='dict'?'ui-field-wide':undefined},{default:({controlAttrs}:FormFieldSlot)=>control(controlAttrs)});
 }
 const savedAccount=(id:string)=>s.snapshot?.config.providers.find((a:Dict)=>a.id===id);
 const saveActions=()=>h(ActionBar,{},()=>[
  button(t('web.settings.save'),{type:'primary','data-action':'save',disabled:ordinaryDisabled()||!controller.dirty()||Object.keys(errors.value).length>0,onClick:async()=>{if(await controller.save()&&s.route==='accounts'&&s.selected)await controller.refreshUnits();}}),
  button(t('web.settings.discard'),{disabled:ordinaryDisabled()||!controller.dirty(),onClick:()=>controller.discard()}),
  controller.dirty()?h('span',{class:'dirty-indicator'},t('web.settings.unsaved')):h('span',{class:'quota-muted'},t('web.settings.separate_credentials')),
 ]);
 const credentialPanel=(account:Dict)=>h(Surface,{title:t('web.credential.title'),eyebrow:t('web.credential.eyebrow')},{default:()=>[
  h(StatusHint,{},()=> t('web.credential.separate')),
  !savedAccount(account.id)?h(StatusHint,{tone:'warning'},()=> t('web.credential.save_account')):null,
  controller.dirty()?h(StatusHint,{tone:'warning'},()=> t('web.credential.finish_settings')):null,
  ...[...credentialFields(account,s.locale),...Object.entries(s.snapshot?.credentials[account.id]||{}).filter(([key,status])=>status.configured&&!credentialFields(account,s.locale).some((item:Dict)=>item.key===key)).map(([key])=>({key,label:t('web.credential.legacy_field',{field:key})}))].map(({key,label}:Dict)=>{const status=s.snapshot?.credentials[account.id]?.[key];const editing=s.secret?.account===account.id&&s.secret?.field===key;return h('section',{class:'quota-credential',key},[
   h('h3',label),h('p',{class:'ui-badge','data-testid':'credential-status'},!status?t('web.credential.status_unread'):!status.configured?t('web.credential.missing'):status.source==='environment'?t('web.credential.environment_status'):t('web.credential.encrypted_status')),
   status?.configured?h(StatusHint,{},()=> t('web.credential.saved_hint')):null,
   editing?h('form',{autocomplete:'off',onSubmit:(e:Event)=>{e.preventDefault();void controller.replace();}},[
    h('div',{class:'ui-segmented','aria-label':t('web.credential.new_source')},[button(t('web.credential.enter_new'),{'aria-pressed':s.secret?.mode==='value',disabled:s.busy,onClick:()=>controller.beginSecret(account.id,key,'value')}),button(t('web.credential.use_environment'),{'aria-pressed':s.secret?.mode==='environment',disabled:s.busy,onClick:()=>controller.beginSecret(account.id,key,'environment')})]),
    h(FormField,{controlId:'credential-new-value',label:s.secret?.mode==='environment'?t('web.credential.environment_name'):t('web.credential.new_value'),hint:s.secret?.mode==='environment'?t('web.credential.environment_hint'):t('web.credential.new_value_hint')},{default:({controlAttrs}:FormFieldSlot)=>h('input',{...controlAttrs,class:'ui-control',type:s.secret?.mode==='environment'?'text':'password',value:s.secret?.mode==='environment'?s.secret?.environment:s.secret?.value,autocomplete:'new-password',spellcheck:false,autocapitalize:'none',maxlength:8192,disabled:credentialDisabled(),onInput:(e:Event)=>controller.changeSecret(s.secret?.mode==='environment'?'environment':'value',(e.target as HTMLInputElement).value)})}),
    h(ActionBar,{},()=>[button(t('web.credential.save_new'),{type:'primary',attrType:'submit','data-action':'credential-save',disabled:credentialDisabled()}),button(t('web.credential.cancel_entry'),{disabled:s.busy,onClick:()=>controller.cancelSecret()})]),
   ]):h(ActionBar,{},()=>[button(t('web.credential.replace'),{'data-action':'credential-replace',disabled:credentialDisabled()||!savedAccount(account.id),onClick:()=>controller.beginSecret(account.id,key)}),button(t('web.credential.clear'),{'data-action':'credential-clear',disabled:ordinaryDisabled()||controller.dirty()||!status?.configured,onClick:()=>void guard('credential-clear',()=>[t('web.credential.clear_title',{credential:credentialFields(account,s.locale).find(item=>item.key===key)?.label??t('web.credential.legacy_field',{field:key})}),t('web.credential.clear_body',{account:account.display_name}),t('web.credential.confirm_clear')],()=>controller.clear(account.id,key))})]),
  ]);}),
  h('p',{class:'quota-muted'},''),
 ]});

 const statusLabels:Record<string,string>={unit_unidentified:'web.status.unit_unidentified',units_ambiguous:'web.status.units_ambiguous',unit_changed:'web.status.unit_changed',waiting_budget:'web.status.waiting_budget',disabled:'web.status.disabled',waiting:'web.status.waiting',monitoring:'web.status.monitoring',recovering:'web.status.recovering',submitted:'web.status.submitted',storage_unavailable:'web.status.storage_unavailable',ready:'web.status.waiting',normal:'web.status.normal',low:'web.status.low',recovered:'web.status.recovered',pending:'web.status.pending',pending_send:'web.status.pending_send',sent:'web.status.accepted',accepted:'web.status.accepted',unknown:'web.status.unknown',send_unknown:'web.status.unknown',failed:'web.status.failed',send_failed:'web.status.failed',paused:'web.status.paused',auth_paused:'web.status.auth_paused',blocked:'web.status.blocked',incomplete:'web.status.incomplete',error:'web.status.error',stale:'web.status.stale'};
 const runtimeStatus=(accountId?:string)=>{
  const runtime=s.alertStatus,entry=accountId?runtime?.accounts.find(a=>a.account_id===accountId):null;
  return h('div',{class:'quota-alert-runtime'},[
   h('div',{class:'quota-alert-runtime-heading'},[h('strong',t('web.runtime.title')),button(s.alertBusy?t('web.runtime.loading'):t('web.runtime.refresh'),{text:true,'data-action':'alert-status',disabled:!s.ready||s.busy||s.alertBusy,onClick:()=>void controller.refreshAlerts()})]),
   s.alertNotice?h('p',{class:'quota-muted'},s.alertNotice):null,
   runtime?h(StatusHint,{tone:!runtime.storage_available||entry?.status==='storage_unavailable'||entry?.status==='failed'?'error':!runtime.running||entry&&['low','recovering','unknown','error','stale','blocked','paused','units_ambiguous','unit_changed','waiting_budget'].includes(entry.status)?'warning':'neutral'},()=>!runtime.storage_available?t('web.runtime.storage_unavailable'):!runtime.running?t('web.runtime.stopped'):accountId?(entry?t(Object.hasOwn(statusLabels,entry.status)?statusLabels[entry.status]:'web.runtime.unknown_status'):t('web.runtime.no_account_record')):t('web.runtime.running')):null,
   entry?.detail_code||entry?.status==='blocked'?h(StatusHint,{tone:'warning'},()=>alertDetailLabel(entry?.detail_code,s.locale)):null,
   entry?.last_checked_at?h('p',{class:'quota-muted'},[t('web.runtime.last_checked'),h('time',{datetime:entry.last_checked_at},localTime(entry.last_checked_at,s.locale))]):null,
   entry?.last_sent_at?h('p',{class:'quota-muted'},[t('web.runtime.last_sent'),h('time',{datetime:entry.last_sent_at},localTime(entry.last_sent_at,s.locale))]):null,
  ]);
 };
 const unitPanel=(account:Dict,index:number)=>{
  const saved=savedAccount(account.id),keys=['type','service_profile','balance_scope','prefer_split_endpoint','response_mapping','endpoint','region','team_id'];
  const current=!!saved&&keys.every(k=>JSON.stringify(account[k])===JSON.stringify(saved[k]))&&account.balance_alert?.metric===saved.balance_alert?.metric;
  const entry=current?s.units?.accounts.find(a=>a.account_id===account.id):undefined;
  const candidates=entry?.choices.filter(c=>c.metric===(account.balance_alert?.metric||defaultMetric(account)))||[];
  const needsChoice=!!entry&&(['ambiguous','changed'].includes(entry.unit_state)||entry.unit_state==='unidentified'&&candidates.length===1);
  const shown=entry?.unit||fixedAlertUnit(account),choiceId=unitChoices.value[account.id]||'',choice=candidates.find(c=>c.id===choiceId);
  const warning=entry?.unit_state==='ambiguous'?t('web.unit.ambiguous'):entry?.unit_state==='changed'?(entry.change_reason==='metric_changed'?t('web.unit.metric_changed',{previous:metricLabel(entry.binding_metric),current:metricLabel(entry.metric)}):entry.change_reason==='query_identity_changed'?t('web.unit.query_changed'):entry.change_reason==='unit_changed'?t('web.unit.changed'):t('web.unit.metric_or_unit_changed')):entry?.unit_state==='stale'?t('web.unit.candidates_stale'):null;
  const queryDisabled=ordinaryDisabled()||s.unitsBusy||!saved||!current||controller.dirty()||!!s.secret;
  return h('section',{class:'quota-alert-unit','aria-label':t('web.unit.title')},[
   h('div',{class:'quota-alert-runtime-heading'},[h('strong',{'data-testid':'alert-unit'},t('web.unit.current',{unit:shown?unitLabel(shown):t("web.unit.awaiting")})),button(s.unitsBusy?t('web.unit.loading'):t('web.unit.read'),{text:true,'data-action':'alert-units',disabled:!s.ready||s.busy||s.unitsBusy||!saved,onClick:()=>void controller.refreshUnits()})]),
   entry?.unit_state==='verified'?h('p',{class:'quota-muted'},entry.choices_state==='expired'?t('web.unit.verified_expired'):t('web.unit.verified')):null,
   !shown&&!warning?h('p',{class:'quota-muted'},current?(needsChoice?t('web.unit.confirm_observed'):t('web.unit.detect_on_query')):saved?t('web.unit.detect_on_save'):t('web.unit.detect_on_account_save')):null,
   saved&&!current?h('p',{class:'quota-muted'},account.balance_alert?.metric!==saved.balance_alert?.metric?t('web.unit.metric_edited',{metric:metricLabel(account.balance_alert?.metric)}):t('web.unit.query_edited')):null,
   entry?.observed_at?h('p',{class:'quota-muted'},[t('web.unit.recorded'),h('time',{datetime:entry.observed_at},localTime(entry.observed_at,s.locale))]):null,
   warning?h(StatusHint,{tone:'warning'},()=>warning):null,
   needsChoice&&!candidates.length?h('p',{class:'quota-muted'},entry?.choices_state==='expired'?t('web.unit.choices_expired'):t('web.unit.no_choices')):null,
   s.unitsNotice?h(StatusHint,{tone:s.unitsUnknown?'warning':'neutral'},()=>s.unitsNotice):null,
   needsChoice&&candidates.length?h(FormField,{controlId:'field-'+index+'-unit-choice',label:t('web.unit.choose'),hint:controller.dirty()?t('web.settings.save_first'):undefined},{default:({controlAttrs}:FormFieldSlot)=>h('div',{class:'quota-unit-choice'},[
    h('select',{...controlAttrs,class:'ui-control',value:choiceId,disabled:ordinaryDisabled()||s.unitsBusy||controller.dirty()||s.unitsUnknown,onChange:(event:Event)=>{confirmation.cancel();unitChoices.value[account.id]=(event.target as HTMLSelectElement).value;}},[h('option',{value:''},t('web.common.choose')),...candidates.map(c=>h('option',{value:c.id},unitLabel(c.unit)))]),
    button(t('web.unit.confirm'),{'data-action':'alert-bind-unit',disabled:ordinaryDisabled()||s.unitsBusy||s.unitsUnknown||controller.dirty()||!choice,onClick:()=>void guard('maintenance',()=>[t('web.unit.confirm_title',{unit:unitLabel(choice?.unit)}),account.balance_alert?.threshold!==null&&account.balance_alert?.threshold!==undefined?t('web.unit.confirm_threshold',{unit:unitLabel(choice?.unit),threshold:account.balance_alert.threshold}):t('web.unit.confirm_no_threshold',{unit:unitLabel(choice?.unit)}),t('web.unit.confirm')],()=>controller.bindUnit(account.id,choiceId))}),
   ])}):null,
   saved?h('div',{class:'quota-unit-query'},[button(t('web.unit.query'),{'data-action':'alert-refresh-units',disabled:queryDisabled,onClick:()=>void controller.queryUnits(account.id)}),h('p',{class:'quota-muted'},controller.dirty()?t('web.unit.save_before_query'):s.secret?t('web.unit.finish_credential_before_query'):t('web.unit.query_hint'))]):null,
  ]);
 };
 const alertAccountPanel=(account:Dict,index:number)=>{
  const a={...alertDefaults(),...account.balance_alert},prefix='field-'+index+'-balance_alert-',locked=ordinaryDisabled();
  const set=(key:string,value:unknown)=>change(['balance_alert',key],value,index);
  const alertInput=(key:string,label:string,hint:string,placeholder='')=>h(FormField,{controlId:prefix+key,label,hint,error:fieldError(prefix+key)},{default:({controlAttrs}:FormFieldSlot)=>h('input',{...controlAttrs,class:'ui-control',type:'text',inputmode:key.includes('threshold')?'decimal':undefined,value:a[key]??'',placeholder,disabled:locked,autocomplete:'off',spellcheck:false,onInput:(event:Event)=>{const value=(event.target as HTMLInputElement).value;set(key,key.includes('threshold')&&value===''?null:value);for(const field of ['threshold','recovery_threshold'])delete errors.value[prefix+field];try{normalizeAlert({...a,[key]:key.includes('threshold')&&value===''?null:value},account);}catch(error){errors.value[prefix+key]=error;}}})});
  const interval=a.check_interval_minutes,validInterval=Number.isInteger(interval)&&interval>=1&&interval<=4320;
  if(validInterval)sliderValues.value[prefix]=interval;
  const sliderValue=validInterval?interval:sliderValues.value[prefix]??15;
  const changeInterval=(value:string)=>{const n=/^[0-9]+$/.test(value)?Number(value):NaN;if(Number.isInteger(n)&&n>=1&&n<=4320){set('check_interval_minutes',n);delete errors.value[prefix+'check_interval_minutes'];}else{set('check_interval_minutes',value);errors.value[prefix+'check_interval_minutes']=new MessageError('web.validation.interval_input');}};
  const configErrors=alertDraftErrors({...s.draft,providers:[account]},s.locale);
  return h(SettingsGroup,{title:t('web.alert.title'),number:'03'},{default:()=>[
   h(FormField,{controlId:prefix+'enabled',label:t('web.alert.enable_account'),hint:t('web.settings.applies_after_save')},{default:({controlAttrs}:FormFieldSlot)=>h('label',{class:'ui-check-label'},[h('input',{...controlAttrs,type:'checkbox',checked:a.enabled===true,disabled:locked,onChange:(e:Event)=>set('enabled',(e.target as HTMLInputElement).checked)}),h('span',a.enabled?t('web.common.on'):t('web.common.off'))])}),
   configErrors.length?h(StatusHint,{tone:'warning'},()=>configErrors.join(' ')):null,
   h(FormField,{controlId:prefix+'check_interval_minutes',label:t('web.alert.interval'),hint:t('web.alert.interval_hint'),error:fieldError(prefix+'check_interval_minutes')},{default:({controlAttrs}:FormFieldSlot)=>h('div',{class:'quota-alert-interval'},[
    h('div',{class:'quota-alert-interval-controls'},[h('input',{type:'range',id:prefix+'interval-slider','aria-label':t('web.alert.interval_slider'),min:1,max:4320,step:1,value:sliderValue,disabled:locked,onInput:(e:Event)=>changeInterval((e.target as HTMLInputElement).value)}),h('input',{...controlAttrs,class:'ui-control',type:'number',min:1,max:4320,step:1,value:interval,disabled:locked,onInput:(e:Event)=>changeInterval((e.target as HTMLInputElement).value)}),h('span',t('web.alert.minutes'))]),
    h('div',{class:'quota-alert-quick-values',role:'group','aria-label':t('web.alert.quick_group')},[h('span',{class:'quota-muted'},t('web.alert.quick_label')),...[1,15,60,1440,4320].map(v=>button(v>=1440?t('web.alert.interval_days',{count:v/1440}):t('web.alert.interval_minutes',{count:v}),{size:'small','aria-label':t('web.alert.interval_set',{count:v}),'aria-pressed':interval===v,disabled:locked,onClick:()=>changeInterval(String(v))}))]),
   ])}),
   h(FormGrid,{},()=>[
    h(FormField,{controlId:prefix+'metric',label:t('web.alert.metric'),hint:t('web.alert.metric_hint')},{default:({controlAttrs}:FormFieldSlot)=>h('select',{...controlAttrs,class:'ui-control',value:a.metric||defaultMetric(account),disabled:locked,onChange:(e:Event)=>set('metric',(e.target as HTMLSelectElement).value)},metricOptions(account).map((metric:string)=>h('option',{value:metric},metricLabel(metric))))}),
    unitPanel(account,index),
    alertInput('threshold',t('web.alert.threshold'),t('web.alert.threshold_hint'),t('web.alert.threshold_placeholder')),
    alertInput('recovery_threshold',t('web.alert.recovery'),t('web.alert.recovery_hint'),t('web.alert.recovery_placeholder')),
    h(FormField,{controlId:prefix+'repeat_minutes',label:t('web.alert.repeat'),hint:t('web.alert.repeat_hint'),error:fieldError(prefix+'repeat_minutes')},{default:({controlAttrs}:FormFieldSlot)=>h('input',{...controlAttrs,class:'ui-control',type:'number',min:0,max:4320,step:1,value:a.repeat_minutes,disabled:locked,onInput:(e:Event)=>{const text=(e.target as HTMLInputElement).value,n=/^[0-9]+$/.test(text)?Number(text):NaN;set('repeat_minutes',Number.isInteger(n)?n:text);if(!Number.isInteger(n)||n<0||n>4320)errors.value[prefix+'repeat_minutes']=new MessageError('web.validation.repeat_input');else delete errors.value[prefix+'repeat_minutes'];}})}),
   ]),runtimeStatus(account.id),
  ]});
 };
 const targetSettings=()=>h(SettingsGroup,{title:t('web.alert.targets_title'),number:'03'},{default:()=>[
  h(FormField,{controlId:'field-global-balance_alert_targets',label:t('web.alert.targets'),hint:t('web.alert.targets_hint'),error:fieldError('field-global-balance_alert_targets')},{default:({controlAttrs}:FormFieldSlot)=>h('textarea',{...controlAttrs,class:'ui-control quota-targets',rows:5,spellcheck:false,autocomplete:'off',value:raw.value['field-global-balance_alert_targets']??formatTargets(s.draft?.balance_alert_targets),placeholder:[
   'Synthetic-QQ:FriendMessage:10001',
   'Synthetic-QQ:GroupMessage:10002 @10003 @10004',
   'Official-QQ:GroupMessage:ExampleGroupOpenID scene=qq_group',
   'Official-QQ:FriendMessage:ExampleUserOpenID scene=qq_c2c',
  ].join('\n'),disabled:ordinaryDisabled(),onInput:(e:Event)=>{const text=(e.target as HTMLTextAreaElement).value;raw.value['field-global-balance_alert_targets']=text;try{change(['balance_alert_targets'],parseTargetsText(text),null);delete errors.value['field-global-balance_alert_targets'];}catch(error){change(['balance_alert_targets'],text,null);errors.value['field-global-balance_alert_targets']=error;}}})}),
  runtimeStatus(),
 ]});
 const alertAdministration=()=>h(SettingsGroup,{title:t('web.alert.permissions'),number:'04'},{default:()=>[
  h(FormField,{controlId:'field-global-balance_alert_admin_qq_ids',label:t('web.alert.admin_list'),hint:t('web.alert.admin_list_hint'),error:fieldError('field-global-balance_alert_admin_qq_ids')},{default:({controlAttrs}:FormFieldSlot)=>h('textarea',{...controlAttrs,class:'ui-control',rows:3,value:raw.value['field-global-balance_alert_admin_qq_ids']??(Array.isArray(s.draft?.balance_alert_admin_qq_ids)?s.draft?.balance_alert_admin_qq_ids.join('\n'):''),placeholder:t('web.alert.admin_list_placeholder'),disabled:ordinaryDisabled(),onInput:(e:Event)=>{const text=(e.target as HTMLTextAreaElement).value;raw.value['field-global-balance_alert_admin_qq_ids']=text;try{if(/[\p{Cc}\p{Cf}\p{Cs}]/u.test(text.replace(/[\r\n\t]/g,'')))throw new MessageError('web.validation.invisible_chars');const ids=normalizeAdminIds(text.split(/\s+/u).filter(Boolean));change(['balance_alert_admin_qq_ids'],ids,null);delete errors.value['field-global-balance_alert_admin_qq_ids'];}catch(error){change(['balance_alert_admin_qq_ids'],text,null);errors.value['field-global-balance_alert_admin_qq_ids']=error;}}})}),
 ]});
 const alertLlmSettings=()=>h(SettingsGroup,{title:t('web.alert.hints_title'),number:'05'},{default:()=>[
  h(FormField,{controlId:'field-global-balance_alert_llm-enabled',label:t('web.alert.smart_hint'),hint:t('web.alert.smart_hint_help')},{default:({controlAttrs}:FormFieldSlot)=>h('label',{class:'ui-check-label'},[h('input',{...controlAttrs,type:'checkbox',checked:s.draft?.balance_alert_llm?.enabled!==false,disabled:ordinaryDisabled(),onChange:(e:Event)=>change(['balance_alert_llm','enabled'],(e.target as HTMLInputElement).checked,null)}),h('span',s.draft?.balance_alert_llm?.enabled!==false?t('web.common.on'):t('web.common.off'))])}),
 ]});
 function accountEditor(account:Dict,index:number){const descriptors=templateFor(account).items,isExisting=!!savedAccount(account.id),compatible=account.type==='openai_compatible',endpoint=descriptors.endpoint?.items||templates.provider_account.items.endpoint.items,mapping:Dict=templates.provider_account.items.response_mapping.items;
  const gatewayCredential=s.snapshot?.credentials?.[account.id]?.api_key?.configured===true;
  return h(SettingsLayout,{}, {default:()=>[
   h(SettingsGroup,{title:t('web.account.settings'),number:'01'},{default:()=>h(FormGrid,{},()=>[
    field('id',descriptors.id,index,undefined,{locked:isExisting,hint:isExisting?t('web.account.id_locked'):t('web.account.id_hint')}),
    field('display_name',descriptors.display_name,index),field('aliases',descriptors.aliases,index,undefined,{hint:t('web.account.aliases_hint')}),
    field('enabled',descriptors.enabled,index),h('div',{class:'quota-provider-readonly'},[h('span',t('web.account.provider')),h('strong',providerName(account.type,s.locale))]),
    field('timeout_seconds',descriptors.timeout_seconds,index),field('cache_ttl_seconds',descriptors.cache_ttl_seconds,index),
   ])}),
   h(SettingsGroup,{title:t('web.account.provider_settings'),number:'02'},{default:()=>[
    h(StatusHint,{},()=>t(providerHelp(account.type))),
    h(FormGrid,{},()=>[
     ...(descriptors.region?[field('region',descriptors.region,index)]:[]),
     ...(descriptors.team_id?[field('team_id',descriptors.team_id,index,undefined,{label:t('web.field.team_id')})]:[]),
     ...(isGatewayProvider(account.type)?[field('base_url',endpoint.base_url,index,['endpoint','base_url'],{
      label:t('web.field.gateway_origin'),locked:gatewayCredential,
      hint:t(gatewayCredential?'config.wallet_origin_credential':'web.hint.gateway_origin'),
     })]:[]),
     ...(compatible?[field('service_profile',templates.openai_compatible.items.service_profile,index),...(account.service_profile==='grsai'?[field('balance_scope',templates.openai_compatible.items.balance_scope,index)]:[]),
      ...(account.endpoint?.url?[field('url',templates.provider_account.items.endpoint.items.url,index,['endpoint','url'])]:[]),field('base_url',endpoint.base_url,index,['endpoint','base_url']),field('path',endpoint.path,index,['endpoint','path'])]:[]),
    ]),
   ]}),
   metricOptions(account).length?alertAccountPanel(account,index):h(StatusHint,{},()=>t('web.alert.query_only')),
   compatible?h(SettingsGroup,{title:t('web.account.advanced'),number:'04'},{default:()=>[
    field('advanced_options',templates.openai_compatible.items.advanced_options,index),
    account.advanced_options?h('div',{class:'quota-advanced'},[
     h('h3',t('web.account.protocol')),h(FormGrid,{},()=>['method','auth_mode','auth_name','json_body'].map(key=>field(key,endpoint[key],index,['endpoint',key]))),
     h('h3',t('web.account.mapping')),h(StatusHint,{},()=> t('web.account.mapping_hint')),h(FormGrid,{},()=>Object.keys(mapping).map(key=>field(key,mapping[key],index,['response_mapping',key]))),
    ]):null,
   ]}):null,
   saveActions(),
   h('div',{class:'quota-danger-row'},[button(t('web.account.remove'),{disabled:ordinaryDisabled(),onClick:()=>void guard('maintenance',()=>[t('web.account.remove_title',{account:account.display_name}),t('web.account.remove_body'),t('web.account.remove_action')],()=>{controller.cancelSecret();controller.edit((config:Dict)=>config.providers.splice(index,1));s.selected=null;tick.value++;})}),h('span',{class:'quota-muted'},t('web.account.remove_hint'))]),
  ],aside:()=>credentialPanel(account)});
 }
 const accounts=()=>{
  const list=s.draft?.providers||[];const index=s.selected===null?-1:list.findIndex((a:Dict)=>a.id===s.selected),account=list[index];
  if(account)return accountEditor(account,index);
  const addAccount=()=>{
   if(controller.dirty())return;
   const fresh=newAccount(newType.value,s.locale);
   let count=1;
   while(list.some((a:Dict)=>a.id===newType.value+'-'+count))count++;
   fresh.id=newType.value+'-'+count;
   controller.navigate('accounts',fresh.id);
   controller.edit((config:Dict)=>config.providers.push(fresh));
  };
  return h('section',{class:'workspace-index quota-directory'},[
   h('aside',{class:'workspace-aside','aria-label':t('web.account.add_query')},[
    h('h2',{class:'shell-eyebrow'},t('web.account.new')),
    h('label',{for:'new-provider'},t('web.account.provider')),
    h('select',{
     id:'new-provider',class:'ui-control',value:newType.value,disabled:ordinaryDisabled(),
     onChange:(event:Event)=>newType.value=(event.target as HTMLSelectElement).value,
    },providerOptions.map(type=>h('option',{value:type},providerName(type,s.locale)))),
    button(t('web.account.add'),{type:'primary',disabled:ordinaryDisabled()||controller.dirty(),onClick:addAccount}),
    h('p',{class:'workspace-scope-note'},t('web.account.provider_scope')),
   ]),
   h('div',{class:'workspace-catalog'},[
    h('div',{class:'workspace-index-heading'},[h('h2',{class:'shell-eyebrow'},t('web.account.list')),h('span',{class:'workspace-count'},t('web.account.count',{count:list.length}))]),
    !list.length?h('div',{class:'shell-empty'},[h('h2',t('web.account.empty')),h('p',t('web.account.empty_hint'))]):null,
    h('div',{class:'workspace-package-grid'},list.map((a:Dict)=>h('article',{class:'workspace-module',key:a.id},[
     h('div',{class:'workspace-module-heading'},[h(ProviderEmblem,{account:a}),h('div',[h('div',{class:'workspace-module-title'},[h('h2',[h('a',{href:'#/accounts/'+encodeURIComponent(a.id),onClick:(e:Event)=>{e.preventDefault();void navigation('accounts',a.id);}},a.display_name||a.id)]),h('span',{class:'workspace-state'},a.enabled!==false?t('web.account.enabled'):t('web.account.disabled'))]),h('p',{class:'workspace-module-summary'},providerName(a.type,s.locale)+' · '+a.id)])]),
     h('div',{class:'quota-account-meta'},[h('span',credentialFields(a).every(({key}:Dict)=>s.snapshot?.credentials[a.id]?.[key]?.configured||key==='security_token')?t('web.account.credentials_configured'):t('web.account.credentials_pending')),button(t('web.account.settings'),{text:true,disabled:!s.ready,onClick:()=>void navigation('accounts',a.id)})]),
    ]))),
    controller.dirty()?saveActions():null,
   ]),
  ]);
 };
 const globalSettings=()=>h(SettingsLayout,{}, {default:()=>[
  ...globalGroups.map(group=>h(SettingsGroup,{title:t(group.title),number:group.number},{default:()=>h(FormGrid,{},()=>group.keys.map(key=>field(key,globals[key],null)))})),targetSettings(),alertAdministration(),alertLlmSettings(),h(SettingsGroup,{title:t('web.settings.appearance'),number:'06'},{default:()=>h(FormGrid,{},()=>field('language',languageField,null,undefined,{hint:t('web.settings.language_hint')}))}),saveActions(),
 ],aside:()=>h(Surface,{title:t('web.settings.access_title'),eyebrow:t('web.settings.access_eyebrow')},{default:()=>[
  h('p',t('web.settings.admin_access')),h('ul',{class:'quota-guidance'},[
   h('li',t('web.settings.admin_allowlist')),h('li',t('web.settings.private_format')),h('li',t('web.settings.command_access')),h('li',t('web.settings.group_access')),
  ]),h(StatusHint,{},()=> t('web.settings.account_alerts')),
 ]})});
 const maintenance=()=>h(SettingsLayout,{}, {default:()=>h(SettingsGroup,{title:t('web.migration.title'),number:'01'},{default:()=>[
  h('p',t('web.migration.overview')),
  h(StatusHint,{tone:s.snapshot?.migration.pending||s.snapshot?.migration.cleanup_pending||s.snapshot?.migration.legacy_conflict?'warning':'success'},()=>s.snapshot?.migration.legacy_conflict?t('web.migration.conflict'):s.snapshot?.migration.cleanup_pending?t('web.migration.cleanup_pending'):s.snapshot?.migration.pending?t('web.migration.pending'):t('web.migration.no_pending')),
  button(t('web.migration.preview'),{disabled:!s.ready||s.busy||s.stale||controller.dirty(),onClick:()=>void controller.plan()}),
  s.plan?h('div',{class:'quota-migration-plan'},[
   h('h3',t('web.migration.scope')),h('dl',[
    h('dt',t('web.migration.accounts')),h('dd',String(s.plan.account_count)),h('dt',t('web.migration.plaintext')),h('dd',String(s.plan.plaintext_count)),h('dt',t('web.migration.environment')),h('dd',String(s.plan.environment_count)),
   ]),h('p',t('web.migration.cleanup_hint')),
   button(s.plan.cleanup_pending?t('web.migration.retry_cleanup'):t('web.migration.confirm'),{type:'primary',disabled:(!s.plan.pending&&!s.plan.cleanup_pending)||s.plan.legacy_conflict||!s.snapshot?.encryption.ready||s.busy,onClick:()=>void guard('legacy-config',()=>[t('web.migration.confirm_title'),t('web.migration.confirm_body',{count:s.plan!.account_count}),t('web.migration.execute')],()=>controller.migrate())}),
  ]):null,
 ]}),aside:()=>h(Surface,{title:t('web.storage.title'),eyebrow:t('web.storage.eyebrow')},{default:()=>[
  h('p',{class:'ui-badge'},s.snapshot?.encryption.ready?t('web.storage.ready'):t('web.storage.unavailable')),h('p',t('web.storage.key_handling')),h(StatusHint,{},()=> t('web.storage.troubleshooting')),
 ]})});
 const hashChange=()=>{const hash=window.location.hash;window.history.replaceState(null,'',window.location.pathname+window.location.search);const match=/^#\/(accounts|global|maintenance)(?:\/([^/]+))?$/.exec(hash);if(match)void navigation(match[1],match[2]?decodeURIComponent(match[2]):null);};
 const pagehide=()=>controller.close();
 const beforeunload=(event:BeforeUnloadEvent)=>{if(controller.dirty()||s.secret||s.busy){event.preventDefault();event.returnValue='';}};
 onMounted(()=>{controller.start();window.addEventListener('pagehide',pagehide);window.addEventListener('beforeunload',beforeunload);window.addEventListener('hashchange',hashChange);});
 onBeforeUnmount(()=>{confirmation.dispose();controller.close();window.removeEventListener('pagehide',pagehide);window.removeEventListener('beforeunload',beforeunload);window.removeEventListener('hashchange',hashChange);});
 return()=>{tick.value;document.documentElement.dataset.theme=s.theme;document.documentElement.lang=s.locale;document.title=t('web.shell.page_title');const selected=s.draft?.providers.find((a:Dict)=>a.id===s.selected),title=s.route==='global'?t('web.navigation.global'):s.route==='maintenance'?t('web.navigation.maintenance'):selected?selected.display_name:t('web.navigation.accounts');
  return h(UiProvider,{theme:s.theme as 'light'|'dark',locale:s.locale,styleMountTarget:document.head},{default:()=>h('div',{ref:root,class:'game-shell quota-shell','data-theme':s.theme},[
   h('button',{class:'ui-button skip-button',onClick:()=>main.value?.focus()},t('web.navigation.skip')),
   h('aside',{class:'shell-sidebar'},[brand(),h('p',{class:'shell-nav-label'},'QUOTA LINK'),h('nav',{'aria-label':t('web.navigation.primary')},[navLink(t('web.navigation.accounts'),'accounts','account'),navLink(t('web.navigation.global'),'global','settings')]),h('div',{class:'shell-settings-slot'},[navLink(t('web.navigation.maintenance'),'maintenance','maintenance'),h('p',{class:'shell-note'},[t('web.shell.scope'),h('br'),'YOMIHIME SERIES'])])]),
   h('div',{class:'shell-content'},[
    h('div',{class:'shell-mobile'},[brand(),h('nav',{'aria-label':t('web.navigation.mobile')},[navLink(t('web.navigation.accounts'),'accounts','account'),navLink(t('web.navigation.global'),'global','settings'),navLink(t('web.navigation.maintenance'),'maintenance','maintenance')])]),
    h('div',{class:'shell-topbar'},[h('span',t('web.shell.brand_name')),h('span','/'),h('span',title),h('span',{class:'quota-revision'},s.snapshot?t('web.shell.revision',{revision:s.snapshot.revision}):t('web.shell.waiting'))]),
    h('main',{ref:main,id:'main',tabindex:-1},[
     h(PageHeader,{class:'shell-heading',title,eyebrow:t('web.shell.eyebrow'),subtitle:s.route==='accounts'?(selected?t('web.account.editor_subtitle'):t('web.account.list_subtitle')):undefined},{default:()=>h('div',{class:'quota-header-actions'},[selected?button(t('web.navigation.back_to_accounts'),{onClick:()=>void navigation('accounts')}):null,button(t('web.navigation.reload'),{disabled:!s.ready||s.busy,onClick:()=>void reload()})])}),
     h(StatusHint,{tone:s.tone as any,role:s.tone==='error'?'alert':'status',class:'shell-status','data-testid':'status'},()=>s.notice),
     confirmation.render(),
     s.snapshot&&!s.snapshot.encryption.ready?h('div',{class:'quota-warning',role:'status'},t('web.storage.unavailable_warning')):null,
     s.snapshot?.migration.pending&&s.route!=='maintenance'?h('div',{class:'quota-warning'},[h('span',t('web.migration.lock_warning')),button(t('web.migration.open'),{onClick:()=>void navigation('maintenance')})]):null,
     !s.snapshot?h('section',{class:'shell-empty'},[h('h2',s.ready?t('web.shell.loading_config'):t('web.shell.auth_required')),h('p',t('web.shell.open_from_host'))]):s.route==='global'?globalSettings():s.route==='maintenance'?maintenance():accounts(),
    ]),
    h('footer',{class:'shell-footer'},[h('a',{class:'shell-project-link',href:'https://github.com/yomihime/astrbot_plugin_yomihime_quota_link',target:'_blank',rel:'noopener noreferrer'},[h('span',t('web.shell.project_name')),h('span',{class:'shell-project-english'},[' / Yomihime Quota Link ',h('span',{class:'shell-project-spark','aria-hidden':'true'},'✧')])])]),
   ]),
  ])});
 };
}});
const app=createApp(App);app.mount('#app');window.addEventListener('pagehide',()=>app.unmount(),{once:true});
