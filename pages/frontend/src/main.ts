import {createApp,defineComponent,h,ref,onMounted,onBeforeUnmount,type VNodeChild} from 'vue';
import {NButton} from 'naive-ui';
import {UiProvider,SettingsLayout,Surface} from './ui/shared-components';
import {PageHeader,SettingsGroup,ActionBar,StatusHint,FormField,FormGrid,type FormFieldSlot} from './ui/components';
import {createInlineConfirmation} from './confirmation';
import {createController} from './controller.js';
import {globals,globalGroups,globalLabels,fieldLabels,templates,providerOptions,newAccount,templateFor,credentialFields,clone} from './config.js';
import {alertDefaults,defaultMetric,metricOptions,metricLabels,normalizeAlert,normalizeIds,normalizeLlm,parseTargetsText,formatTargets,alertDraftErrors,defaultAlertUnit,alertUnitHint} from './alert-config.js';
import './ui/tokens.css';
import './shell.css';
import './quota.css';

declare global {interface Window{AstrBotPluginView:any}}
type Dict=Record<string,any>;
const App=defineComponent({setup(){
 const tick=ref(0),root=ref<HTMLElement|null>(null),main=ref<HTMLElement|null>(null),newType=ref('deepseek'),raw=ref<Record<string,string>>({}),errors=ref<Record<string,string>>({}),sliderValues=ref<Record<string,number>>({});
 const confirmation=createInlineConfirmation(document);const manualUnits=new Set<string>();let lastDraft:unknown;
 const controller=createController(window.AstrBotPluginView,()=>{if(lastDraft!==controller.state.draft){raw.value={};errors.value={};sliderValues.value={};manualUnits.clear();lastDraft=controller.state.draft;}confirmation.invalidate();tick.value++;});
 const s=controller.state;
 const button=(text:string,attrs:Dict={})=>h(NButton,{size:'large',...attrs},()=>text);
 const ordinaryDisabled=()=>!s.ready||s.busy||s.stale||!!s.snapshot?.migration.pending;
 const credentialDisabled=()=>ordinaryDisabled()||controller.dirty()||!s.snapshot?.encryption.ready;
 const guard=async(kind:'navigation'|'credential-clear'|'legacy-config'|'maintenance',title:string,message:string,label:string,action:()=>void|Promise<unknown>)=>{
  const key=controller.interactionKey();if(await confirmation.ask({kind,title,message,confirmLabel:label,isCurrent:()=>key===controller.interactionKey()&&s.ready})){await action();}
 };
 const navigation=async(route:string,selected:string|null=null)=>{
  if(controller.dirty()||s.secret||s.busy){await guard('navigation','离开当前设置？','未保存的设置和凭据输入将清空。已发出的请求无法撤回，结果不明时需重新读取，不会自动重试。','放弃草稿并离开',()=>controller.navigate(route,selected));}
  else controller.navigate(route,selected);
 };
 const reload=async()=>{if(controller.dirty()||s.secret)await guard('navigation','重新读取配置？','这会清空当前未保存的设置和凭据输入。','丢弃草稿并读取',()=>controller.refresh());else await controller.refresh();};
 const icon=(kind:string)=>h('svg',{class:'shell-icon',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':1.5,'aria-hidden':'true'},kind==='account'?[h('rect',{x:3,y:5,width:18,height:14,rx:2}),h('path',{d:'M3 10h18M7 15h4'})]:kind==='settings'?[h('circle',{cx:12,cy:12,r:4}),h('path',{d:'M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2'})]:[h('path',{d:'M4 12a8 8 0 1 1 2 6M4 12V5m0 7h7'})]);
 const navLink=(title:string,route:string,kind:string)=>h('a',{href:'#/'+route,'aria-current':s.route===route?'page':undefined,onClick:(event:Event)=>{event.preventDefault();void navigation(route);}},[icon(kind),h('span',title)]);
 const brand=()=>h('div',{class:'shell-brand'},[h('span',{class:'shell-brand-mark','aria-hidden':'true'},'✧'),h('span',[h('span',{class:'shell-brand-line'},'如月怜的'),h('span',{class:'shell-brand-line'},'额度连结')])]);
 const readPath=(object:Dict,path:string[])=>path.reduce((value,key)=>value?.[key],object);
 const change=(path:string[],value:unknown,index:number|null)=>controller.edit((config:Dict)=>{let target=index===null?config:config.providers[index];for(const key of path.slice(0,-1)){if(!target[key]||typeof target[key]!=='object')target[key]={};target=target[key];}const previousId=index!==null&&path.length===1&&path[0]==='id'?target.id:null;target[path.at(-1)!]=value;if(previousId!==null){controller.renameUnitDraft(previousId,String(value));if(manualUnits.delete(previousId))manualUnits.add(String(value));}if(index!==null&&path.join('.')==='response_mapping.unit'&&!manualUnits.has(config.providers[index].id))controller.suggestUnit(config.providers[index].id);if(index!==null&&path.length===1&&path[0]==='id')s.selected=String(value);});
 const changeProfile=async(index:number,value:string)=>{
  const account=s.draft?.providers[index];if(!account||value===account.service_profile)return;
  const alert=account.balance_alert,protectedRule=alert?.threshold!==null&&alert?.threshold!==undefined||alert?.recovery_threshold!==null&&alert?.recovery_threshold!==undefined||alert?.enabled||!!alert?.unit&&!controller.isSuggestedUnit(account.id);
  const reset=()=>controller.edit((config:Dict)=>{const current=config.providers[index];current.service_profile=value;current.balance_alert={...current.balance_alert,enabled:false,metric:defaultMetric(current),unit:'',threshold:null,recovery_threshold:null};controller.markUnitEdited(current.id);manualUnits.delete(current.id);controller.suggestUnit(current.id);});
  if(protectedRule)await guard('maintenance','更换服务类型并重设预警？','不同服务的指标与单位含义可能不同。确认后将重设预警指标与单位、清空触发和恢复阈值，并关闭预警；请重新核对阈值后再开启。','重设指标与单位并清空阈值',reset);else reset();
 };
 function field(key:string,descriptor:Dict,index:number|null,path:string[]=[key],extra:Dict={}){
  const account=index===null?s.draft:s.draft?.providers[index];if(!account)return null;
  const controlId='field-'+(index===null?'global':index)+'-'+path.join('-'),value=readPath(account,path)??descriptor.default??'',label=((index===null?globalLabels:fieldLabels) as Record<string,string>)[key]||descriptor.description;
  const locked=extra.locked||ordinaryDisabled();
  const setValue=(value:unknown)=>{delete errors.value[controlId];if(index!==null&&path.length===1&&key==='service_profile'){void changeProfile(index,String(value));return;}change(path,value,index);};
  let control:(attrs:FormFieldSlot['controlAttrs'])=>VNodeChild;
  if(descriptor.type==='bool')control=attrs=>h('label',{class:'ui-check-label'},[h('input',{...attrs,type:'checkbox',checked:!!value,disabled:locked,onChange:(e:Event)=>setValue((e.target as HTMLInputElement).checked)}),h('span',value?'已开启':'已关闭')]);
  else if(descriptor.options)control=attrs=>h('select',{...attrs,class:'ui-control',value,disabled:locked,onChange:(e:Event)=>setValue((e.target as HTMLSelectElement).value)},[(!descriptor.options.includes(value)?[h('option',{value},value||'请选择')]:[]),...descriptor.options.map((option:string,i:number)=>h('option',{value:option},descriptor.labels?.[i]||option))]);
  else if(descriptor.type==='list')control=attrs=>h('textarea',{...attrs,class:'ui-control',rows:3,value:raw.value[controlId]??(Array.isArray(value)?value.join('\n'):''),disabled:locked,placeholder:'每行一项',onInput:(e:Event)=>{const text=(e.target as HTMLTextAreaElement).value;raw.value[controlId]=text;setValue(text.split('\n').map(v=>v.trim()).filter(Boolean));}});
  else if(descriptor.type==='dict')control=attrs=>h('textarea',{...attrs,class:'ui-control quota-json',rows:4,value:raw.value[controlId]??JSON.stringify(value||{},null,2),disabled:locked,spellcheck:false,onInput:(e:Event)=>{const text=(e.target as HTMLTextAreaElement).value;raw.value[controlId]=text;try{const parsed=JSON.parse(text||'{}');if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error();setValue(parsed);}catch{errors.value[controlId]='请输入有效的 JSON 对象，不要填写凭据。';}}});
  else control=attrs=>h('input',{...attrs,class:'ui-control',type:['float','int'].includes(descriptor.type)?'number':'text',min:descriptor.type==='int'?1:descriptor.type==='float'?0.001:undefined,max:key==='max_concurrency'?32:key==='total_timeout_seconds'?300:key==='timeout_seconds'?120:key==='cache_ttl_seconds'?86400:undefined,step:descriptor.type==='int'?1:descriptor.type==='float'?'any':undefined,value,disabled:locked,autocomplete:'off',onInput:(e:Event)=>{const text=(e.target as HTMLInputElement).value;setValue(['float','int'].includes(descriptor.type)?text===''?'':Number(text):text);}});
  return h(FormField,{key:controlId,controlId,label,hint:extra.hint??descriptor.hint,error:errors.value[controlId],class:descriptor.type==='list'||descriptor.type==='dict'?'ui-field-wide':undefined},{default:({controlAttrs}:FormFieldSlot)=>control(controlAttrs)});
 }
 const savedAccount=(id:string)=>s.snapshot?.config.providers.find((a:Dict)=>a.id===id);
 const saveActions=()=>h(ActionBar,{},()=>[
  button('保存设置',{type:'primary','data-action':'save',disabled:ordinaryDisabled()||!controller.dirty()||Object.keys(errors.value).length>0,onClick:()=>void controller.save()}),
  button('放弃修改',{disabled:ordinaryDisabled()||!controller.dirty(),onClick:()=>controller.discard()}),
  controller.hasSuggestedUnits()?h('span',{class:'dirty-indicator'},'已填入默认预警单位（尚未保存）'):controller.dirty()?h('span',{class:'dirty-indicator'},'有未保存修改'):h('span',{class:'quota-muted'},'普通设置与凭据分别保存'),
 ]);
 const credentialPanel=(account:Dict)=>h(Surface,{title:'查询凭据',eyebrow:'SOURCE ACCESS'},{default:()=>[
  h(StatusHint,{},()=> '仅显示配置状态，不读取或回显原值。更换、清除分别提交。'),
  !savedAccount(account.id)?h(StatusHint,{tone:'warning'},()=> '请先保存新账户，再配置凭据。'):null,
  controller.dirty()?h(StatusHint,{tone:'warning'},()=> '请先保存或放弃普通设置修改，再操作凭据。'):null,
  ...[...credentialFields(account),...Object.entries(s.snapshot?.credentials[account.id]||{}).filter(([key,status])=>status.configured&&!credentialFields(account).some((item:Dict)=>item.key===key)).map(([key])=>({key,label:'旧版凭据（'+key+'）'}))].map(({key,label}:Dict)=>{const status=s.snapshot?.credentials[account.id]?.[key];const editing=s.secret?.account===account.id&&s.secret?.field===key;return h('section',{class:'quota-credential',key},[
   h('h3',label),h('p',{class:'ui-badge','data-testid':'credential-status'},!status?'状态未读取':!status.configured?'未配置':status.source==='environment'?'已配置 · 环境变量引用':'已配置 · 加密存储'),
   status?.configured?h(StatusHint,{},()=> '凭据已保存，将在余额查询时验证有效性。'):null,
   editing?h('form',{autocomplete:'off',onSubmit:(e:Event)=>{e.preventDefault();void controller.replace();}},[
    h('div',{class:'ui-segmented','aria-label':'新凭据来源'},[button('输入新凭据',{'aria-pressed':s.secret?.mode==='value',disabled:s.busy,onClick:()=>controller.beginSecret(account.id,key,'value')}),button('引用环境变量',{'aria-pressed':s.secret?.mode==='environment',disabled:s.busy,onClick:()=>controller.beginSecret(account.id,key,'environment')})]),
    h(FormField,{controlId:'credential-new-value',label:s.secret?.mode==='environment'?'环境变量名':'新凭据',hint:s.secret?.mode==='environment'?'仅填写环境变量名，例如 QUOTA_API_KEY；凭据值由运行环境提供。':'空值不会清除已有凭据。提交后立即清空输入。'},{default:({controlAttrs}:FormFieldSlot)=>h('input',{...controlAttrs,class:'ui-control',type:s.secret?.mode==='environment'?'text':'password',value:s.secret?.mode==='environment'?s.secret?.environment:s.secret?.value,autocomplete:'new-password',spellcheck:false,autocapitalize:'none',maxlength:8192,disabled:credentialDisabled(),onInput:(e:Event)=>controller.changeSecret(s.secret?.mode==='environment'?'environment':'value',(e.target as HTMLInputElement).value)})}),
    h(ActionBar,{},()=>[button('保存新凭据',{type:'primary',attrType:'submit','data-action':'credential-save',disabled:credentialDisabled()}),button('取消输入',{disabled:s.busy,onClick:()=>controller.cancelSecret()})]),
   ]):h(ActionBar,{},()=>[button('更换凭据',{'data-action':'credential-replace',disabled:credentialDisabled()||!savedAccount(account.id),onClick:()=>controller.beginSecret(account.id,key)}),button('清除凭据',{'data-action':'credential-clear',disabled:ordinaryDisabled()||controller.dirty()||!status?.configured,onClick:()=>void guard('credential-clear','清除 '+label+'？','将移除账户「'+account.display_name+'」的此项凭据或引用。账户设置保留；之后需重新配置才能查询。','确认清除',()=>controller.clear(account.id,key))})]),
  ]);}),
  h('p',{class:'quota-muted'},'凭据草稿仅存在当前页面内存。离开、授权失效或结束会话时清空，不写入浏览器存储。'),
 ]});

 const statusLabels:Record<string,string>={disabled:'预警已关闭',waiting:'等待下次检查',monitoring:'余额监测中',recovering:'额度已回升，尚未达到恢复阈值',submitted:'已提交平台；不代表最终送达',storage_unavailable:'告警状态存储不可用，预警未运行',ready:'等待下次检查',normal:'余额在阈值以上',low:'低于或等于阈值，当前告警持续中',recovered:'余额已恢复',pending:'等待检查',pending_send:'等待合并提醒',sent:'发送请求已受理（不代表送达）',accepted:'发送请求已受理（不代表送达）',unknown:'发送结果未知；不会盲目重试',send_unknown:'发送结果未知；不会盲目重试',failed:'发送失败',send_failed:'发送失败',paused:'认证或权限校验失败；修正配置或手动重试后恢复检查',auth_paused:'凭据被拒绝，检查已暂停',blocked:'配置或目标未通过检查',incomplete:'配置不完整，未启动',error:'检查失败，保留上次告警状态',stale:'结果过期或指标、单位不匹配，不用于预警判断'};
 const runtimeStatus=(accountId?:string)=>{
  const runtime=s.alertStatus,entry=accountId?runtime?.accounts.find(a=>a.account_id===accountId):null;
  return h('div',{class:'quota-alert-runtime'},[
   h('div',{class:'quota-alert-runtime-heading'},[h('strong','运行状态'),button(s.alertBusy?'读取中…':'刷新预警状态',{text:true,'data-action':'alert-status',disabled:!s.ready||s.busy||s.alertBusy,onClick:()=>void controller.refreshAlerts()})]),
   h('p',{class:'quota-muted'},s.alertNotice),
   runtime?h(StatusHint,{tone:!runtime.storage_available||entry?.status==='storage_unavailable'||entry?.status==='failed'?'error':!runtime.running||entry&&['low','recovering','unknown','error','stale','blocked','paused'].includes(entry.status)?'warning':'neutral'},()=>!runtime.storage_available?'告警状态存储不可用，预警未运行。':!runtime.running?'检查任务未运行。':accountId?(entry?statusLabels[entry.status]||'状态已更新，请通过预警命令查看详情。':'此账户尚无运行记录。'):'检查任务已运行；仅配置完整且单独开启的账户参与。'):null,
   entry?.last_checked_at?h('p',{class:'quota-muted'},'最近检查：'+entry.last_checked_at):null,
   entry?.last_sent_at?h('p',{class:'quota-muted'},'最近发送尝试：'+entry.last_sent_at):null,
  ]);
 };
 const alertAccountPanel=(account:Dict,index:number)=>{
  const a={...alertDefaults(),...account.balance_alert},prefix='field-'+index+'-balance_alert-',locked=ordinaryDisabled();
  const set=(key:string,value:unknown)=>change(['balance_alert',key],value,index);
  const alertInput=(key:string,label:string,hint:string,placeholder='')=>h(FormField,{controlId:prefix+key,label,hint,error:errors.value[prefix+key]},{default:({controlAttrs}:FormFieldSlot)=>h('input',{...controlAttrs,class:'ui-control',type:'text',inputmode:key.includes('threshold')?'decimal':undefined,value:a[key]??'',placeholder,disabled:locked,autocomplete:'off',spellcheck:false,onInput:(event:Event)=>{const value=(event.target as HTMLInputElement).value;if(key==='unit'){manualUnits.add(account.id);controller.markUnitEdited(account.id);}set(key,key.includes('threshold')&&value===''?null:value);for(const field of ['threshold','recovery_threshold','unit'])delete errors.value[prefix+field];try{normalizeAlert({...a,[key]:key.includes('threshold')&&value===''?null:value},account);}catch(error){errors.value[prefix+key]=(error as Error).message;}}})});
  const interval=a.check_interval_minutes,validInterval=Number.isInteger(interval)&&interval>=1&&interval<=4320;
  if(validInterval)sliderValues.value[prefix]=interval;
  const sliderValue=validInterval?interval:sliderValues.value[prefix]??15;
  const changeInterval=(value:string)=>{const n=/^[0-9]+$/.test(value)?Number(value):NaN;if(Number.isInteger(n)&&n>=1&&n<=4320){set('check_interval_minutes',n);delete errors.value[prefix+'check_interval_minutes'];}else{set('check_interval_minutes',value);errors.value[prefix+'check_interval_minutes']='请输入 1 至 4320 的整数分钟；不会自动截断或夹值。';}};
  const configErrors=alertDraftErrors({...s.draft,providers:[account]});
  return h(SettingsGroup,{title:'额度预警',number:'03'},{default:()=>[
   h(FormField,{controlId:prefix+'enabled',label:'启用此账户预警',hint:'保存后生效。只提醒明确低于或等于阈值的最新结果；查询错误不会被视为零余额。'},{default:({controlAttrs}:FormFieldSlot)=>h('label',{class:'ui-check-label'},[h('input',{...controlAttrs,type:'checkbox',checked:a.enabled===true,disabled:locked,onChange:(e:Event)=>set('enabled',(e.target as HTMLInputElement).checked)}),h('span',a.enabled?'已选择开启（以保存后运行状态为准）':'已关闭')])}),
   configErrors.length?h(StatusHint,{tone:'warning'},()=>configErrors.join(' ')):null,
   h(FormField,{controlId:prefix+'check_interval_minutes',label:'检查间隔（分钟）',hint:'1 至 4320 分钟，默认 15。拖动滑条或精确输入；两者修改同一个值。',error:errors.value[prefix+'check_interval_minutes']},{default:({controlAttrs}:FormFieldSlot)=>h('div',{class:'quota-alert-interval'},[
    h('div',{class:'quota-alert-interval-controls'},[h('input',{type:'range',id:prefix+'interval-slider','aria-label':'检查间隔滑条（分钟）',min:1,max:4320,step:1,value:sliderValue,disabled:locked,onInput:(e:Event)=>changeInterval((e.target as HTMLInputElement).value)}),h('input',{...controlAttrs,class:'ui-control',type:'number',min:1,max:4320,step:1,value:interval,disabled:locked,onInput:(e:Event)=>changeInterval((e.target as HTMLInputElement).value)}),h('span','分钟')]),
    h('div',{class:'quota-alert-quick-values'},[1,15,60,1440,4320].map(v=>button(String(v),{size:'small',text:true,'aria-label':`设为 ${v} 分钟`,disabled:locked,onClick:()=>changeInterval(String(v))}))),
   ])}),
   h(FormGrid,{},()=>[
    h(FormField,{controlId:prefix+'metric',label:'预警指标',hint:'仅比较这一个指标，不累加现金、可用额度或信用额度。'},{default:({controlAttrs}:FormFieldSlot)=>h('select',{...controlAttrs,class:'ui-control',value:a.metric||defaultMetric(account),disabled:locked,onChange:(e:Event)=>set('metric',(e.target as HTMLSelectElement).value)},metricOptions(account).map((metric:string)=>h('option',{value:metric},(metricLabels as Record<string,string>)[metric]+' · '+metric)))}),
    alertInput('unit','预警单位',alertUnitHint(account)+' 更改响应映射或单位后请复核阈值与单位，数值不会自动换算。','填写实际查询结果的单位'),
    alertInput('threshold','触发阈值','最新余额低于或等于此值时提醒；留空不能启用。','请输入明确阈值'),
    alertInput('recovery_threshold','恢复阈值（可选）','留空使用：触发阈值 + max(阈值绝对值 × 10%, 0.01)。设置时须高于触发阈值。','自动滞回阈值'),
    h(FormField,{controlId:prefix+'repeat_minutes',label:'持续低额重复提醒（分钟）',hint:'0 表示同一轮低额只提醒一次；非零为 1 至 4320 分钟。',error:errors.value[prefix+'repeat_minutes']},{default:({controlAttrs}:FormFieldSlot)=>h('input',{...controlAttrs,class:'ui-control',type:'number',min:0,max:4320,step:1,value:a.repeat_minutes,disabled:locked,onInput:(e:Event)=>{const text=(e.target as HTMLInputElement).value,n=/^[0-9]+$/.test(text)?Number(text):NaN;set('repeat_minutes',Number.isInteger(n)?n:text);if(!Number.isInteger(n)||n<0||n>4320)errors.value[prefix+'repeat_minutes']='请输入 0 至 4320 的整数分钟。';else delete errors.value[prefix+'repeat_minutes'];}})}),
   ]),runtimeStatus(account.id),
  ]});
 };
 const targetSettings=()=>h(SettingsGroup,{title:'额度预警推送目标',number:'03'},{default:()=>[
  h(FormField,{controlId:'field-global-balance_alert_targets',label:'目标 UMO（每行一个）',hint:'每行 UMO 后可用空格追加 @QQ号；不填写 @ 则仅发消息。私聊目标不能附加 @。以下号码仅为合成演示，不是默认收件人。',error:errors.value['field-global-balance_alert_targets']},{default:({controlAttrs}:FormFieldSlot)=>h('textarea',{...controlAttrs,class:'ui-control quota-targets',rows:5,spellcheck:false,autocomplete:'off',value:raw.value['field-global-balance_alert_targets']??formatTargets(s.draft?.balance_alert_targets),placeholder:'Synthetic-QQ:FriendMessage:10001\nSynthetic-QQ:GroupMessage:10002 @10003 @10004',disabled:ordinaryDisabled(),onInput:(e:Event)=>{const text=(e.target as HTMLTextAreaElement).value;raw.value['field-global-balance_alert_targets']=text;try{change(['balance_alert_targets'],parseTargetsText(text),null);delete errors.value['field-global-balance_alert_targets'];}catch(error){change(['balance_alert_targets'],text,null);errors.value['field-global-balance_alert_targets']=(error as Error).message;}}})}),
  h(StatusHint,{},()=> '仅真实 QQ 群适配器支持群内提及，发送前还会核验平台类型。目标地址不会授予管理权限；保存设置不发送测试消息。'),
  runtimeStatus(),
 ]});
 const alertAdministration=()=>h(SettingsGroup,{title:'预警管理权限',number:'04'},{default:()=>[
  h(FormField,{controlId:'field-global-balance_alert_admin_qq_ids',label:'预警管理 QQ 白名单',hint:'每行一个 QQ 号，最多 100 项。可信 QQ 身份命中此名单，或为 AstrBot 内置管理员，任一满足即可管理 /yql alert。',error:errors.value['field-global-balance_alert_admin_qq_ids']},{default:({controlAttrs}:FormFieldSlot)=>h('textarea',{...controlAttrs,class:'ui-control',rows:3,value:raw.value['field-global-balance_alert_admin_qq_ids']??(Array.isArray(s.draft?.balance_alert_admin_qq_ids)?s.draft?.balance_alert_admin_qq_ids.join('\n'):''),placeholder:'每行一个 QQ 号；留空仍允许 AstrBot 内置管理员',disabled:ordinaryDisabled(),onInput:(e:Event)=>{const text=(e.target as HTMLTextAreaElement).value;raw.value['field-global-balance_alert_admin_qq_ids']=text;try{if(/[\p{Cc}\p{Cf}\p{Cs}]/u.test(text.replace(/[\r\n\t]/g,'')))throw Error('不允许控制字符或不可见字符。');const ids=normalizeIds(text.split(/\s+/u).filter(Boolean));change(['balance_alert_admin_qq_ids'],ids,null);delete errors.value['field-global-balance_alert_admin_qq_ids'];}catch(error){change(['balance_alert_admin_qq_ids'],text,null);errors.value['field-global-balance_alert_admin_qq_ids']=(error as Error).message;}}})}),
  h(StatusHint,{},()=> '普通群管理员不会自动获得此权限。名单仅控制预警命令，不改变已有余额查询权限，也不授予本网页访问权。'),
 ]});
 const alertLlmSettings=()=>h(SettingsGroup,{title:'预警提示',number:'05'},{default:()=>[
  h(FormField,{controlId:'field-global-balance_alert_llm-enabled',label:'使用模型润色短提示',hint:'金额、单位、阈值和收件人由程序固定。模型失败、超时或无有效文本时使用固定提示。'},{default:({controlAttrs}:FormFieldSlot)=>h('label',{class:'ui-check-label'},[h('input',{...controlAttrs,type:'checkbox',checked:s.draft?.balance_alert_llm?.enabled!==false,disabled:ordinaryDisabled(),onChange:(e:Event)=>change(['balance_alert_llm','enabled'],(e.target as HTMLInputElement).checked,null)}),h('span',s.draft?.balance_alert_llm?.enabled!==false?'使用模型（带安全回退）':'只使用固定提示')])}),
  h(FormGrid,{},()=>['provider_id','persona_id'].map(key=>h(FormField,{controlId:'field-global-balance_alert_llm-'+key,label:key==='provider_id'?'模型提供商 ID（可选）':'人格 ID（可选）',hint:key==='provider_id'?'留空使用每个目标会话的模型；不是模型 API Key。':'留空不附加人格；仅使用显式选择的人格。',error:errors.value['field-global-balance_alert_llm-'+key]},{default:({controlAttrs}:FormFieldSlot)=>h('input',{...controlAttrs,class:'ui-control',value:s.draft?.balance_alert_llm?.[key]??'',autocomplete:'off',disabled:ordinaryDisabled(),onInput:(e:Event)=>{const text=(e.target as HTMLInputElement).value;change(['balance_alert_llm',key],text,null);delete errors.value['field-global-balance_alert_llm-'+key];try{normalizeLlm(s.draft?.balance_alert_llm);}catch(error){errors.value['field-global-balance_alert_llm-'+key]=(error as Error).message;}}})}))),
 ]});
 function accountEditor(account:Dict,index:number){const descriptors=templateFor(account).items,isExisting=!!savedAccount(account.id),compatible=account.type==='openai_compatible',endpoint=descriptors.endpoint?.items||templates.provider_account.items.endpoint.items,mapping:Dict=templates.provider_account.items.response_mapping.items;
  return h(SettingsLayout,{}, {default:()=>[
   h(SettingsGroup,{title:'账户设置',number:'01'},{default:()=>h(FormGrid,{},()=>[
    field('id',descriptors.id,index,undefined,{locked:isExisting,hint:isExisting?'已有账户 ID 不可修改，避免凭据误绑定。':'使用稳定、唯一的 ID；保存后不可更改。'}),
    field('display_name',descriptors.display_name,index),field('aliases',descriptors.aliases,index,undefined,{hint:'命令与自然语言使用这些别名。每行一项，避免与其他账户重名。'}),
    field('enabled',descriptors.enabled,index),h('div',{class:'quota-provider-readonly'},[h('span','供应商'),h('strong',templates[account.type]?.name||account.type)]),
    field('timeout_seconds',descriptors.timeout_seconds,index),field('cache_ttl_seconds',descriptors.cache_ttl_seconds,index),
   ])}),
   h(SettingsGroup,{title:'供应商设置',number:'02'},{default:()=>[
    h(StatusHint,{},()=>account.type==='deepseek'?'DeepSeek 官方账户余额，查询地址与解析规则已内置。':account.type==='alibaba_bailian'?'查询阿里云 BSS 现金余额、可用额度和信用额度（独立展示，不相加）。请使用具有只读 BSS 权限的 RAM AccessKey，不要填写 DashScope API Key。':account.type==='meinianda'?'查询 Meinianda 账户站内额度（site_credit）。建议缓存至少 60 秒。':account.type==='grsai'?'Grsai 账户积分使用请求令牌 token。固定 POST /client/openapi/getCredits，不使用模型 API Key。':'余额查询使用供应商专属接口，请按其文档配置只读余额接口。'),
    h(FormGrid,{},()=>[
     ...(descriptors.region?[field('region',descriptors.region,index)]:[]),
     ...(compatible?[field('service_profile',templates.openai_compatible.items.service_profile,index),...(account.service_profile==='grsai'?[field('balance_scope',templates.openai_compatible.items.balance_scope,index)]:[]),
      ...(account.endpoint?.url?[field('url',templates.provider_account.items.endpoint.items.url,index,['endpoint','url'])]:[]),field('base_url',endpoint.base_url,index,['endpoint','base_url']),field('path',endpoint.path,index,['endpoint','path'])]:[]),
    ]),
   ]}),
   alertAccountPanel(account,index),
   compatible?h(SettingsGroup,{title:'高级接口与响应映射',number:'04'},{default:()=>[
    field('advanced_options',templates.openai_compatible.items.advanced_options,index),
    account.advanced_options?h('div',{class:'quota-advanced'},[
     h('h3','请求协议'),h(FormGrid,{},()=>['method','auth_mode','auth_name','json_body'].map(key=>field(key,endpoint[key],index,['endpoint',key]))),
     h('h3','余额响应映射'),h(StatusHint,{},()=> '使用 JSON Pointer，例如 /data/remaining。静态请求体和映射中不允许放入凭据。'),h(FormGrid,{},()=>Object.keys(mapping).map(key=>field(key,mapping[key],index,['response_mapping',key]))),
    ]):null,
   ]}):null,
   saveActions(),
   h('div',{class:'quota-danger-row'},[button('移除账户',{disabled:ordinaryDisabled(),onClick:()=>void guard('maintenance','移除账户「'+account.display_name+'」？','将从草稿移除此账户。保存设置后才会生效，并移除其已保存凭据；其他账户不受影响。','从草稿移除',()=>{controller.cancelSecret();controller.edit((config:Dict)=>config.providers.splice(index,1));s.selected=null;tick.value++;})}),h('span',{class:'quota-muted'},'移除操作在保存设置后生效。')]),
  ],aside:()=>credentialPanel(account)});
 }
 const accounts=()=>{
  const list=s.draft?.providers||[];const index=s.selected===null?-1:list.findIndex((a:Dict)=>a.id===s.selected),account=list[index];
  if(account)return accountEditor(account,index);
  return h('section',{class:'workspace-index quota-directory'},[
   h('div',{class:'workspace-catalog'},[
    h('div',{class:'workspace-index-heading'},[h('h2',{class:'shell-eyebrow'},'查询账户'),h('span',{class:'workspace-count'},list.length+' 个账户')]),
    !list.length?h('div',{class:'shell-empty'},[h('h2','还没有查询账户'),h('p','选择供应商添加账户，再单独配置加密凭据。')]):null,
    h('div',{class:'workspace-package-grid'},list.map((a:Dict)=>h('article',{class:'workspace-module',key:a.id},[
     h('div',{class:'workspace-module-heading'},[h('span',{class:'workspace-emblem','aria-hidden':'true'},'◈'),h('div',[h('div',{class:'workspace-module-title'},[h('h2',[h('a',{href:'#/accounts/'+encodeURIComponent(a.id),onClick:(e:Event)=>{e.preventDefault();void navigation('accounts',a.id);}},a.display_name||a.id)]),h('span',{class:'workspace-state'},a.enabled!==false?'已启用':'已停用')]),h('p',{class:'workspace-module-summary'},(templates[a.type]?.name||a.type)+' · '+a.id)])]),
     h('div',{class:'quota-account-meta'},[h('span',credentialFields(a).every(({key}:Dict)=>s.snapshot?.credentials[a.id]?.[key]?.configured||key==='security_token')?'凭据已配置':'待配置凭据'),button('账户设置',{text:true,disabled:!s.ready,onClick:()=>void navigation('accounts',a.id)})]),
    ]))),
    controller.dirty()?saveActions():null,
   ]),
   h('aside',{class:'workspace-aside','aria-label':'添加查询账户'},[h('h2',{class:'shell-eyebrow'},'新建账户'),h('label',{for:'new-provider'},'供应商'),h('select',{id:'new-provider',class:'ui-control',value:newType.value,disabled:ordinaryDisabled(),onChange:(e:Event)=>newType.value=(e.target as HTMLSelectElement).value},providerOptions.map(type=>h('option',{value:type},templates[type].name))),button('添加账户',{type:'primary',disabled:ordinaryDisabled()||controller.dirty(),onClick:()=>{if(controller.dirty())return;const fresh=newAccount(newType.value);let count=1;while(list.some((a:Dict)=>a.id===newType.value+'-'+count))count++;fresh.id=newType.value+'-'+count;controller.navigate('accounts',fresh.id);controller.edit((config:Dict)=>{config.providers.push(fresh);controller.suggestUnit(fresh.id);});}}),h('p',{class:'workspace-scope-note'},'各供应商使用自己的余额协议和查询凭据，不复用模型聊天配置。')]),
  ]);
 };
 const globalSettings=()=>h(SettingsLayout,{}, {default:()=>[
  ...globalGroups.map(group=>h(SettingsGroup,{title:group.title,number:group.number},{default:()=>h(FormGrid,{},()=>group.keys.map(key=>field(key,globals[key],null)))})),targetSettings(),alertAdministration(),alertLlmSettings(),saveActions(),
 ],aside:()=>h(Surface,{title:'权限边界',eyebrow:'QUERY ACCESS'},{default:()=>[
  h('p','此页面仅供 AstrBot 管理员配置。查询权限不会授予管理页面访问权。'),h('ul',{class:'quota-guidance'},[
   h('li','管理员不需要加入私聊白名单。'),h('li','私聊白名单使用完整 平台名:用户ID。'),h('li','/yql 余额查询命令受管理员开关限制；预警命令按独立规则。'),h('li','群聊查询需开启允许群聊，并满足用户白名单限制。'),
  ]),h(StatusHint,{},()=> '账户级超时和缓存可覆盖全局默认值。额度预警须在各账户页面单独开启，并填写阈值、单位和推送目标。'),
 ]})});
 const maintenance=()=>h(SettingsLayout,{}, {default:()=>h(SettingsGroup,{title:'旧配置迁移',number:'01'},{default:()=>[
  h('p','将旧版插件配置中的普通设置、凭据和环境变量引用迁移到独立管理存储。凭据加密保存，不会在页面显示。'),
  h(StatusHint,{tone:s.snapshot?.migration.pending||s.snapshot?.migration.cleanup_pending||s.snapshot?.migration.legacy_conflict?'warning':'success'},()=>s.snapshot?.migration.legacy_conflict?'发现与当前加密存储不同的旧配置。不会自动覆盖现有存储，也不会清理这份新出现的旧配置。请人工核对来源。':s.snapshot?.migration.cleanup_pending?'迁移已保存，但宿主旧字段尚未清理完成。请重新预览后重试清理。':s.snapshot?.migration.pending?'检测到旧版配置，迁移完成前不能保存新设置。':'没有待迁移的旧版配置。'),
  button('读取迁移预览',{disabled:!s.ready||s.busy||s.stale||controller.dirty(),onClick:()=>void controller.plan()}),
  s.plan?h('div',{class:'quota-migration-plan'},[
   h('h3','本次迁移范围'),h('dl',[
    h('dt','账户'),h('dd',String(s.plan.account_count)),h('dt','需要加密的凭据'),h('dd',String(s.plan.plaintext_count)),h('dt','环境变量引用'),h('dd',String(s.plan.environment_count)),
   ]),h('p','仅在迁移成功后清理宿主中的旧配置。若源配置变化，将拒绝执行，请重新预览。'),
   button(s.plan.cleanup_pending?'重试清理旧字段':'确认迁移旧配置',{type:'primary',disabled:(!s.plan.pending&&!s.plan.cleanup_pending)||s.plan.legacy_conflict||!s.snapshot?.encryption.ready||s.busy,onClick:()=>void guard('legacy-config','迁移旧配置？','将迁移预览中的 '+s.plan!.account_count+' 个账户；明文凭据加密后保存，并清理旧版插件字段。不会展示或发送凭据到其他服务。','执行迁移',()=>controller.migrate())}),
  ]):null,
 ]}),aside:()=>h(Surface,{title:'存储安全',eyebrow:'LOCAL ENCRYPTION'},{default:()=>[
  h('p',{class:'ui-badge'},s.snapshot?.encryption.ready?'加密存储就绪':'加密存储不可用'),h('p','主密钥由运行环境管理，不在此页面输入、导出或恢复。'),h(StatusHint,{},()=> '遇到存储故障请检查宿主日志中的安全错误代码。不要在公开日志或截图中粘贴密钥。'),
 ]})});
 const hashChange=()=>{const hash=window.location.hash;window.history.replaceState(null,'',window.location.pathname+window.location.search);const match=/^#\/(accounts|global|maintenance)(?:\/([^/]+))?$/.exec(hash);if(match)void navigation(match[1],match[2]?decodeURIComponent(match[2]):null);};
 const pagehide=()=>controller.close();
 const beforeunload=(event:BeforeUnloadEvent)=>{if(controller.dirty()||s.secret||s.busy){event.preventDefault();event.returnValue='';}};
 onMounted(()=>{controller.start();window.addEventListener('pagehide',pagehide);window.addEventListener('beforeunload',beforeunload);window.addEventListener('hashchange',hashChange);});
 onBeforeUnmount(()=>{confirmation.dispose();controller.close();window.removeEventListener('pagehide',pagehide);window.removeEventListener('beforeunload',beforeunload);window.removeEventListener('hashchange',hashChange);});
 return()=>{tick.value;document.documentElement.dataset.theme=s.theme;document.documentElement.lang=s.locale;const selected=s.draft?.providers.find((a:Dict)=>a.id===s.selected),title=s.route==='global'?'全局设置':s.route==='maintenance'?'配置维护':selected?selected.display_name:'账户管理';
  return h(UiProvider,{theme:s.theme as 'light'|'dark',locale:s.locale,styleMountTarget:document.head},{default:()=>h('div',{ref:root,class:'game-shell quota-shell','data-theme':s.theme},[
   h('button',{class:'ui-button skip-button',onClick:()=>main.value?.focus()},'跳到主要内容'),
   h('aside',{class:'shell-sidebar'},[brand(),h('p',{class:'shell-nav-label'},'QUOTA LINK'),h('nav',{'aria-label':'主导航'},[navLink('账户管理','accounts','account'),navLink('全局设置','global','settings')]),h('div',{class:'shell-settings-slot'},[navLink('配置维护','maintenance','maintenance'),h('p',{class:'shell-note'},['统一查询 · 独立凭据',h('br'),'YOMIHIME SERIES'])])]),
   h('div',{class:'shell-content'},[
    h('div',{class:'shell-mobile'},[brand(),h('nav',{'aria-label':'移动端导航'},[navLink('账户管理','accounts','account'),navLink('全局设置','global','settings'),navLink('配置维护','maintenance','maintenance')])]),
    h('div',{class:'shell-topbar'},[h('span','额度连结'),h('span','/'),h('span',title),h('span',{class:'quota-revision'},s.snapshot?'配置版本 '+s.snapshot.revision:'等待管理会话')]),
    h('main',{ref:main,id:'main',tabindex:-1},[
     h(PageHeader,{class:'shell-heading',title,eyebrow:'YOMIHIME QUOTA LINK / ADMIN',subtitle:s.route==='accounts'?(selected?'配置查询参数与来源凭据。':'管理 AI 服务的余额、用量与额度查询账户。'):undefined},{default:()=>h('div',{class:'quota-header-actions'},[selected?button('返回账户',{onClick:()=>void navigation('accounts')}):null,button('重新读取状态',{disabled:!s.ready||s.busy,onClick:()=>void reload()})])}),
     h(StatusHint,{tone:s.tone as any,role:s.tone==='error'?'alert':'status',class:'shell-status','data-testid':'status'},()=>s.notice),
     confirmation.render(),
     s.snapshot&&!s.snapshot.encryption.ready?h('div',{class:'quota-warning',role:'status'},'加密存储不可用。新的明文凭据不能保存，请先检查运行环境；不会改用明文存储。'):null,
     s.snapshot?.migration.pending&&s.route!=='maintenance'?h('div',{class:'quota-warning'},[h('span','有旧版配置等待迁移。普通设置与凭据操作暂时锁定。'),button('前往迁移',{onClick:()=>void navigation('maintenance')})]):null,
     !s.snapshot?h('section',{class:'shell-empty'},[h('h2',s.ready?'正在读取配置':'需要宿主管理授权'),h('p','请先登录 AstrBot，再从插件详情页打开「额度查询」。')]):s.route==='global'?globalSettings():s.route==='maintenance'?maintenance():accounts(),
    ]),
    h('footer',{class:'shell-footer'},[h('a',{class:'shell-project-link',href:'https://github.com/yomihime/astrbot_plugin_yomihime_quota_link',target:'_blank',rel:'noopener noreferrer'},[h('span','如月怜的额度连结'),h('span',{class:'shell-project-english'},[' / Yomihime Quota Link ',h('span',{class:'shell-project-spark','aria-hidden':'true'},'✧')])])]),
   ]),
  ])});
 };
}});
const app=createApp(App);app.mount('#app');window.addEventListener('pagehide',()=>app.unmount(),{once:true});
