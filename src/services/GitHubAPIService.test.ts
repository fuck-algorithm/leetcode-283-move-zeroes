import { fetchStarCount, formatStarCount } from './GitHubAPIService';

describe('GitHubAPIService', () => {
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
