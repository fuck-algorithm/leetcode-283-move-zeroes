import { act, renderHook, waitFor } from '@testing-library/react';
import { useGitHubStars } from './useIndexedDB';
import {
  clearGitHubStarsRetry,
  deferGitHubStarsRetry,
  getGitHubStarsRetryAfter,
  getGitHubStarsWithFallback,
  saveGitHubStarsCache,
} from '../services/IndexedDBService';

jest.mock('../services/IndexedDBService', () => ({
  getUserPreferences: jest.fn(),
  saveUserPreferences: jest.fn(),
  getLanguagePreference: jest.fn(),
  saveLanguagePreference: jest.fn(),
  getPlaybackSpeedPreference: jest.fn(),
  savePlaybackSpeedPreference: jest.fn(),
  getGitHubStarsWithFallback: jest.fn(),
  saveGitHubStarsCache: jest.fn(),
  getGitHubStarsRetryAfter: jest.fn(),
  deferGitHubStarsRetry: jest.fn(),
  clearGitHubStarsRetry: jest.fn(),
  clearExpiredCache: jest.fn(),
}));

const getCachedStars = jest.mocked(getGitHubStarsWithFallback);
const getRetryAfter = jest.mocked(getGitHubStarsRetryAfter);
const saveStars = jest.mocked(saveGitHubStarsCache);
const deferRetry = jest.mocked(deferGitHubStarsRetry);
const clearRetry = jest.mocked(clearGitHubStarsRetry);

describe('useGitHubStars', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCachedStars.mockResolvedValue({ starCount: 0, isFromCache: false });
    getRetryAfter.mockResolvedValue(null);
  });

  it('uses a fresh cached value without requesting GitHub', async () => {
    getCachedStars.mockResolvedValue({ starCount: 123, isFromCache: true });
    const fetchStars = jest.fn();
    const { result } = renderHook(() => useGitHubStars(fetchStars));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.starCount).toBe(123);
    expect(fetchStars).not.toHaveBeenCalled();
  });

  it('deduplicates concurrent mounts into one GitHub request', async () => {
    let finishRequest: (count: number) => void = () => undefined;
    const fetchStars = jest.fn(() => new Promise<number>((resolve) => {
      finishRequest = resolve;
    }));
    const first = renderHook(() => useGitHubStars(fetchStars));
    const second = renderHook(() => useGitHubStars(fetchStars));

    await waitFor(() => expect(fetchStars).toHaveBeenCalledTimes(1));
    await act(async () => finishRequest(321));
    await waitFor(() => expect(first.result.current.isLoading).toBe(false));
    await waitFor(() => expect(second.result.current.isLoading).toBe(false));

    expect(first.result.current.starCount).toBe(321);
    expect(second.result.current.starCount).toBe(321);
  });

  it('skips GitHub requests while a retry backoff is active', async () => {
    getCachedStars.mockResolvedValue({ starCount: 0, isFromCache: false });
    getRetryAfter.mockResolvedValue(Date.now() + 30 * 60 * 1000);
    const fetchStars = jest.fn();
    const { result } = renderHook(() => useGitHubStars(fetchStars));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchStars).not.toHaveBeenCalled();
    expect(result.current.starCount).toBe(0);
  });

  it('does not retry a failed lookup on the next mount during the backoff window', async () => {
    getCachedStars.mockResolvedValue({ starCount: 0, isFromCache: false });
    getRetryAfter
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(Date.now() + 30 * 60 * 1000);
    const fetchStars = jest.fn().mockRejectedValue(new Error('rate limited'));
    const first = renderHook(() => useGitHubStars(fetchStars));

    await waitFor(() => expect(first.result.current.isLoading).toBe(false));
    first.unmount();

    const second = renderHook(() => useGitHubStars(fetchStars));
    await waitFor(() => expect(second.result.current.isLoading).toBe(false));

    expect(fetchStars).toHaveBeenCalledTimes(1);
  });

  it('persists successful responses and clears retry backoff', async () => {
    const fetchStars = jest.fn().mockResolvedValue(456);
    const { result } = renderHook(() => useGitHubStars(fetchStars));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(saveStars).toHaveBeenCalledWith(456);
    expect(clearRetry).toHaveBeenCalledTimes(1);
    expect(result.current.starCount).toBe(456);
  });

  it('backs off after failures and keeps displaying the stale cached value', async () => {
    getCachedStars.mockResolvedValue({ starCount: 789, isFromCache: false });
    const fetchStars = jest.fn().mockRejectedValue(new Error('rate limited'));
    const { result } = renderHook(() => useGitHubStars(fetchStars));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(deferRetry).toHaveBeenCalledTimes(1);
    expect(saveStars).not.toHaveBeenCalled();
    expect(result.current.starCount).toBe(789);
    expect(result.current.isFromCache).toBe(true);
  });

  it('refreshes explicitly and uses retry backoff after a failed refresh', async () => {
    const fetchStars = jest.fn().mockResolvedValueOnce(42).mockRejectedValueOnce(new Error('offline'));
    const { result } = renderHook(() => useGitHubStars(fetchStars));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => result.current.refresh());

    expect(deferRetry).toHaveBeenCalledTimes(1);
    expect(result.current.starCount).toBe(42);
  });
});
