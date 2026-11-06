import {isLanguage,locales,translate} from './i18n.js';
/** Credential-free descriptors derived from Quota Link v0.1.3's actual schema. */
import {normalizeAlert,normalizeTargets,normalizeIds,normalizeLlm,alertDraftErrors} from './alert-config.js';
import schema from './legacy-schema.json' with {type: 'json'};
/** @type {Record<string, any>} */
export const templates = schema.providers.templates;
export const providerOptions = ['deepseek','alibaba_bailian','grsai','meinianda','openai_compatible'];
export const globals = Object.fromEntries(Object.entries(schema).filter(([key])=>key!=='providers'));
export const languageField = {type:'string',default:'auto',options:['auto',...locales]};
export const globalGroups = [
  {title:'web.settings.query_and_cache',number:'01',keys:['timeout_seconds','total_timeout_seconds','cache_ttl_seconds','max_concurrency']},
  {title:'web.settings.query_access',number:'02',keys:['command_admin_only','private_allowed_user_ids','allow_group_queries','group_allowed_user_ids']},
];
export function clone(value){return JSON.parse(JSON.stringify(value));}
export function defaults(fields){return Object.fromEntries(Object.entries(fields).filter(([key,field])=>key!=='auth'&&!field.secret&&!(['provider_id','persona_id'].includes(key)&&field.invisible)).map(([key,field])=>[key,field.items&&field.type==='object'?defaults(field.items):clone(Object.hasOwn(field,'default')?field.default:'')]));}
export function newAccount(type,locale){const account={...defaults(templates[type].items),__template_key:type,id:'',display_name:providerName(type,locale)};account.balance_alert=normalizeAlert(account.balance_alert,account);return account;}
export function templateFor(account){return (Object.hasOwn(templates,account?.__template_key)?templates[account.__template_key]:null)||(Object.hasOwn(templates,account?.type)?templates[account.type]:null)||templates.provider_account;}
export function providerName(type,locale){
 if(type==='openai_compatible')return translate('web.provider.compatible_name',locale);
 if(type==='provider_account')return translate('web.provider.legacy_name',locale);
 return Object.hasOwn(templates,type)?templates[type].name:type;
}

const compatible=templates.openai_compatible.items,legacy=templates.provider_account.items;
const hintIds=new Map([
 [globals.private_allowed_user_ids,'web.hint.private_allowlist'],
 [templates.meinianda.items.cache_ttl_seconds,'web.hint.meinianda_cache'],
 [templates.grsai.items.region,'web.hint.region'],
 [compatible.service_profile,'web.hint.service_profile'],
 [compatible.balance_scope,'web.hint.balance_scope'],
 [compatible.advanced_options,'web.hint.advanced_options'],
 [compatible.endpoint.items.base_url,'web.hint.base_url'],
 [compatible.endpoint.items.path,'web.hint.path'],
 [compatible.endpoint.items.method,'web.hint.method'],
 [compatible.endpoint.items.auth_mode,'web.hint.auth_mode'],
 [compatible.endpoint.items.auth_name,'web.hint.auth_name'],
 [compatible.endpoint.items.json_body,'web.hint.json_body'],
 [legacy.endpoint.items.url,'web.hint.url'],
 [legacy.endpoint.items.base_url,'web.hint.legacy_base_url'],
 [legacy.endpoint.items.method,'web.hint.legacy_method'],
 [legacy.endpoint.items.auth_name,'web.hint.auth_name'],
 [legacy.endpoint.items.json_body,'web.hint.legacy_json_body'],
 ...['amount_path','unit','unit_path','kind_path','status_values','expiry_path'].map(key=>[legacy.response_mapping.items[key],'web.hint.'+key]),
]);
export function fieldHint(descriptor,locale){
 const id=hintIds.get(descriptor);
 return id?translate(id,locale):undefined;
}
const optionIds={
 region:{china:'web.option.region.cn',global:'web.option.region.overseas'},
 service_profile:{generic:'web.option.profile.generic'},
 balance_scope:{generic:'web.option.scope.none',account:'web.option.scope.account',api_key:'web.option.scope.api_key'},
 auth_mode:{bearer:'web.option.auth.bearer',header:'web.option.auth.header',query:'web.option.auth.query'},
};
export function optionLabel(field,option,locale){
 if(field==='language')return translate('web.language.'+option,locale);
 const labels=Object.hasOwn(optionIds,field)?optionIds[field]:undefined;
 return labels&&Object.hasOwn(labels,option)?translate(labels[option],locale):field==='service_profile'&&option==='grsai'?'Grsai':option;
}
export function credentialFields(account,locale){
  const t=id=>translate(id,locale);
  if(account?.type==='alibaba_bailian')return [{key:'access_key_id',label:'RAM AccessKey ID'},{key:'access_key_secret',label:'RAM AccessKey Secret'},{key:'security_token',label:t('web.credential.optional_sts')}];
  if(account?.type==='grsai'||account?.service_profile==='grsai'&&account?.balance_scope==='account')return [{key:'token',label:t('web.credential.grsai_token')}];
  return [{key:'api_key',label:account?.type==='deepseek'?'DeepSeek API Key':account?.type==='meinianda'?'Meinianda API Key':t('web.credential.balance_key')}];
}
export function visible(field,account){return !field.invisible&&(!field.condition||Object.entries(field.condition).every(([key,value])=>account?.[key]===value));}
export function ordinaryFields(account){return Object.fromEntries(Object.entries(templateFor(account).items).filter(([key])=>key!=='auth'));}
export const fieldLabels={timeout_seconds:'web.field.timeout_seconds',cache_ttl_seconds:'web.field.cache_ttl_seconds',id:'web.field.id',display_name:'web.field.display_name',aliases:'web.field.aliases',enabled:'web.field.enabled',type:'web.account.provider',base_url:'web.field.base_url',path:'web.field.path',url:'web.field.url',method:'web.field.method',auth_mode:'web.field.auth_mode',auth_name:'web.field.auth_name',json_body:'web.field.json_body',amount_path:'web.field.amount_path',total_path:'web.field.total_path',remaining_path:'web.field.remaining_path',used_path:'web.field.used_path',unit:'web.field.unit',unit_path:'web.field.unit_path',kind:'web.field.kind',kind_path:'web.field.kind_path',status_path:'web.field.status_path',status_values:'web.field.status_values',expires_at_path:'web.field.expires_at_path',expiry_path:'web.field.expiry_path',success_path:'web.field.success_path',success_value:'web.field.success_value',failure_path:'web.field.failure_path',failure_value:'web.field.failure_value',service_profile:'web.field.service_profile',balance_scope:'web.field.balance_scope',region:'web.field.region',advanced_options:'web.field.advanced_options'};
export const globalLabels={timeout_seconds:'web.global.timeout_seconds',total_timeout_seconds:'web.global.total_timeout_seconds',cache_ttl_seconds:'web.field.cache_ttl_seconds',max_concurrency:'web.global.max_concurrency',command_admin_only:'web.global.command_admin_only',private_allowed_user_ids:'web.global.private_allowed_user_ids',allow_group_queries:'web.global.allow_group_queries',group_allowed_user_ids:'web.global.group_allowed_user_ids'};
const accountKeys=new Set(['__template_key',...Object.values(templates).flatMap(t=>Object.keys(t.items).filter(k=>k!=='auth'))]);
const endpointKeys=new Set(Object.keys(templates.provider_account.items.endpoint.items));
const mappingKeys=new Set(Object.keys(templates.provider_account.items.response_mapping.items));
const secretKeys=new Set(['auth','api_key','access_key_id','access_key_secret','security_token','token','secret','password','credentials']);
const record=v=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&[Object.prototype,null].includes(Object.getPrototypeOf(v));
function jsonSafe(value,depth=0){if(depth>12)throw Error('invalid_response');if(value===null||typeof value==='boolean'||typeof value==='string')return;if(typeof value==='number'&&Number.isFinite(value))return;if(Array.isArray(value)){value.forEach(v=>jsonSafe(v,depth+1));return;}if(!record(value))throw Error('invalid_response');for(const [key,item]of Object.entries(value)){if(secretKeys.has(key.toLowerCase())||['__proto__','prototype','constructor'].includes(key))throw Error('invalid_response');jsonSafe(item,depth+1);}}
export function validateConfig(config){
 if(!record(config)||config.providers!==undefined&&!Array.isArray(config.providers)||Array.isArray(config.providers)&&config.providers.length>100||Object.keys(config).some(k=>k!=='providers'&&k!=='language'&&!Object.hasOwn(globals,k)))throw Error('invalid_response');
 jsonSafe(config);config=clone({...defaults(globals),...config,providers:config.providers||[]});
 if(config.language!==undefined&&!isLanguage(config.language))config.language='auto';
 for(const account of config.providers){if(record(account)&&account.type===undefined&&providerOptions.includes(account.__template_key))account.type=account.__template_key;if(!record(account)||typeof account.id!=='string'||typeof account.type!=='string'||Object.keys(account).some(k=>!accountKeys.has(k)))throw Error('invalid_response');if(account.endpoint&&(!record(account.endpoint)||Object.keys(account.endpoint).some(k=>!endpointKeys.has(k))))throw Error('invalid_response');if(account.response_mapping&&(!record(account.response_mapping)||Object.keys(account.response_mapping).some(k=>!mappingKeys.has(k))))throw Error('invalid_response');}
 config.balance_alert_targets=normalizeTargets(config.balance_alert_targets);config.balance_alert_admin_qq_ids=normalizeIds(config.balance_alert_admin_qq_ids);config.balance_alert_llm=normalizeLlm(config.balance_alert_llm);for(const account of config.providers)account.balance_alert=normalizeAlert(account.balance_alert,account);
 return clone(config);
}
export function validateSnapshot(value){
 if(!record(value)||!Number.isSafeInteger(value.revision)||value.revision<0)throw Error('invalid_response');
 const config=validateConfig(value.config);
 if(!record(value.credentials)||!record(value.encryption)||typeof value.encryption.ready!=='boolean'||!record(value.migration)||typeof value.migration.pending!=='boolean')throw Error('invalid_response');
 const credentials=Object.create(null);for(const [account,fields]of Object.entries(value.credentials)){if(!record(fields))throw Error('invalid_response');credentials[account]=Object.create(null);for(const [field,status]of Object.entries(fields)){if(!['api_key','token','access_key_id','access_key_secret','security_token','secret','key'].includes(field)||!record(status)||typeof status.configured!=='boolean'||!['encrypted','environment','missing'].includes(status.source)||status.configured!==(status.source!=='missing')||Object.keys(status).some(k=>!['configured','source'].includes(k)))throw Error('invalid_response');credentials[account][field]={configured:status.configured,source:status.source};}}
 return {revision:value.revision,config,credentials,encryption:{ready:value.encryption.ready,state:typeof value.encryption.state==='string'?value.encryption.state:'unknown',reason_code:typeof value.encryption.reason_code==='string'?value.encryption.reason_code:null},migration:{pending:value.migration.pending,account_count:Number.isSafeInteger(value.migration.account_count)?value.migration.account_count:0,cleanup_pending:value.migration.cleanup_pending===true,legacy_conflict:value.migration.legacy_conflict===true}};
}
export function validatePlan(value){if(!record(value)||typeof value.pending!=='boolean'||typeof value.plan_id!=='string'||!value.plan_id||!['account_count','plaintext_count','environment_count'].every(k=>Number.isSafeInteger(value[k])&&value[k]>=0))throw Error('invalid_response');return {plan_id:value.plan_id,pending:value.pending,cleanup_pending:value.cleanup_pending===true,legacy_conflict:value.legacy_conflict===true,account_count:value.account_count,plaintext_count:value.plaintext_count,environment_count:value.environment_count};}
export function validateDraft(config,locale){
 const t=id=>translate(id,locale);
 const errors=[];if(config.language!==undefined&&!isLanguage(config.language))errors.push(t('web.validation.language'));for(const key of ['timeout_seconds','total_timeout_seconds','cache_ttl_seconds','max_concurrency'])if(!(typeof config[key]==='number'&&Number.isFinite(config[key])&&config[key]>0)||key==='max_concurrency'&&!Number.isInteger(config[key]))errors.push(t('web.validation.query_parameters'));
 const ids=new Set();for(const a of config.providers){if(!a.id?.trim()||ids.has(a.id.trim()))errors.push(t('web.validation.account_id'));ids.add(a.id?.trim());if(!a.display_name?.trim())errors.push(t('web.validation.account_name'));for(const key of ['timeout_seconds','cache_ttl_seconds'])if(a[key]!==undefined&&!(typeof a[key]==='number'&&Number.isFinite(a[key])&&a[key]>0))errors.push(t('web.validation.account_positive'));}
 if(config.private_allowed_user_ids?.some(v=>!/^\S+:\S+$/.test(v)))errors.push(t('web.validation.private_allowlist'));
 if(config.timeout_seconds>120||config.total_timeout_seconds>300||config.cache_ttl_seconds>86400||config.max_concurrency>32)errors.push(t('web.validation.global_bounds'));if(config.providers.some(a=>a.timeout_seconds>120||a.cache_ttl_seconds>86400))errors.push(t('web.validation.account_bounds'));return [...new Set([...errors,...alertDraftErrors(config,locale)])];
}
