import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeAdminIds,normalizeIds} from '../../pages/frontend/src/alert-config.js';
test('official admin identities stay separate from numeric mentions',()=>{
 assert.deepEqual(normalizeAdminIds(['123','qq_official:Opaque_ABC']),['123','qq_official:Opaque_ABC']);
 assert.throws(()=>normalizeAdminIds(['instance:FriendMessage:OpaqueABC']));
 assert.throws(()=>normalizeIds(['qq_official:OpaqueABC']));
});
