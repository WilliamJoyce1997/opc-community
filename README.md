# opc-community

OPC（One Person Company）社区首页试岗项目，采用 HTML5、CSS3、JavaScript ES Modules 和 Vite。当前仅完成初始化整理，页面容器为空，尚未实现社区界面和业务交互。

## 本地运行

已安装依赖时直接运行：

```sh
npm run dev
npm run build
npm run preview
```

首次获取项目时，先使用 `npm ci` 按 `package-lock.json` 安装依赖。`dev` 启动开发服务器，`build` 生成 `dist/`，`preview` 用于本地查看构建结果。

## 文件与目录职责

| 文件或目录 | 职责 |
| --- | --- |
| `index.html` | HTML 主入口、中文语言设置、页面元信息、`#app` 容器及模块脚本引用 |
| `src/main.js` | JavaScript 主入口，导入样式，后续负责组织模块和初始化页面 |
| `src/css/style.css` | 全局基础样式及后续组件样式 |
| `src/css/responsive.css` | 预留桌面、移动端布局适配样式 |
| `src/js/data.js` | 预留 Mock 帖子和话题数据，目前为空 |
| `src/js/posts.js` | 预留帖子渲染、点赞状态与更新逻辑，目前为空 |
| `src/js/modal.js` | 预留发布弹窗、表单验证和提交逻辑，目前为空 |
| `src/js/filters.js` | 预留搜索及话题筛选逻辑，目前为空 |
| `src/js/storage.js` | 预留 localStorage 读写与异常处理，目前为空 |
| `src/assets/` | 需要由 Vite 处理的图片等资源 |
| `public/images/` | 不需要构建处理的静态图片，以 `/images/` 路径引用 |
| `design/` | 后续设计方案、迭代记录；本轮未生成设计图 |
| `screenshots/` | 后续桌面、移动端及功能验收截图 |
| `package.json` | 项目信息、运行脚本和依赖声明，目前仅有 Vite 开发依赖 |
| `package-lock.json` | 锁定依赖版本，保障安装一致性 |
| `.gitignore` | 排除依赖、构建产物、日志和本地编辑器文件 |
| `ai-log.md` | AI 协作过程、修改原因和验证结果记录 |

`.gitkeep` 仅用于让 Git 保留空目录。`node_modules/` 和 `dist/` 不提交到仓库。

## 推荐开发顺序

1. 确认首页信息结构、视觉方向和桌面/移动端布局，记录设计迭代。
2. 实现导航、Hero、话题标签和帖子卡片的静态结构与基础样式。
3. 在 `data.js` 准备 6–8 条 Mock 帖子，在 `posts.js` 实现渲染。
4. 完成响应式布局并检查键盘操作、语义与可访问性。
5. 实现点赞/取消点赞、发布弹窗及表单验证。
6. 添加搜索、话题筛选，再接入 localStorage 数据保存。
7. 通过 CSS 变量统一主题，再实现暗色模式。
8. 进行功能与多尺寸验收，保存截图并更新 AI 协作日志。

本轮没有引入 React、Vue、Tailwind 或额外依赖，没有实现实际社区页面。
