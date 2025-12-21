/**
 * IndexedDB 服务
 * 提供本地持久化存储功能，支持用户偏好和缓存数据
 * Requirements: 2.4, 5.4, 7.10
 */

import { 
  CacheEntry, 
  UserPreferences, 
  GitHubCache, 
  SupportedLanguage 
} from '../types';

// 数据库配置
const DB_NAME = 'algorithm-visualizer-db';
const DB_VERSION = 1;

// 存储对象名称
const STORES = {
  PREFERENCES: 'preferences',
  CACHE: 'cache',
} as const;

// 缓存过期时间（毫秒）
export const CACHE_EXPIRATION = {
  GITHUB_STARS: 60 * 60 * 1000, // 1小时
  DEFAULT: 24 * 60 * 60 * 1000, // 24小时
} as const;

// 默认用户偏好
const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'javascript',
  playbackSpeed: 1.0,
  lastUpdated: Date.now(),
};

// 内存缓存（IndexedDB 不可用时的降级方案）
let memoryCache: Map<string, any> = new Map();
let isIndexedDBAvailable = true;

/**
 * 打开数据库连接
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      isIndexedDBAvailable = false;
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      isIndexedDBAvailable = false;
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 创建偏好设置存储
      if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
        db.createObjectStore(STORES.PREFERENCES, { keyPath: 'key' });
      }

      // 创建缓存存储
      if (!db.objectStoreNames.contains(STORES.CACHE)) {
        const cacheStore = db.createObjectStore(STORES.CACHE, { keyPath: 'key' });
        cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
      }
    };
  });
}

/**
 * 通用存储方法
 */
async function setItem<T>(storeName: string, key: string, value: T): Promise<void> {
  if (!isIndexedDBAvailable) {
    memoryCache.set(`${storeName}:${key}`, value);
    return;
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ key, ...value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    // 降级到内存存储
    memoryCache.set(`${storeName}:${key}`, value);
  }
}

/**
 * 通用获取方法
 */
async function getItem<T>(storeName: string, key: string): Promise<T | null> {
  if (!isIndexedDBAvailable) {
    return memoryCache.get(`${storeName}:${key}`) || null;
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // 移除 key 字段，返回纯数据
          const { key: _, ...data } = result;
          resolve(data as T);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    return memoryCache.get(`${storeName}:${key}`) || null;
  }
}

/**
 * 删除项目
 */
async function removeItem(storeName: string, key: string): Promise<void> {
  if (!isIndexedDBAvailable) {
    memoryCache.delete(`${storeName}:${key}`);
    return;
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    memoryCache.delete(`${storeName}:${key}`);
  }
}

// ============ 用户偏好相关方法 ============

/**
 * 获取用户偏好设置
 */
export async function getUserPreferences(): Promise<UserPreferences> {
  const prefs = await getItem<UserPreferences>(STORES.PREFERENCES, 'user');
  return prefs || DEFAULT_PREFERENCES;
}

/**
 * 保存用户偏好设置
 */
export async function saveUserPreferences(prefs: Partial<UserPreferences>): Promise<void> {
  const current = await getUserPreferences();
  const updated: UserPreferences = {
    ...current,
    ...prefs,
    lastUpdated: Date.now(),
  };
  await setItem(STORES.PREFERENCES, 'user', updated);
}

/**
 * 获取语言偏好
 */
export async function getLanguagePreference(): Promise<SupportedLanguage> {
  const prefs = await getUserPreferences();
  return prefs.language;
}

/**
 * 保存语言偏好
 */
export async function saveLanguagePreference(language: SupportedLanguage): Promise<void> {
  await saveUserPreferences({ language });
}

/**
 * 获取播放速度偏好
 */
export async function getPlaybackSpeedPreference(): Promise<number> {
  const prefs = await getUserPreferences();
  return prefs.playbackSpeed;
}

/**
 * 保存播放速度偏好
 */
export async function savePlaybackSpeedPreference(speed: number): Promise<void> {
  await saveUserPreferences({ playbackSpeed: speed });
}

// ============ 缓存相关方法 ============

/**
 * 设置缓存项（带过期时间）
 */
export async function setCacheItem<T>(
  key: string, 
  value: T, 
  expirationMs: number = CACHE_EXPIRATION.DEFAULT
): Promise<void> {
  const now = Date.now();
  const cacheEntry: CacheEntry<T> = {
    key,
    value,
    timestamp: now,
    expiresAt: now + expirationMs,
  };
  await setItem(STORES.CACHE, key, cacheEntry);
}

/**
 * 获取缓存项（检查过期）
 */
export async function getCacheItem<T>(key: string): Promise<T | null> {
  const entry = await getItem<CacheEntry<T>>(STORES.CACHE, key);
  
  if (!entry) {
    return null;
  }

  // 检查是否过期
  if (Date.now() > entry.expiresAt) {
    // 过期了，删除缓存
    await removeItem(STORES.CACHE, key);
    return null;
  }

  return entry.value;
}

/**
 * 获取缓存项（即使过期也返回，用于降级）
 */
export async function getCacheItemWithExpired<T>(key: string): Promise<{ value: T | null; isExpired: boolean }> {
  const entry = await getItem<CacheEntry<T>>(STORES.CACHE, key);
  
  if (!entry) {
    return { value: null, isExpired: true };
  }

  const isExpired = Date.now() > entry.expiresAt;
  return { value: entry.value, isExpired };
}

/**
 * 删除缓存项
 */
export async function removeCacheItem(key: string): Promise<void> {
  await removeItem(STORES.CACHE, key);
}

// ============ GitHub Star 缓存专用方法 ============

const GITHUB_STARS_CACHE_KEY = 'github-stars';

/**
 * 获取 GitHub Star 缓存
 */
export async function getGitHubStarsCache(): Promise<GitHubCache | null> {
  return getCacheItem<GitHubCache>(GITHUB_STARS_CACHE_KEY);
}

/**
 * 保存 GitHub Star 缓存
 */
export async function saveGitHubStarsCache(starCount: number): Promise<void> {
  const cache: GitHubCache = {
    starCount,
    fetchedAt: Date.now(),
    expiresAt: Date.now() + CACHE_EXPIRATION.GITHUB_STARS,
  };
  await setCacheItem(GITHUB_STARS_CACHE_KEY, cache, CACHE_EXPIRATION.GITHUB_STARS);
}

/**
 * 获取 GitHub Star（带降级逻辑）
 */
export async function getGitHubStarsWithFallback(): Promise<{ starCount: number; isFromCache: boolean }> {
  const { value, isExpired } = await getCacheItemWithExpired<GitHubCache>(GITHUB_STARS_CACHE_KEY);
  
  if (value) {
    return { starCount: value.starCount, isFromCache: !isExpired };
  }
  
  return { starCount: 0, isFromCache: false };
}

// ============ 清理方法 ============

/**
 * 清理过期缓存
 */
export async function clearExpiredCache(): Promise<void> {
  if (!isIndexedDBAvailable) {
    return;
  }

  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORES.CACHE, 'readwrite');
    const store = transaction.objectStore(STORES.CACHE);
    const index = store.index('expiresAt');
    const now = Date.now();

    const request = index.openCursor(IDBKeyRange.upperBound(now));
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    transaction.oncomplete = () => db.close();
  } catch (error) {
    console.warn('Failed to clear expired cache:', error);
  }
}

/**
 * 清除所有数据
 */
export async function clearAllData(): Promise<void> {
  if (!isIndexedDBAvailable) {
    memoryCache.clear();
    return;
  }

  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORES.PREFERENCES, STORES.CACHE], 'readwrite');
    
    transaction.objectStore(STORES.PREFERENCES).clear();
    transaction.objectStore(STORES.CACHE).clear();

    transaction.oncomplete = () => db.close();
  } catch (error) {
    memoryCache.clear();
  }
}

// 导出服务对象
export const IndexedDBService = {
  // 用户偏好
  getUserPreferences,
  saveUserPreferences,
  getLanguagePreference,
  saveLanguagePreference,
  getPlaybackSpeedPreference,
  savePlaybackSpeedPreference,
  
  // 通用缓存
  setCacheItem,
  getCacheItem,
  getCacheItemWithExpired,
  removeCacheItem,
  
  // GitHub Star 缓存
  getGitHubStarsCache,
  saveGitHubStarsCache,
  getGitHubStarsWithFallback,
  
  // 清理
  clearExpiredCache,
  clearAllData,
};

export default IndexedDBService;
