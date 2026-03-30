import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

function recoverPublicKey(mensaje, signature) {
  const { r, s, recovery } = signature;

  const msgHash = keccak256(utf8ToBytes(JSON.stringify(mensaje)));
  const sig = new secp256k1.Signature(BigInt(r), BigInt(s), recovery);

  return sig.recoverPublicKey(msgHash);
}