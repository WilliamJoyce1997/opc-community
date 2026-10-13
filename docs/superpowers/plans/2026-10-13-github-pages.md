# GitHub Pages 部署实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 为当前仓库配置 main 推送后的 Pages 自动构建与部署。
**Architecture:** Vite 开发路径保持 `/`，构建与 preview 使用 `/opc-community/`；Actions 发布 dist。
**Tech Stack:** 原生 HTML/CSS/JavaScript、Vite、npm、GitHub Actions。
**Spec:** 本轮用户提供的十项任务、验证要求、文档要求与严格限制。

## Global Constraints

不增加业务功能、框架或依赖；不删除设计或历史日志；不执行 commit/push；线上状态待开发者验证。

## Review Focus

生产 JS/CSS 路径、开发根路径、锚点导航、生产交互与刷新持久化、Pages 权限与环境配置。

## Tasks

- [x] 检查 package.json、锁文件、资源引用与 Git 状态；执行 npm ci。
- [x] 新增 vite.config.js，根据 command/isPreview 区分路径。
- [x] 新增 .github/workflows/deploy.yml，main 推送与手动触发，Node 24、npm ci/build、上传 dist、Pages 部署。
- [x] 构建后检查输出路径；启动开发和 preview，在隔离浏览器检查资源、导航、渲染、点赞、发布、搜索、筛选和 localStorage 刷新。
- [x] README 增加配置与 GitHub 操作步骤，ai-log 追加实际验证及上线待验证状态；git diff --check 和最终差异检查。

## Execution Rulings

用户已明确要求在当前项目完成工作，直接执行可逆配置；无需额外计划审批，不创建新分支或提交。配置/文档变更以构建、浏览器回归及差异检查验证，不增加镜像实现的单元测试。
