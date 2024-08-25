import * as secp from '@noble/secp256k1';
import Aes from 'react-native-aes-crypto';
import 'react-native-get-random-values';
import * as Keychain from 'react-native-keychain';
import EncryptedMessage from '../types/EncryptedMessage';

export async function generateECDHKeys() {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  await storePrivateDHKey(secp.etc.bytesToHex(privateKey));
  return secp.etc.bytesToHex(publicKey);
}

export async function storePrivateDHKey(privateKey: string) {
  await Keychain.setGenericPassword('privateKey', privateKey, {
    service: 'privateKey',
  });
}

export async function retrievePrivateDHKey() {
  const credentials = await Keychain.getGenericPassword({
    service: 'privateKey',
  });
  return credentials ? credentials.password : null;
}

export async function generatePrivateAESKey(
  salt: string,
  privateSessionKey: string,
) {
  const privateAESKey = await Aes.pbkdf2(
    privateSessionKey,
    salt,
    5000,
    256,
    'sha256',
  );
  return privateAESKey;
}

export async function computePrivateSessionKey(otherUserPublicKey: string) {
  const privateKey = await retrievePrivateDHKey();
  if (!privateKey) {
    throw new Error('No private key found');
  }
  const privateKeyBytes = secp.etc.hexToBytes(privateKey);
  const otherPublicKeyBytes = secp.etc.hexToBytes(otherUserPublicKey);
  const privateSessionKey = secp.getSharedSecret(
    privateKeyBytes,
    otherPublicKeyBytes,
  );
  return secp.etc.bytesToHex(privateSessionKey);
}

export async function encryptMessage(
  messageContent: string,
  privateSessionKey: string,
) {
  const salt = await Aes.randomKey(16);
  const privateAESKey = await generatePrivateAESKey(salt, privateSessionKey);
  const iv = await Aes.randomKey(16);
  const cipher = await Aes.encrypt(
    messageContent,
    privateAESKey,
    iv,
    'aes-256-cbc',
  );
  return {
    cipher,
    iv,
    salt,
  };
}

export async function decryptMessage(
  encryptedMessage: EncryptedMessage,
  privateSessionKey: string,
) {
  try {
    const privateAESKey = await generatePrivateAESKey(
      encryptedMessage.salt,
      privateSessionKey,
    );
    const decryptedMessage = await Aes.decrypt(
      encryptedMessage.cipher,
      privateAESKey,
      encryptedMessage.iv,
      'aes-256-cbc',
    );
    return decryptedMessage;
  } catch (error) {
    console.error('Failed to decrypt message:', error);
  }
}
