#!/bin/bash
export GIT_COMMITTER_NAME='cc11001100'
export GIT_COMMITTER_EMAIL='example@example.com'
export GIT_AUTHOR_NAME='cc11001100'
export GIT_AUTHOR_EMAIL='example@example.com'
git config --global --unset gpg.program
git config --global --unset commit.gpgsign
npm run build

# 清理gh-pages缓存和本地分支
rm -rf node_modules/.cache/gh-pages
git branch -D gh-pages 2>/dev/null || true

# 使用默认参数部署并推送到GitHub
echo "正在部署到GitHub Pages..."
node_modules/.bin/gh-pages -d build

git config --global gpg.program gpg
git config --global commit.gpgsign true 