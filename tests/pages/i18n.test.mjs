import assert from 'node:assert/strict';
import {test} from 'node:test';
import enUS from '../../.astrbot-plugin/i18n/en-US.json' with {type: 'json'};
import {errorText,resolveLocale,translate} from '../../pages/frontend/src/i18n.js';
import {parseTargetsText} from '../../pages/frontend/src/alert-config.js';

test('manual preference precedes the AstrBot locale; automatic mode handles aliases and defaults',()=>{
 assert.equal(resolveLocale('ja-JP','en-US'),'ja-JP');
 assert.equal(resolveLocale('auto','zh-Hant'),'zh-TW');
 assert.equal(resolveLocale(undefined,'zh_HK'),'zh-TW');
 assert.equal(resolveLocale(undefined,'zh-Hans-TW'),'zh-CN');
 assert.equal(resolveLocale(undefined,'ja'),'ja-JP');
 assert.equal(resolveLocale(undefined,'EN-gb'),'en-US');
 assert.equal(resolveLocale(undefined,'fr-FR'),'zh-CN');
 assert.equal(resolveLocale(undefined,undefined),'zh-CN');
 assert.equal(resolveLocale(undefined,'not_a_locale'),'zh-CN');
});

test('a missing translation uses Simplified Chinese and preserves named arguments',()=>{
 const id='web.shell.revision',saved=enUS.strings[id];
 delete enUS.strings[id];
 try{assert.equal(translate(id,'en-US',{revision:7}),'配置版本 7');}
 finally{enUS.strings[id]=saved;}
});

test('nested validation errors translate both the line and the cause',()=>{
 assert.throws(()=>parseTargetsText('\ninvalid'),error=>{
  assert.match(errorText(error,'en-US'),/^Line 2: Enter the full UMO/);
  assert.match(errorText(error,'ja-JP'),/^2 行目：完全な UMO/);
  assert.match(error.message,/^第 2 行：请填写完整 UMO/);
  return true;
 });
});
