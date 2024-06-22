import CryptoJS from 'crypto-js';
export function encryptWithSymmetricKey(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}
export function decryptWithSymmetricKey(encryptedData, key) {
  const bytes  = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
