const ADMIN_PASSWORD_HASH = '482c811da5d5b4bc6d497ffa98491e384619d84e';
const LOGIN_EXPIRY_DAYS = 7;

export function isLoggedIn() {
  const token = localStorage.getItem('adminToken');
  const expiry = localStorage.getItem('adminExpiry');
  
  if (!token || !expiry) return false;
  
  const now = Date.now();
  return now < parseInt(expiry);
}

export function login(password) {
  const hash = sha256(password);
  if (hash === ADMIN_PASSWORD_HASH) {
    const expiry = Date.now() + LOGIN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem('adminToken', hash);
    localStorage.setItem('adminExpiry', expiry.toString());
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminExpiry');
}

export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/admin/login.html';
    return false;
  }
  return true;
}

export function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  return crypto.subtle.digest('SHA-256', msgBuffer)
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

export async function verifyPassword(password) {
  const hash = await sha256(password);
  return hash === ADMIN_PASSWORD_HASH;
}