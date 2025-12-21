/**
 * GitHub API 服务
 * 获取仓库 Star 数量
 * Requirements: 2.3, 2.5, 2.6
 */

const GITHUB_API_BASE = 'https://api.github.com';
const API_TIMEOUT = 5000; // 5秒超时

export interface GitHubRepoInfo {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  name: string;
  full_name: string;
}

/**
 * 获取仓库信息
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @returns 仓库信息
 */
export async function fetchRepoInfo(owner: string, repo: string): Promise<GitHubRepoInfo> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data as GitHubRepoInfo;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('GitHub API request timeout');
    }
    
    throw error;
  }
}

/**
 * 获取仓库 Star 数量
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @returns Star 数量
 */
export async function fetchStarCount(owner: string, repo: string): Promise<number> {
  const repoInfo = await fetchRepoInfo(owner, repo);
  return repoInfo.stargazers_count;
}

/**
 * 格式化 Star 数量显示
 * @param count Star 数量
 * @returns 格式化后的字符串
 */
export function formatStarCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

// 导出服务对象
export const GitHubAPIService = {
  fetchRepoInfo,
  fetchStarCount,
  formatStarCount,
};

export default GitHubAPIService;
