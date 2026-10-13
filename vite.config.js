import { defineConfig } from 'vite'

export default defineConfig(({ command, isPreview }) => ({
  // 开发仍从根路径访问；构建和生产预览使用 GitHub Pages 仓库子路径。
  base: command === 'build' || isPreview ? '/opc-community/' : '/',
}))
