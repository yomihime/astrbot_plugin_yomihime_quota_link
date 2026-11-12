import {MessageError,errorText,translate} from './i18n.js';
/** Alert configuration has no transport capability. QQ IDs remain strings. */
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const controls=/[\p{Cc}\p{Cf}\p{Cs}]/u;
const positiveId=/^[1-9][0-9]{0,19}$/;
export const alertDefaults=()=>({enabled:false,check_interval_minutes:15,metric:'',unit:'',threshold:null,recovery_threshold:null,repeat_minutes:0});
export const llmDefaults=()=>({enabled:true});
const walletAlertProviders=new Set(['moonshot','stepfun','openrouter','novita','venice','vercel_gateway','pollinations']);
export function defaultMetric(account){return metricOptions(account)[0]??'';}
export function metricOptions(account){
 if(walletAlertProviders.has(account.type))return ['available_balance'];
 if(account.type==='xai')return ['posted_prepaid_balance'];
 return account.type==='alibaba_bailian'?['AvailableAmount','AvailableCashAmount','CreditAmount']:account.type==='deepseek'?['total_balance','granted_balance','topped_up_balance']:account.type==='grsai'||account.type==='openai_compatible'&&account.service_profile==='grsai'?['credit']:account.type==='meinianda'?['site_credit']:account.type==='openai_compatible'?['mapped_balance']:[];
}
export const metricLabels={AvailableAmount:'web.metric.AvailableAmount',AvailableCashAmount:'web.metric.AvailableCashAmount',CreditAmount:'web.metric.CreditAmount',total_balance:'web.metric.total_balance',granted_balance:'web.metric.granted_balance',topped_up_balance:'web.metric.topped_up_balance',credit:'web.metric.credit',site_credit:'web.metric.site_credit',mapped_balance:'web.metric.mapped_balance',available_balance:'provider.wallet.available_balance',posted_prepaid_balance:'provider.xai.posted_balance'};
const unitLabels={credit:'web.metric.credit',site_credit:'web.metric.site_credit'};
export const unitLabel=(unit,locale)=>Object.hasOwn(unitLabels,unit)?translate(unitLabels[unit],locale):unit;
export const metricLabel=(metric,locale)=>translate(Object.hasOwn(metricLabels,metric)?metricLabels[metric]:'web.metric.monitored',locale);
export function localTime(value,locale='zh-CN'){
 const date=new Date(value);if(!Number.isFinite(date.getTime()))return translate('web.common.time_unavailable',locale);
 const options={year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',timeZoneName:'short'};
 try{return new Intl.DateTimeFormat(locale,options).format(date);}catch{return new Intl.DateTimeFormat('zh-CN',options).format(date);}
}
export const alertDetailLabels={session_disabled:'web.detail.session_disabled',session_check_failed:'web.detail.session_check_failed',fixed_hint:'web.detail.fixed_hint',legacy_target_unknown:'web.detail.legacy_target_unknown',target_invalid:'web.detail.target_invalid',target_scene_required:'web.detail.target_scene_required',platform_not_found:'web.detail.platform_not_found',platform_unavailable:'web.detail.platform_unavailable',platform_unsupported:'web.detail.platform_unsupported',mention_unsupported:'web.detail.mention_unsupported',mention_invalid:'web.detail.mention_invalid',transport_unavailable:'web.detail.transport_unavailable',message_components_unavailable:'web.detail.message_components_unavailable'};
export const alertDetailLabel=(code,locale)=>translate(Object.hasOwn(alertDetailLabels,code)?alertDetailLabels[code]:'web.detail.unknown',locale);
export function fixedAlertUnit(account){const metric=defaultMetric(account);return metric==='credit'?'credit':metric==='site_credit'?'site_credit':null;}
export function validateAlertUnits(value){
 const text=(v,max)=>typeof v==='string'&&v.length>0&&[...v].length<=max&&!controls.test(v);
 const unit=v=>text(v,32)&&!(/\s/u).test(v);
 const date=v=>v===null||typeof v==='string'&&v.length<=64&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v));
 if(!record(value)||!Array.isArray(value.accounts)||value.accounts.length>100)throw Error('invalid_response');
 const accounts=new Set();return {accounts:value.accounts.map(a=>{
  if(!record(a)||!text(a.account_id,128)||accounts.has(a.account_id)||!['unidentified','verified','ambiguous','changed','stale'].includes(a.unit_state)||!(a.unit===null||unit(a.unit))||!date(a.observed_at)||!Array.isArray(a.choices)||a.choices.length>20)throw Error('invalid_response');
  if(a.unit_state==='verified'&&!a.unit)throw Error('invalid_response');accounts.add(a.account_id);const choices=new Set();
  for(const key of ['metric','binding_metric'])if(a[key]!==undefined&&!(key==='binding_metric'&&a[key]===null)&&(!text(a[key],64)||(/\s/u).test(a[key])))throw Error('invalid_response');
  if(a.change_reason!==undefined&&!['','metric_changed','query_identity_changed','unit_changed'].includes(a.change_reason))throw Error('invalid_response');
  if(a.choices_state!==undefined&&!['fresh','expired','unavailable'].includes(a.choices_state))throw Error('invalid_response');
  if(a.choices_observed_at!==undefined&&!date(a.choices_observed_at))throw Error('invalid_response');
  if(a.choices_state&&a.choices_state!=='fresh'&&a.choices.length)throw Error('invalid_response');
  return {account_id:a.account_id,unit_state:a.unit_state,unit:a.unit,observed_at:a.observed_at,...Object.fromEntries(['metric','binding_metric','change_reason','choices_state','choices_observed_at'].filter(k=>a[k]!==undefined).map(k=>[k,a[k]])),choices:a.choices.map(c=>{if(!record(c)||(typeof c.id!=='string'||!(/^[0-9a-f]{64}$/).test(c.id))||choices.has(c.id)||!text(c.metric,64)||(/\s/u).test(c.metric)||!unit(c.unit))throw Error('invalid_response');choices.add(c.id);return {id:c.id,metric:c.metric,unit:c.unit};})};
 })};
}
export function parseUmo(value){
 if(typeof value!=='string'||controls.test(value))throw new MessageError('web.validation.umo_invisible');
 const umo=value.trim(),first=umo.indexOf(':'),second=umo.indexOf(':',first+1);
 if([...umo].length>512||/\s/u.test(umo)||first<=0||second<=first+1||second===umo.length-1)throw new MessageError('web.validation.umo_format');
 const type=umo.slice(first+1,second),session=umo.slice(second+1);
 if(!['FriendMessage','GroupMessage','OtherMessage'].includes(type))throw new MessageError('web.validation.umo_type');
 return {umo,type,session};
}
export function normalizeIds(value,limit=100){
 if(!Array.isArray(value)||value.length>limit)throw new MessageError('web.validation.id_limit',{limit});
 const output=[];for(const item of value){if(typeof item!=='string'||controls.test(item)||!positiveId.test(item.trim()))throw new MessageError('web.validation.qq_id');const id=item.trim();if(!output.includes(id))output.push(id);}return output;
}
export function normalizeAdminIds(value){
 if(!Array.isArray(value)||value.length>100)throw new MessageError('web.validation.id_limit',{limit:100});
 const output=[];for(const item of value){if(typeof item!=='string'||controls.test(item)||!(positiveId.test(item.trim())||/^qq_official(?:_webhook)?:[A-Za-z0-9_-]{1,128}$/.test(item.trim())))throw new MessageError('error.alert_config.invalid_admin_id',{label:''});const id=item.trim();if(!output.includes(id))output.push(id);}return output;
}
export function normalizeTargets(value){
 if(!Array.isArray(value)||value.length>20)throw new MessageError('web.validation.target_limit');
 const seen=new Set();return value.map(target=>{
  if(!record(target)||Object.keys(target).some(k=>!['umo','mentions','scene'].includes(k))||!Object.hasOwn(target,'umo')||!Object.hasOwn(target,'mentions'))throw new MessageError('web.validation.target_fields');
  const parsed=parseUmo(target.umo),mentions=normalizeIds(target.mentions,20);
  const hasScene=Object.hasOwn(target,'scene'),scene=target.scene;
  if(hasScene){
   const group=scene==='qq_group'&&parsed.type==='GroupMessage';
   const privateChat=scene==='qq_c2c'&&parsed.type==='FriendMessage';
   if(!(group||privateChat)||mentions.length)throw new MessageError('error.alert_config.invalid_target_scene');
  }else if(mentions.length&&(parsed.type!=='GroupMessage'||!positiveId.test(parsed.session.split('_').at(-1)))){
   throw new MessageError('web.validation.group_mentions');
  }
  if(seen.has(parsed.umo))throw new MessageError('web.validation.duplicate_umo');
  seen.add(parsed.umo);
  return {umo:parsed.umo,mentions,...(hasScene?{scene}:{})};
 });
}
export function parseTargetsText(value){
 if(typeof value!=='string')throw new MessageError('web.validation.targets_text');const targets=[],seen=new Set();
 for(const [index,line]of value.split(/\r\n|\r|\n/).entries()){
  try{
   if(/[\p{Cc}\p{Cf}\p{Cs}]/u.test(line.replaceAll('\t','')))throw new MessageError('web.validation.invisible_chars');
   if(!line.trim())continue;
   const [umo,...suffix]=line.trim().split(/\s+/u);
   const [qualifier]=suffix;
   let draft;
   if(qualifier?.startsWith('scene=')){
    if(suffix.length!==1)throw new MessageError('error.alert_config.invalid_target_scene');
    draft={umo,mentions:[],scene:qualifier.slice('scene='.length)};
   }else{
    if(suffix.some(item=>!item.startsWith('@')))throw new MessageError('web.validation.mentions_suffix');
    draft={umo,mentions:suffix.map(item=>item.slice(1))};
   }
   const target=normalizeTargets([draft])[0];
   if(seen.has(target.umo))throw new MessageError('web.validation.duplicate_umo');seen.add(target.umo);targets.push(target);
   if(targets.length>20)throw new MessageError('web.validation.target_limit');
  }catch(error){throw new MessageError('web.validation.target_line',{line:index+1,message:error instanceof MessageError?error:new MessageError('web.validation.invalid_input')});}
 }
 return targets;
}
export function formatTargets(value){
 if(!Array.isArray(value))return '';
 return value.map(target=>{
  const suffix=target.scene?['scene='+target.scene]:target.mentions.map(id=>'@'+id);
  return [target.umo,...suffix].join(' ');
 }).join('\n');
}
// Compare exact decimal strings without routing thresholds through Number.
export function normalizeDecimal(value){
 if(typeof value!=='string'||controls.test(value))throw new MessageError('web.validation.finite_decimal');
 const text=value.trim();if(text.length>50||!(/^-?(?:0|[1-9][0-9]{0,29})(?:\.[0-9]{1,18})?$/).test(text))throw new MessageError('web.validation.decimal_length');
 return /^-?0(?:\.0+)?$/.test(text)?'0':text;
}
export function decimalParts(value){
 const text=normalizeDecimal(value),[integer,fraction='']=text.split('.');return {n:BigInt(integer.replace('-','')+fraction)*(text.startsWith('-')?-1n:1n),scale:fraction.length};
}
export function compareDecimals(a,b){const x=decimalParts(a),y=decimalParts(b),scale=Math.max(x.scale,y.scale);return x.n*10n**BigInt(scale-x.scale)-y.n*10n**BigInt(scale-y.scale);}
export function normalizeAlert(value,account){
 if(value===undefined)return {...alertDefaults(),metric:defaultMetric(account)};
 if(!record(value)||Object.keys(value).some(k=>!Object.hasOwn(alertDefaults(),k)))throw new MessageError('web.validation.alert_fields');
 const alert={...alertDefaults(),...value};
 if(typeof alert.enabled!=='boolean'||!Number.isInteger(alert.check_interval_minutes)||alert.check_interval_minutes<1||alert.check_interval_minutes>4320)throw new MessageError('web.validation.interval_range');
 if(!Number.isInteger(alert.repeat_minutes)||alert.repeat_minutes<0||alert.repeat_minutes>4320)throw new MessageError('web.validation.repeat_range');
 if(typeof alert.metric!=='string'||controls.test(alert.metric)||alert.metric.trim()&&!metricOptions(account).includes(alert.metric.trim()))throw new MessageError('web.validation.metric');
 alert.metric=alert.metric.trim()||defaultMetric(account);
 if(typeof alert.unit!=='string'||[...alert.unit.trim()].length>32||controls.test(alert.unit)||/\s/u.test(alert.unit.trim()))throw new MessageError('web.validation.unit');
 alert.unit=alert.unit.trim();for(const key of ['threshold','recovery_threshold'])if(alert[key]!==null)alert[key]=normalizeDecimal(alert[key]);
 if(alert.recovery_threshold!==null&&(alert.threshold===null||compareDecimals(alert.recovery_threshold,alert.threshold)<=0n))throw new MessageError('web.validation.recovery_order');
 return alert;
}
export function normalizeLlm(value){
 if(value===undefined)return llmDefaults();
 if(!record(value)||Object.keys(value).some(k=>!['enabled','provider_id','persona_id'].includes(k)))throw new MessageError('web.validation.llm_fields');
 const output={...llmDefaults(),...value};if(typeof output.enabled!=='boolean')throw new MessageError('web.validation.llm_switch');
 for(const key of ['provider_id','persona_id']){if(!Object.hasOwn(output,key))continue;if(typeof output[key]!=='string'||[...output[key].trim()].length>128||controls.test(output[key]))throw new MessageError('web.validation.llm_ids');output[key]=output[key].trim();}return output;
}
export function alertDraftErrors(config,locale){
 const errors=[];let targets=[];
 try{targets=normalizeTargets(config.balance_alert_targets===undefined?[]:config.balance_alert_targets);}catch(error){errors.push(errorText(error,locale));}
 try{normalizeAdminIds(config.balance_alert_admin_qq_ids===undefined?[]:config.balance_alert_admin_qq_ids);}catch(error){errors.push(errorText(error,locale));}
 try{normalizeLlm(config.balance_alert_llm);}catch(error){errors.push(errorText(error,locale));}
 for(const account of config.providers||[]){try{const a=normalizeAlert(account.balance_alert,account);if(a.enabled&&((account.enabled!==undefined&&account.enabled!==true)||a.threshold===null||!a.metric||targets.length===0))throw new MessageError('web.validation.alert_prerequisites');}catch(error){errors.push(translate('web.validation.account_alert',locale,{account:account.display_name||account.id,message:errorText(error,locale)}));}}
 return errors;
}
export function validateAlertStatus(value){
 if(!record(value)||typeof value.running!=='boolean'||typeof value.storage_available!=='boolean'||!Array.isArray(value.accounts)||value.accounts.length>100)throw Error('invalid_response');
 return {running:value.running,storage_available:value.storage_available,accounts:value.accounts.map(a=>{if(!record(a)||typeof a.account_id!=='string'||a.account_id.length>128||typeof a.status!=='string'||!/^[a-z_]{1,64}$/.test(a.status))throw Error('invalid_response');if(a.detail_code!==undefined&&(typeof a.detail_code!=='string'||!(/^[a-z_]{0,64}$/).test(a.detail_code)))throw Error('invalid_response');return {account_id:a.account_id,status:a.status,...(a.detail_code?{detail_code:a.detail_code}:{}),...Object.fromEntries(['last_checked_at','last_sent_at'].filter(k=>typeof a[k]==='string'&&a[k].length<=64&&!controls.test(a[k])).map(k=>[k,a[k]]))};})};
}
