/** Offline, memory-only review artifact. No API, storage or message transport. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const frontend=dirname(fileURLToPath(import.meta.url));
const output=process.argv[2]?resolve(process.argv[2]):resolve(frontend,'../../../yql-alert-settings-ui-artifacts');
const js=await readFile(resolve(frontend,'../00-quota-link/app.js'),'utf8');
const css=await readFile(resolve(frontend,'../00-quota-link/styles.css'),'utf8');
const bridge=String.raw`
(()=>{
 const copy=x=>JSON.parse(JSON.stringify(x));
 const alert=metric=>({enabled:false,check_interval_minutes:15,metric,unit:'',threshold:null,recovery_threshold:null,repeat_minutes:0});
 const base={timeout_seconds:8,total_timeout_seconds:30,cache_ttl_seconds:60,max_concurrency:4,command_admin_only:true,private_allowed_user_ids:[],allow_group_queries:false,group_allowed_user_ids:[],balance_alert_targets:[],balance_alert_admin_qq_ids:[],balance_alert_llm:{enabled:true},providers:[{id:'demo-aliyun',type:'alibaba_bailian',__template_key:'alibaba_bailian',display_name:'阿里云 · 合成演示账户',aliases:[],enabled:true,timeout_seconds:8,cache_ttl_seconds:60,region:'china',balance_alert:alert('AvailableAmount')},{id:'demo-deepseek',type:'deepseek',__template_key:'deepseek',display_name:'DeepSeek · 合成演示账户',aliases:[],enabled:true,timeout_seconds:8,cache_ttl_seconds:60,balance_alert:alert('total_balance')}]};
 let snap={revision:1,config:copy(base),credentials:{'demo-aliyun':{access_key_id:{configured:false,source:'missing'},access_key_secret:{configured:false,source:'missing'}},'demo-deepseek':{api_key:{configured:false,source:'missing'}}},encryption:{ready:true,state:'synthetic-only',reason_code:null},migration:{pending:false,account_count:0}},context={pluginName:'astrbot_plugin_yomihime_quota_link',pageName:'00-quota-link',session:'offline-synthetic-demo',isDark:false,locale:'zh-CN'},listener=null,status='disabled';
 const calls=[];
 window.AstrBotPluginView={ready:async()=>copy(context),onContext:fn=>{listener=fn;return()=>{listener=null;}},apiPost:async(path,body)=>{
  calls.push(path);
  if(path==='admin/read')return copy(snap);
  if(path==='admin/alert-units')return {accounts:snap.config.providers.map(a=>({account_id:a.id,unit_state:'verified',unit:'CNY',observed_at:'2026-10-27T00:00:00Z',choices:[]}))};
  if(path==='admin/alert-status')return {running:status!=='disabled',storage_available:true,accounts:snap.config.providers.map(a=>({account_id:a.id,status,last_checked_at:'2026-10-27T00:00:00Z'}))};
  if(body.revision!==snap.revision)throw {code:'revision_conflict',status:409};
  if(path==='admin/update'){snap.config=copy(body.config);snap.revision++;return copy(snap);}
  // Only synthetic status is retained; credential values are discarded.
  if(path==='admin/credential-replace'||path==='admin/credential-clear'){snap.credentials[body.account_id]??={};snap.credentials[body.account_id][body.field]={configured:path==='admin/credential-replace',source:path==='admin/credential-replace'?(body.environment?'environment':'encrypted'):'missing'};snap.revision++;return copy(snap);}
  throw {code:'invalid_request',status:400};
 }};
 const theme=document.getElementById('demo-theme'),media=window.matchMedia('(prefers-color-scheme: dark)');
 function applyTheme(){context.isDark=theme.value==='dark'||theme.value==='system'&&media.matches;listener?.(copy(context));}
 theme.addEventListener('change',applyTheme);media.addEventListener?.('change',applyTheme);applyTheme();
 document.getElementById('demo-runtime').addEventListener('change',e=>{status=e.target.value;});
 document.getElementById('demo-alert-example').textContent='【模拟额度预警 · 未发送】\n阿里云 · 合成演示账户\n可用额度：-8.25 CNY\n触发阈值：10.00 CNY（低于或等于）\n现金余额：125.60 CNY；信用额度：300.00 CNY（辅助展示，不相加）\n固定提示：请检查账户余额与付款状态。';
 const observer=new MutationObserver(()=>{if(document.querySelector('.workspace-module')){observer.disconnect();document.querySelector('.shell-sidebar a[href="#/global"]')?.click();}});observer.observe(document.getElementById('app'),{childList:true,subtree:true});
 document.addEventListener('click',event=>{if(event.target.closest?.('a[href^=\"http\"]'))event.preventDefault();});
 // Test-only observable metadata; never contains credential input or a transport.
 window.__YQL_DEMO__={snapshot:()=>copy(snap),calls:()=>[...calls]};
})();
`;
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>YQL 额度预警 · 离线交互预览</title><style>${css}</style><style>body{margin:0}.demo-banner{position:relative;z-index:100000;background:#fff5d5;color:#392f22;padding:16px 24px;font:14px/1.6 system-ui,sans-serif;border-bottom:1px solid #d9b96f}.demo-banner strong{display:block}.demo-tools{display:flex;flex-wrap:wrap;gap:12px 24px;margin-top:8px}.demo-tools label{display:flex;align-items:center;gap:8px}.demo-tools select{padding:5px;border:1px solid #bba87d;border-radius:4px;background:#fff;color:#392f22}.demo-banner details{margin-top:10px}.demo-banner pre{white-space:pre-wrap;font:13px/1.7 system-ui,sans-serif;margin-bottom:0}.game-shell{position:relative}.quota-shell .shell-sidebar{position:absolute;top:0;bottom:0}.quota-shell .ui-settings-aside{position:static}@media(max-width:719px){.demo-banner{padding:12px 16px}.demo-tools{display:grid;gap:8px}.demo-tools label{flex-wrap:wrap}}</style></head><body><header class="demo-banner"><strong>合成预览 · 仅内存保存 · 不会真实查询或发送</strong><span>刷新即重置，请勿填写真实凭据。</span><div class="demo-tools"><label>主题<select id="demo-theme"><option value="system">跟随系统</option><option value="light">浅色</option><option value="dark">深色</option></select></label><label>模拟状态<select id="demo-runtime"><option value="disabled">任务未运行</option><option value="monitoring">余额正常</option><option value="low">持续低额</option><option value="submitted">已提交平台（非最终送达）</option><option value="unknown">发送结果未知</option><option value="error">检查失败</option></select>选择后点页面内“刷新预警状态”</label></div><details><summary>查看模拟告警样例（未发送）</summary><pre id="demo-alert-example"></pre></details></header><div id="app"></div><script>${bridge.replaceAll('</script','<\\/script')}</script><script>${js.replaceAll('</script','<\\/script')}</script></body></html>`;
await mkdir(output,{recursive:true});const file=resolve(output,'YQL-预警配置UI预览.html');await writeFile(file,html);
const evidence={path:file,bytes:Buffer.byteLength(html),sha256:createHash('sha256').update(html).digest('hex'),production_app_sha256:createHash('sha256').update(js).digest('hex'),synthetic:true,no_network:true,no_persistent_storage:true};await writeFile(resolve(output,'demo-build.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
