export const API_BASE = 'https://api.github.com/repos';
export const REPO_OWNER = 'your-github-username';
export const REPO_NAME = 'your-repo-name';
export const BRANCH = 'main';

export async function fetchData(path) {
  try {
    const localStorageKey = path.replace(/\//g, '_');
    const localStorageData = localStorage.getItem(localStorageKey);
    
    if (localStorageData) {
      return JSON.parse(localStorageData);
    }
    
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export function saveData(path, data) {
  const localStorageKey = path.replace(/\//g, '_');
  localStorage.setItem(localStorageKey, JSON.stringify(data));
  return true;
}

export async function fetchGitHubFile(filePath) {
  const url = `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.content) {
      return JSON.parse(atob(data.content));
    }
    return null;
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    return null;
  }
}

export async function fetchMarkdownFile(filePath) {
  const url = `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.content) {
      return atob(data.content);
    }
    return null;
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return null;
  }
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);
  const years = Math.floor(diff / 31104000000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  if (weeks < 4) return `${weeks}周前`;
  if (months < 12) return `${months}个月前`;
  return `${years}年前`;
}

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

export function confirmDialog(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h3>确认操作</h3>
        <p>${message}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" id="cancel-btn">取消</button>
          <button class="btn btn-danger" id="confirm-btn">确认</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('cancel-btn').addEventListener('click', () => {
      overlay.remove();
      resolve(false);
    });
    
    document.getElementById('confirm-btn').addEventListener('click', () => {
      overlay.remove();
      resolve(true);
    });
  });
}

export function parseMarkdownHeaders(markdown) {
  const headers = [];
  const regex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = generateSlug(title);
    headers.push({ level, title, id });
  }
  
  return headers;
}

export function updateReadingProgress() {
  const progressBar = document.querySelector('.reading-progress');
  if (!progressBar) return;
  
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  
  progressBar.style.width = `${scrollPercent}%`;
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

export function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
}

export function setFontSize(size) {
  document.documentElement.style.fontSize = `${size}px`;
  localStorage.setItem('fontSize', size);
}

export function applySavedFontSize() {
  const savedSize = localStorage.getItem('fontSize');
  if (savedSize) {
    document.documentElement.style.fontSize = `${savedSize}px`;
  }
}

export function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.textContent = content;
  return element;
}