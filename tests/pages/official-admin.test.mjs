import test from 'node:test';
import assert from 'node:assert/strict';
import {formatTargets,normalizeAdminIds,normalizeIds,normalizeTargets,parseTargetsText} from '../../pages/frontend/src/alert-config.js';
test('official admin identities stay separate from numeric mentions',()=>{
 assert.deepEqual(normalizeAdminIds(['123','qq_official:Opaque_ABC']),['123','qq_official:Opaque_ABC']);
 assert.throws(()=>normalizeAdminIds(['instance:FriendMessage:OpaqueABC']));
 assert.throws(()=>normalizeIds(['qq_official:OpaqueABC']));
});

test('mixed OneBot and official QQ target rows round-trip with only explicit scenes',()=>{
 const text=[
  'OneBot:GroupMessage:123 @456',
  'Official:GroupMessage:group_OpenID scene=qq_group',
  'Official:FriendMessage:user_OpenID scene=qq_c2c',
  'Legacy:FriendMessage:existing_OpenID',
 ].join('\n');
 const expected=[
  {umo:'OneBot:GroupMessage:123',mentions:['456']},
  {umo:'Official:GroupMessage:group_OpenID',mentions:[],scene:'qq_group'},
  {umo:'Official:FriendMessage:user_OpenID',mentions:[],scene:'qq_c2c'},
  {umo:'Legacy:FriendMessage:existing_OpenID',mentions:[]},
 ];
 assert.deepEqual(parseTargetsText(text),expected);
 assert.deepEqual(normalizeTargets(expected),expected);
 assert.equal(formatTargets(expected),text);
});

test('official QQ target input rejects wrong message types, extra scenes and mentions',()=>{
 const group='Official:GroupMessage:group_OpenID';
 for(const row of [
  group+' scene=qq_c2c',
  group+' scene=qq_channel',
  group+' scene=qq_group scene=qq_group',
  group+' scene=qq_group @456',
  group+' @456 scene=qq_group',
  'Official:FriendMessage:user_OpenID scene=qq_group',
  'Official:OtherMessage:channel_OpenID scene=qq_group',
 ]){
  assert.throws(()=>parseTargetsText('\n'+row),/第 2 行/);
 }
 assert.throws(()=>normalizeTargets([{umo:group,mentions:['456'],scene:'qq_group'}]));
 assert.throws(()=>normalizeTargets([{umo:group,mentions:[],scene:null}]));
 assert.throws(()=>parseTargetsText(group+'\n'+group+' scene=qq_group'),/第 2 行.*重复/);
});
