import { fetchStarCount, formatStarCount } from './GitHubAPIService';
import {
  CACHE_EXPIRATION,
  GITHUB_STARS_RETRY_DELAY,
  isGitHubStarsCacheFresh,
} from './IndexedDBService';

describe('GitHubAPIService', () => {
  it('caches GitHub star counts for 30 minutes', () => {
    expect(CACHE_EXPIRATION.GITHUB_STARS).toBe(30 * 60 * 1000);
    expect(GITHUB_STARS_RETRY_DELAY).toBe(30 * 60 * 1000);
  });

  it('considers a valid cached count fresh for less than 30 minutes', () => {
    const now = 1_000_000;
    const cache = { starCount: 42, fetchedAt: now - CACHE_EXPIRATION.GITHUB_STARS + 1, expiresAt: now };
    expect(isGitHubStarsCacheFresh(cache, now)).toBe(true);
    expect(isGitHubStarsCacheFresh({ ...cache, fetchedAt: now - CACHE_EXPIRATION.GITHUB_STARS }, now)).toBe(false);
    expect(isGitHubStarsCacheFresh({ ...cache, fetchedAt: now + 1 }, now)).toBe(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([undefined, null, NaN, Infinity, -1])(
    'formats invalid star counts safely: %s',
    (count) => {
      expect(formatStarCount(count as number)).toBe('0');
    }
  );

  it('formats valid star counts', () => {
    expect(formatStarCount(999)).toBe('999');
    expect(formatStarCount(1200)).toBe('1.2k');
    expect(formatStarCount(1200000)).toBe('1.2M');
  });

  it.each([
    {},
    { stargazers_count: null },
    { stargazers_count: '42' },
    { stargazers_count: -1 },
    { stargazers_count: Infinity },
  ])('rejects malformed API star data: %j', async (body) => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => body,
    } as Response);

    await expect(fetchStarCount('owner', 'repo')).rejects.toThrow();
  });

  it('returns a valid star count from GitHub', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ stargazers_count: 42 }),
    } as Response);

    await expect(fetchStarCount('owner', 'repo')).resolves.toBe(42);
  });
});
