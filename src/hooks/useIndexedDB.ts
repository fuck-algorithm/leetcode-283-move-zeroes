/**
 * IndexedDB React Hook
 * 封装 IndexedDBService 供 React 组件使用
 * Requirements: 2.4, 5.4, 7.10
 */

import { useState, useEffect, useCallback } from 'react';
import { SupportedLanguage, UserPreferences } from '../types';
import {
  getUserPreferences,
  saveUserPreferences,
  getLanguagePreference,
  saveLanguagePreference,
  getPlaybackSpeedPreference,
  savePlaybackSpeedPreference,
  getGitHubStarsWithFallback,
  saveGitHubStarsCache,
  clearExpiredCache,
} from '../services/IndexedDBService';

// ============ 用户偏好 Hook ============

interface UseUserPreferencesReturn {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

/**
 * 用户偏好设置 Hook
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const prefs = await getUserPreferences();
        setPreferences(prefs);
        setError(null);
      } catch (err) {
        setError('加载用户偏好失败');
        console.error('Failed to load preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    try {
      await saveUserPreferences(prefs);
      setPreferences((prev: UserPreferences | null) => prev ? { ...prev, ...prefs, lastUpdated: Date.now() } : null);
    } catch (err) {
      setError('保存用户偏好失败');
      console.error('Failed to save preferences:', err);
    }
  }, []);

  return { preferences, isLoading, error, updatePreferences };
}

// ============ 语言偏好 Hook ============

interface UseLanguagePreferenceReturn {
  language: SupportedLanguage;
  isLoading: boolean;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
}

/**
 * 语言偏好 Hook
 */
export function useLanguagePreference(): UseLanguagePreferenceReturn {
  const [language, setLanguageState] = useState<SupportedLanguage>('javascript');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setIsLoading(true);
        const lang = await getLanguagePreference();
        setLanguageState(lang);
      } catch (err) {
        console.error('Failed to load language preference:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    try {
      await saveLanguagePreference(lang);
      setLanguageState(lang);
    } catch (err) {
      console.error('Failed to save language preference:', err);
    }
  }, []);

  return { language, isLoading, setLanguage };
}

// ============ 播放速度偏好 Hook ============

interface UsePlaybackSpeedReturn {
  speed: number;
  isLoading: boolean;
  setSpeed: (speed: number) => Promise<void>;
}

/**
 * 播放速度偏好 Hook
 */
export function usePlaybackSpeed(): UsePlaybackSpeedReturn {
  const [speed, setSpeedState] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSpeed = async () => {
      try {
        setIsLoading(true);
        const savedSpeed = await getPlaybackSpeedPreference();
        setSpeedState(savedSpeed);
      } catch (err) {
        console.error('Failed to load playback speed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpeed();
  }, []);

  const setSpeed = useCallback(async (newSpeed: number) => {
    try {
      await savePlaybackSpeedPreference(newSpeed);
      setSpeedState(newSpeed);
    } catch (err) {
      console.error('Failed to save playback speed:', err);
    }
  }, []);

  return { speed, isLoading, setSpeed };
}

// ============ GitHub Stars Hook ============

interface UseGitHubStarsReturn {
  starCount: number;
  isLoading: boolean;
  isFromCache: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * GitHub Stars Hook
 * 支持从缓存读取和刷新
 */
export function useGitHubStars(
  fetchStars: () => Promise<number>
): UseGitHubStarsReturn {
  const [starCount, setStarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromCache, setIsFromCache] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStars = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 先尝试从缓存获取
      const cached = await getGitHubStarsWithFallback();
      
      if (cached.isFromCache) {
        // 缓存有效，直接使用
        setStarCount(cached.starCount);
        setIsFromCache(true);
        setIsLoading(false);
        return;
      }

      // 缓存过期或不存在，尝试获取新数据
      try {
        const freshCount = await fetchStars();
        await saveGitHubStarsCache(freshCount);
        setStarCount(freshCount);
        setIsFromCache(false);
      } catch (fetchError) {
        // 获取失败，使用过期缓存或默认值
        if (cached.starCount > 0) {
          setStarCount(cached.starCount);
          setIsFromCache(true);
        } else {
          setStarCount(0);
        }
        setError('获取 Star 数失败，使用缓存数据');
      }
    } catch (err) {
      setError('加载 Star 数失败');
      setStarCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStars]);

  useEffect(() => {
    loadStars();
  }, [loadStars]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const freshCount = await fetchStars();
      await saveGitHubStarsCache(freshCount);
      setStarCount(freshCount);
      setIsFromCache(false);
      setError(null);
    } catch (err) {
      setError('刷新 Star 数失败');
    } finally {
      setIsLoading(false);
    }
  }, [fetchStars]);

  return { starCount, isLoading, isFromCache, error, refresh };
}

// ============ 缓存清理 Hook ============

/**
 * 缓存清理 Hook
 * 在组件挂载时清理过期缓存
 */
export function useCacheCleaner(): void {
  useEffect(() => {
    clearExpiredCache().catch(err => {
      console.warn('Failed to clear expired cache:', err);
    });
  }, []);
}

// 导出所有 hooks
export default {
  useUserPreferences,
  useLanguagePreference,
  usePlaybackSpeed,
  useGitHubStars,
  useCacheCleaner,
};
