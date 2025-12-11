---
layout: post
title: "用AI自动优化网站 PageSpeed 性能"
subtitle: "Devtools MCP + Codex 实战全流程"
date: 2025-12-11
header-img: img/post-bg-web.jpg
tags: [PageSpeed, Core Web Vitals, Devtools MCP, AI, 性能优化]
description: "用AI+Devtools MCP一键跑 Lighthouse、定位 LCP/FID/CLS，自动修复并推送，拿下 90+ PageSpeed。"
---

> 哈喽，大家好，我是刘小排。学生用 AI 做产品，一个月赚了 4 万美金，但 PageSpeed 只有 60 多分——这意味着排名、转化、体验都在流失。下面给出一套用 AI 自动把分数打到 90+ 的实战流程。

## 为什么要提升 PageSpeed？
- PageSpeed/Core Web Vitals（LCP、FID、CLS）已是 Google 排名因子。
- 速度慢：排名下滑、社交二次推荐弱、转化率下降。
- 速度快：能跨过竞争对手、提升付费转化。

## 如何检查自己的分数？
1. 打开 https://pagespeed.web.dev/
2. 输入你的域名（例： https://raphael.app ）。
3. 看移动端 + 桌面端四个分数，90 分只是过关，目标是 95+。

## 古法 vs AI 自动优化
- 传统：逐项理解 FCP、LCP、TBT、CLS，按建议手工改，耗时但有效。
- 现在：让 AI + Devtools MCP 自动跑 Lighthouse、收集性能指标、定位瓶颈并生成补丁。

## 工具清单
1. 一款支持 MCP 的 AI 编程工具（Codex、Cursor、Claude Code、Google Antigravity 等）。
2. Devtools MCP（基于 Chrome DevTools Protocol 的官方方案，能抓 Network/Console/Runtime/性能，粒度最细）。

## Devtools MCP 相比 Playwright MCP 的优势
- 官方出品，和 Chrome 深度耦合，底层直连 CDP。
- 能同时观测 + 调试：Network 时序、重定向链路、console 报错、window 变量、Performance metrics。
- 适合：排查 404/500/CORS/CSP、LCP 大图、FCP 阻塞、第三方脚本拖慢、A/B 触发逻辑等。

## 用 Codex 自动优化 PageSpeed 的实操步骤
1. **跑线上 PageSpeed**：到 pagespeed.web.dev 输入域名，截图指标发给 Codex 备档（未上线可跳过）。
2. **安装 Devtools MCP**：按 https://github.com/ChromeDevTools/chrome-devtools-mcp 安装，或让 Codex 自动装。
3. **本地跑 Lighthouse**：启动本地站点，告诉 Codex 用 Devtools MCP 跑 Lighthouse，拿到 LCP/FID/CLS/TBT 明细。
4. **定位瓶颈**：让 Codex 根据报告输出可执行的代码修改方案（压缩/拆分/预加载/延迟加载等）。
5. **自动修复**：同意后让 Codex 直接改代码、生成补丁。
6. **复测循环**：重复 3-5，直到本地 Lighthouse >= 90。
7. **上线验证**：部署后再跑 pagespeed.web.dev；若与本地不一致，再用 Devtools MCP 远程调试修复。

### 常见快速提升手段
- 预加载首屏大图/关键字体，减少 LCP。
- 延迟非关键 JS，减少 TBT、阻塞渲染。
- 启用图片懒加载 + WebP/AVIF，减小传输体积。
- 减少第三方脚本，或通过延迟/分域名加载降低主线程占用。
- 配置长缓存与 gzip/br 压缩。

### 实操示例（让 Codex 执行）
- “用 Devtools MCP 打开 homepage，找出 LCP 元素、资源大小、加载时序。”
- “把 LCP 图改为 preload + responsive `<picture>`，并开启 lazyload 对非首屏图。”
- “压缩/拆分 `vendor.js`，把非首屏逻辑延迟到 `requestIdleCallback`。”
- “检查有哪些 404/500/CORS/CSP 报错并修复。”

## 懒人方案
- 购买满分模板：如 ShipAny V2，开箱即享 4×90+ PageSpeed。
- 或让 Codex/Claude 直接全自动改代码，只需反复确认和上线。

## 总结
- PageSpeed 直接影响 SEO 和转化。
- Devtools MCP + AI 编程工具 = 最低人力成本的性能优化流水线。
- 先本地跑 Lighthouse，再上线复测；循环迭代直到 95+。

> 你学会了吗？欢迎贴出你的 PageSpeed 提升结果。
