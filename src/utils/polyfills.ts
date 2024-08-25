import 'react-native-get-random-values';
import {hmac} from '@noble/hashes/hmac';
import {sha256} from '@noble/hashes/sha256';
import * as secp from '@noble/secp256k1';

secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));
secp.etc.hmacSha256Async = (k, ...m) =>
  Promise.resolve(secp.etc.hmacSha256Sync(k, ...m));
