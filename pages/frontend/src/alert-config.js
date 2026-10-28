/** Alert configuration has no transport capability. QQ IDs remain strings. */
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const controls=/[\p{Cc}\p{Cf}\p{Cs}]/u;
const positiveId=/^[1-9][0-9]{0,19}$/;
export const alertDefaults=()=>({enabled:false,check_interval_minutes:15,metric:'',unit:'',threshold:null,recovery_threshold:null,repeat_minutes:0});
export const llmDefaults=()=>({enabled:true});
export function defaultMetric(account){return account.type==='alibaba_bailian'?'AvailableAmount':account.type==='deepseek'?'total_balance':account.type==='grsai'||account.type==='openai_compatible'&&account.service_profile==='grsai'?'credit':account.type==='meinianda'?'site_credit':account.type==='openai_compatible'?'mapped_balance':'';}
export function metricOptions(account){return account.type==='alibaba_bailian'?['AvailableAmount','AvailableCashAmount','CreditAmount']:account.type==='deepseek'?['total_balance','granted_balance','topped_up_balance']:account.type==='grsai'||account.type==='openai_compatible'&&account.service_profile==='grsai'?['credit']:account.type==='meinianda'?['site_credit']:account.type==='openai_compatible'?['mapped_balance']:[];}
export const metricLabels={AvailableAmount:'可用额度',AvailableCashAmount:'现金余额',CreditAmount:'信用额度',total_balance:'总余额',granted_balance:'赠送余额',topped_up_balance:'充值余额',credit:'积分',site_credit:'站内额度',mapped_balance:'已配置映射余额'};
const unitLabels={credit:'积分',site_credit:'站内额度'};
export const unitLabel=unit=>Object.hasOwn(unitLabels,unit)?unitLabels[unit]:unit;
export const metricLabel=metric=>Object.hasOwn(metricLabels,metric)?metricLabels[metric]:'监测余额';
export function localTime(value,locale='zh-CN'){
 const date=new Date(value);if(!Number.isFinite(date.getTime()))return '时间不可用';
 const options={year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',timeZoneName:'short'};
 try{return new Intl.DateTimeFormat(locale,options).format(date);}catch{return new Intl.DateTimeFormat('zh-CN',options).format(date);}
}
export const alertDetailLabels={session_disabled:'目标会话已停用，请在 AstrBot 中启用会话。',session_check_failed:'无法核对目标会话状态，请检查 AstrBot 会话设置与日志。',fixed_hint:'已使用固定提示。',target_invalid:'推送目标格式无效，请在全局设置中核对 UMO。',platform_not_found:'未找到目标平台实例，请核对 UMO 的平台实例 ID。',platform_unavailable:'目标平台实例暂不可用，请检查连接状态与宿主日志。',platform_unsupported:'目标平台不支持此主动发送方式，请改用支持的推送目标。',mention_unsupported:'目标不支持 QQ 提及，请移除 @ 后缀或使用支持的 QQ 群目标。',mention_invalid:'QQ 提及格式无效，请核对群会话与 @QQ 号。',transport_unavailable:'宿主主动发送接口不可用，请检查 AstrBot 版本与日志。',message_components_unavailable:'消息组件无法构造，请检查宿主组件与日志。'};
export const alertDetailLabel=code=>Object.hasOwn(alertDetailLabels,code)?alertDetailLabels[code]:'暂无明确阻止原因，请核对全局推送目标、平台连接与宿主预警日志。';
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
 if(typeof value!=='string'||controls.test(value))throw Error('UMO 不允许控制字符或不可见字符。');
 const umo=value.trim(),first=umo.indexOf(':'),second=umo.indexOf(':',first+1);
 if([...umo].length>512||/\s/u.test(umo)||first<=0||second<=first+1||second===umo.length-1)throw Error('请填写完整 UMO：平台实例:消息类型:会话 ID。');
 const type=umo.slice(first+1,second),session=umo.slice(second+1);
 if(!['FriendMessage','GroupMessage','OtherMessage'].includes(type))throw Error('消息类型需为 FriendMessage、GroupMessage 或 OtherMessage。');
 return {umo,type,session};
}
export function normalizeIds(value,limit=100){
 if(!Array.isArray(value)||value.length>limit)throw Error(`QQ 号最多 ${limit} 项。`);
 const output=[];for(const item of value){if(typeof item!=='string'||controls.test(item)||!positiveId.test(item.trim()))throw Error('QQ 号须为 1 至 20 位 ASCII 正整数字串；不支持 @all、昵称或 CQ 码。');const id=item.trim();if(!output.includes(id))output.push(id);}return output;
}
export function normalizeTargets(value){
 if(!Array.isArray(value)||value.length>20)throw Error('推送目标最多 20 个。');
 const seen=new Set();return value.map(target=>{
  if(!record(target)||Object.keys(target).some(k=>!['umo','mentions'].includes(k))||!Object.hasOwn(target,'umo')||!Object.hasOwn(target,'mentions'))throw Error('每个目标须包含 UMO 和提及列表。');
  const parsed=parseUmo(target.umo),mentions=normalizeIds(target.mentions,20);
  if(mentions.length&&(parsed.type!=='GroupMessage'||!positiveId.test(parsed.session.split('_').at(-1))))throw Error('仅数字 QQ 群会话可附加 @QQ 号；私聊或其他会话请删除 @ 后缀。');
  if(seen.has(parsed.umo))throw Error('UMO 重复，请合并为一行。');seen.add(parsed.umo);return {umo:parsed.umo,mentions};
 });
}
export function parseTargetsText(value){
 if(typeof value!=='string')throw Error('请输入推送目标。');const targets=[],seen=new Set();
 for(const [index,line]of value.split(/\r\n|\r|\n/).entries()){
  try{
   if(/[\p{Cc}\p{Cf}\p{Cs}]/u.test(line.replaceAll('\t','')))throw Error('不允许控制字符或不可见字符。');
   if(!line.trim())continue;
   const [umo,...suffix]=line.trim().split(/\s+/u);
   if(suffix.some(item=>!item.startsWith('@')))throw Error('UMO 后请使用空格分隔的 @QQ号。');
   const target=normalizeTargets([{umo,mentions:suffix.map(item=>item.slice(1))}])[0];
   if(seen.has(target.umo))throw Error('UMO 重复，请合并为一行。');seen.add(target.umo);targets.push(target);
   if(targets.length>20)throw Error('推送目标最多 20 个。');
  }catch(error){throw Error(`第 ${index+1} 行：${error.message}`);}
 }
 return targets;
}
export function formatTargets(value){return Array.isArray(value)?value.map(t=>[t.umo,...t.mentions.map(id=>'@'+id)].join(' ')).join('\n'):'';}
// Compare exact decimal strings without routing thresholds through Number.
export function normalizeDecimal(value){
 if(typeof value!=='string'||controls.test(value))throw Error('阈值须为不含指数的有限十进制字符串。');
 const text=value.trim();if(text.length>50||!(/^-?(?:0|[1-9][0-9]{0,29})(?:\.[0-9]{1,18})?$/).test(text))throw Error('阈值最多 30 位整数、18 位小数，不支持指数形式。');
 return /^-?0(?:\.0+)?$/.test(text)?'0':text;
}
export function decimalParts(value){
 const text=normalizeDecimal(value),[integer,fraction='']=text.split('.');return {n:BigInt(integer.replace('-','')+fraction)*(text.startsWith('-')?-1n:1n),scale:fraction.length};
}
export function compareDecimals(a,b){const x=decimalParts(a),y=decimalParts(b),scale=Math.max(x.scale,y.scale);return x.n*10n**BigInt(scale-x.scale)-y.n*10n**BigInt(scale-y.scale);}
export function normalizeAlert(value,account){
 if(value===undefined)return {...alertDefaults(),metric:defaultMetric(account)};
 if(!record(value)||Object.keys(value).some(k=>!Object.hasOwn(alertDefaults(),k)))throw Error('预警配置字段无效。');
 const alert={...alertDefaults(),...value};
 if(typeof alert.enabled!=='boolean'||!Number.isInteger(alert.check_interval_minutes)||alert.check_interval_minutes<1||alert.check_interval_minutes>4320)throw Error('检查间隔须为 1 至 4320 的整数分钟。');
 if(!Number.isInteger(alert.repeat_minutes)||alert.repeat_minutes<0||alert.repeat_minutes>4320)throw Error('重复提醒须为 0 至 4320 的整数分钟；0 表示不重复。');
 if(typeof alert.metric!=='string'||controls.test(alert.metric)||alert.metric.trim()&&!metricOptions(account).includes(alert.metric.trim()))throw Error('请选择该供应商支持的预警指标。');
 alert.metric=alert.metric.trim()||defaultMetric(account);
 if(typeof alert.unit!=='string'||[...alert.unit.trim()].length>32||controls.test(alert.unit)||/\s/u.test(alert.unit.trim()))throw Error('单位须为不超过 32 字的明确文本。');
 alert.unit=alert.unit.trim();for(const key of ['threshold','recovery_threshold'])if(alert[key]!==null)alert[key]=normalizeDecimal(alert[key]);
 if(alert.recovery_threshold!==null&&(alert.threshold===null||compareDecimals(alert.recovery_threshold,alert.threshold)<=0n))throw Error('恢复阈值须严格大于触发阈值。');
 return alert;
}
export function normalizeLlm(value){
 if(value===undefined)return llmDefaults();
 if(!record(value)||Object.keys(value).some(k=>!['enabled','provider_id','persona_id'].includes(k)))throw Error('提示模型配置无效。');
 const output={...llmDefaults(),...value};if(typeof output.enabled!=='boolean')throw Error('提示模型开关无效。');
 for(const key of ['provider_id','persona_id']){if(!Object.hasOwn(output,key))continue;if(typeof output[key]!=='string'||[...output[key].trim()].length>128||controls.test(output[key]))throw Error('模型与人格 ID 须为不超过 128 字的文本。');output[key]=output[key].trim();}return output;
}
export function alertDraftErrors(config){
 const errors=[];let targets=[];
 try{targets=normalizeTargets(config.balance_alert_targets===undefined?[]:config.balance_alert_targets);}catch(error){errors.push(error.message);}
 try{normalizeIds(config.balance_alert_admin_qq_ids===undefined?[]:config.balance_alert_admin_qq_ids);}catch(error){errors.push(error.message);}
 try{normalizeLlm(config.balance_alert_llm);}catch(error){errors.push(error.message);}
 for(const account of config.providers||[]){try{const a=normalizeAlert(account.balance_alert,account);if(a.enabled&&((account.enabled!==undefined&&account.enabled!==true)||a.threshold===null||!a.metric||targets.length===0))throw Error('启用预警前，请启用账户并填写阈值和至少一个全局推送目标。');}catch(error){errors.push(`${account.display_name||account.id}：${error.message}`);}}
 return errors;
}
export function validateAlertStatus(value){
 if(!record(value)||typeof value.running!=='boolean'||typeof value.storage_available!=='boolean'||!Array.isArray(value.accounts)||value.accounts.length>100)throw Error('invalid_response');
 return {running:value.running,storage_available:value.storage_available,accounts:value.accounts.map(a=>{if(!record(a)||typeof a.account_id!=='string'||a.account_id.length>128||typeof a.status!=='string'||!/^[a-z_]{1,64}$/.test(a.status))throw Error('invalid_response');if(a.detail_code!==undefined&&(typeof a.detail_code!=='string'||!(/^[a-z_]{0,64}$/).test(a.detail_code)))throw Error('invalid_response');return {account_id:a.account_id,status:a.status,...(a.detail_code?{detail_code:a.detail_code}:{}),...Object.fromEntries(['last_checked_at','last_sent_at'].filter(k=>typeof a[k]==='string'&&a[k].length<=64&&!controls.test(a[k])).map(k=>[k,a[k]]))};})};
}
