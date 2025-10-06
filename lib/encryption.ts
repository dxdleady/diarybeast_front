import CryptoJS from 'crypto-js';
import { keccak256, toBytes } from 'viem';

/**
 * Deterministic encryption key derivation for DiaryBeast
 * Uses wallet address + salt to generate consistent encryption key
 * Works with both EOAs and Smart Wallets across all devices
 */
export function getEncryptionKey(address: string): string {
  const salt = 'DiaryBeast_v1_encryption';
  const combined = `${address.toLowerCase()}_${salt}`;
  return keccak256(toBytes(combined));
}

export function encryptContent(content: string, key: string): string {
  return CryptoJS.AES.encrypt(content, key).toString();
}

export function decryptContent(encrypted: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function hashContent(content: string): `0x${string}` {
  return keccak256(toBytes(content));
}
