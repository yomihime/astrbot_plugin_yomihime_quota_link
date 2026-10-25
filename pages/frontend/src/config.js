/** Credential-free descriptors derived from Quota Link v0.1.3's actual schema. */
import schema from './legacy-schema.json' with {type: 'json'};
/** @type {Record<string, any>} */
export const templates = schema.providers.templates;
export const providerOptions = ['deepseek','alibaba_bailian','grsai','meinianda','openai_compatible'];
export const globals = Object.fromEntries(Object.entries(schema).filter(([key])=>key!=='providers'));
export const globalGroups = [
  {title:'查询与缓存',number:'01',keys:['timeout_seconds','total_timeout_seconds','cache_ttl_seconds','max_concurrency']},
  {title:'查询权限',number:'02',keys:['command_admin_only','private_allowed_user_ids','allow_group_queries','group_allowed_user_ids']},
];
export function clone(value){return JSON.parse(JSON.stringify(value));}
export function defaults(fields){return Object.fromEntries(Object.entries(fields).filter(([key,field])=>key!=='auth'&&!field.secret).map(([key,field])=>[key,field.items&&field.type==='object'?defaults(field.items):clone(field.default??'')]));}
export function newAccount(type){return {...defaults(templates[type].items),__template_key:type,id:'',display_name:templates[type].name};}
export function templateFor(account){return (Object.hasOwn(templates,account?.__template_key)?templates[account.__template_key]:null)||(Object.hasOwn(templates,account?.type)?templates[account.type]:null)||templates.provider_account;}
export function credentialFields(account){
  if(account?.type==='alibaba_bailian')return [{key:'access_key_id',label:'RAM AccessKey ID'},{key:'access_key_secret',label:'RAM AccessKey Secret'},{key:'security_token',label:'STS Security Token（可选）'}];
  if(account?.type==='grsai'||account?.service_profile==='grsai'&&account?.balance_scope==='account')return [{key:'token',label:'Grsai 请求令牌 token'}];
  return [{key:'api_key',label:account?.type==='deepseek'?'DeepSeek API Key':account?.type==='meinianda'?'Meinianda API Key':'余额查询 API Key'}];
}
export function visible(field,account){return !field.invisible&&(!field.condition||Object.entries(field.condition).every(([key,value])=>account?.[key]===value));}
export function ordinaryFields(account){return Object.fromEntries(Object.entries(templateFor(account).items).filter(([key])=>key!=='auth'));}
export const fieldLabels={timeout_seconds:'账户超时（秒）',cache_ttl_seconds:'成功结果缓存（秒）',id:'账户 ID',display_name:'显示名称',aliases:'查询别名',enabled:'启用账户',type:'供应商',base_url:'服务地址',path:'接口路径',url:'旧版完整 URL',method:'请求方法',auth_mode:'认证方式',auth_name:'认证参数名',json_body:'静态 JSON 请求体',amount_path:'主余额路径',total_path:'总量路径',remaining_path:'剩余量路径',used_path:'已用量路径',unit:'固定单位',unit_path:'单位路径',kind:'余额类别',kind_path:'类别路径',status_path:'状态路径',status_values:'状态值映射',expires_at_path:'到期时间路径',expiry_path:'旧版到期路径',success_path:'业务成功路径',success_value:'业务成功值',failure_path:'业务失败路径',failure_value:'业务失败值',service_profile:'服务类型',balance_scope:'积分范围',region:'连接区域',advanced_options:'显示高级设置'};
export const globalLabels={timeout_seconds:'单账户超时（秒）',total_timeout_seconds:'整次查询超时（秒）',cache_ttl_seconds:'成功结果缓存（秒）',max_concurrency:'最大并发数',command_admin_only:'命令仅管理员',private_allowed_user_ids:'私聊白名单',allow_group_queries:'允许群聊查询',group_allowed_user_ids:'群聊用户白名单'};
const accountKeys=new Set(['__template_key',...Object.values(templates).flatMap(t=>Object.keys(t.items).filter(k=>k!=='auth'))]);
const endpointKeys=new Set(Object.keys(templates.provider_account.items.endpoint.items));
const mappingKeys=new Set(Object.keys(templates.provider_account.items.response_mapping.items));
const secretKeys=new Set(['auth','api_key','access_key_id','access_key_secret','security_token','token','secret','password','credentials']);
const record=v=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&[Object.prototype,null].includes(Object.getPrototypeOf(v));
function jsonSafe(value,depth=0){if(depth>12)throw Error('invalid_response');if(value===null||typeof value==='boolean'||typeof value==='string')return;if(typeof value==='number'&&Number.isFinite(value))return;if(Array.isArray(value)){value.forEach(v=>jsonSafe(v,depth+1));return;}if(!record(value))throw Error('invalid_response');for(const [key,item]of Object.entries(value)){if(secretKeys.has(key.toLowerCase())||['__proto__','prototype','constructor'].includes(key))throw Error('invalid_response');jsonSafe(item,depth+1);}}
export function validateConfig(config){
 if(!record(config)||config.providers!==undefined&&!Array.isArray(config.providers)||Array.isArray(config.providers)&&config.providers.length>100||Object.keys(config).some(k=>k!=='providers'&&!Object.hasOwn(globals,k)))throw Error('invalid_response');
 jsonSafe(config);config=clone({...defaults(globals),...config,providers:config.providers||[]});for(const account of config.providers){if(record(account)&&account.type===undefined&&providerOptions.includes(account.__template_key))account.type=account.__template_key;if(!record(account)||typeof account.id!=='string'||typeof account.type!=='string'||Object.keys(account).some(k=>!accountKeys.has(k)))throw Error('invalid_response');if(account.endpoint&&(!record(account.endpoint)||Object.keys(account.endpoint).some(k=>!endpointKeys.has(k))))throw Error('invalid_response');if(account.response_mapping&&(!record(account.response_mapping)||Object.keys(account.response_mapping).some(k=>!mappingKeys.has(k))))throw Error('invalid_response');}
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
export function validateDraft(config){
 const errors=[];for(const key of ['timeout_seconds','total_timeout_seconds','cache_ttl_seconds','max_concurrency'])if(!(typeof config[key]==='number'&&Number.isFinite(config[key])&&config[key]>0)||key==='max_concurrency'&&!Number.isInteger(config[key]))errors.push('请填写有效的查询参数。');
 const ids=new Set();for(const a of config.providers){if(!a.id?.trim()||ids.has(a.id.trim()))errors.push('账户 ID 不能为空或重复。');ids.add(a.id?.trim());if(!a.display_name?.trim())errors.push('请填写账户显示名称。');for(const key of ['timeout_seconds','cache_ttl_seconds'])if(a[key]!==undefined&&!(typeof a[key]==='number'&&Number.isFinite(a[key])&&a[key]>0))errors.push('账户超时和缓存必须为正数。');}
 if(config.private_allowed_user_ids?.some(v=>!/^\S+:\S+$/.test(v)))errors.push('私聊白名单需使用 平台名:用户ID。');
 if(config.timeout_seconds>120||config.total_timeout_seconds>300||config.cache_ttl_seconds>86400||config.max_concurrency>32)errors.push('全局参数超出允许范围。');if(config.providers.some(a=>a.timeout_seconds>120||a.cache_ttl_seconds>86400))errors.push('账户超时最多 120 秒，缓存最多 86400 秒。');return [...new Set(errors)];
}
