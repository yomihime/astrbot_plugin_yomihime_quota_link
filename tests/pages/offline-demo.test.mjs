import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(new URL('../../pages/frontend/package.json',import.meta.url));
const {JSDOM,VirtualConsole,requestInterceptor}=require('jsdom');
const flush=async()=>{for(let i=0;i<6;i++)await new Promise(r=>setImmediate(r));};
test('standalone HTML uses current production UI with only synthetic memory and no external requests',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'yql-offline-demo-'));let dom;
 try{
  const evidence=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('../../pages/frontend/build-demo.mjs',import.meta.url)),dir],{encoding:'utf8'}));
  const html=readFileSync(evidence.path,'utf8');assert.match(html,/connect-src 'none'/);assert.match(html,/不会真实查询或发送/);assert.match(html,/仅内存保存/);assert.doesNotMatch(html,/<script[^>]+src=/);
  const network=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',e=>errors.push(String(e)));vc.on('warn',e=>errors.push(String(e)));
  dom=new JSDOM(html,{url:'https://offline-synthetic.invalid/',runScripts:'dangerously',resources:{interceptors:[requestInterceptor(request=>{network.push(request.url);return new Response('',{status:403});})]},pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};w.fetch=async(...args)=>{network.push(args[0]);throw Error('network blocked');};}});
  await flush();const w=dom.window,q=s=>w.document.querySelector(s);
  assert.equal(w.__YQL_DEMO__.snapshot().credentials['demo-meinianda'].api_key.source,'missing');assert.equal(w.__YQL_DEMO__.snapshot().credentials['demo-meinianda'].api_key.configured,false);assert.ok(q('#field-global-balance_alert_targets'),'demo opens the actual global configuration screen');assert.equal(q('#field-global-balance_alert_targets').value,'');assert.equal(q('#field-global-balance_alert_admin_qq_ids').value,'');
  const fill=async(s,value)=>{q(s).value=value;q(s).dispatchEvent(new w.Event('input',{bubbles:true}));await flush();};
  await fill('#field-global-balance_alert_targets','synthetic:GroupMessage:12345 @1001 @1001');q('[data-action="save"]').click();await flush();assert.equal(w.__YQL_DEMO__.snapshot().config.balance_alert_targets[0].mentions.length,1);
  await fill('#field-global-balance_alert_targets','synthetic:FriendMessage:12345 @1001');assert.equal(q('[data-action="save"]').disabled,true);assert.match(w.document.body.textContent,/第 1 行/);
  [...w.document.querySelectorAll('button')].find(e=>e.textContent==='放弃修改').click();await flush();
  q('#demo-theme').value='dark';q('#demo-theme').dispatchEvent(new w.Event('change',{bubbles:true}));await flush();assert.equal(w.document.documentElement.dataset.theme,'dark');
  q('#demo-runtime').value='unknown';q('#demo-runtime').dispatchEvent(new w.Event('change',{bubbles:true}));q('[data-action="alert-status"]').click();await flush();
  q('.shell-sidebar a[href="#/accounts"]').click();await flush();q('a[href="#/accounts/demo-aliyun"]').click();await flush();assert.equal(q('#field-0-balance_alert-metric').value,'AvailableAmount');assert.equal(q('#field-0-balance_alert-check_interval_minutes').value,'15');assert.equal(q('#field-0-balance_alert-enabled').checked,false);
  await fill('#field-0-balance_alert-check_interval_minutes','4320');q('[data-action="save"]').click();await flush();assert.equal(w.__YQL_DEMO__.snapshot().config.providers[1].balance_alert.check_interval_minutes,15);
  q('#demo-units').value='changed';q('#demo-units').dispatchEvent(new w.Event('change',{bubbles:true}));q('[data-action="alert-units"]').click();await flush();assert.match(w.document.body.textContent,/监测项已变化：信用额度 → 可用额度/);assert.equal(q('#field-0-unit-choice'),null);
  q('[data-action="alert-refresh-units"]').click();await flush();const choice=q('#field-0-unit-choice');assert.ok(choice);choice.value=choice.options[1].value;choice.dispatchEvent(new w.Event('change',{bubbles:true}));await flush();q('[data-action="alert-bind-unit"]').click();await flush();q('[data-action="cancel-maintenance"]').click();await flush();assert.equal(w.__YQL_DEMO__.calls().filter(op=>op==='admin/alert-bind-unit').length,0);q('[data-action="alert-bind-unit"]').click();await flush();q('[data-action="confirm-maintenance"]').click();await flush();assert.match(w.document.body.textContent,/单位已验证/);
  q('#demo-units').value='expired';q('#demo-units').dispatchEvent(new w.Event('change',{bubbles:true}));q('[data-action="alert-units"]').click();await flush();assert.match(w.document.body.textContent,/已确认的单位仍有效/);
  q('#demo-runtime').value='waiting_budget';q('#demo-runtime').dispatchEvent(new w.Event('change',{bubbles:true}));q('[data-action="alert-status"]').click();await flush();assert.match(w.document.body.textContent,/300 秒 \/ 5 分钟/);
  assert.equal(w.localStorage.length,0);assert.equal(w.sessionStorage.length,0);assert.deepEqual(network,[]);assert.deepEqual(errors,[]);assert.ok(w.__YQL_DEMO__.calls().every(op=>['admin/read','admin/update','admin/alert-status','admin/alert-units','admin/alert-refresh-units','admin/alert-bind-unit'].includes(op)));
 }finally{dom?.window.close();rmSync(dir,{recursive:true,force:true});}
});
