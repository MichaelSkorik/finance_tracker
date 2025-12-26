// Простая крипта для localStorage (не серверная безопасность).
// Работает в браузере через WebCrypto.

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromText(s: string) {
  return new TextEncoder().encode(s);
}

export function makeSalt(len = 16) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string, salt: string) {
  const data = fromText(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

export async function verifyPassword(password: string, salt: string, hash: string) {
  const h = await hashPassword(password, salt);
  return h === hash;
}
