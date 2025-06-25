# Jason's Blog Setup Guide

这是你的个人博客设置指南。

## 🚀 快速开始

### 1. 安装依赖

确保你已经安装了以下软件：

- [Ruby](https://www.ruby-lang.org/en/downloads/) (推荐版本 2.7+)
- [Git](https://git-scm.com/downloads)

### 2. 安装 Jekyll 和 Bundler

```bash
gem install jekyll bundler
```

### 3. 安装项目依赖

在项目根目录下运行：

```bash
bundle install
```

### 4. 本地预览

启动本地服务器：

```bash
bundle exec jekyll serve
# 或者使用 npm 脚本
npm start
```

然后在浏览器中打开 [http://localhost:4000](http://localhost:4000) 预览你的博客。

## ✏️ 写作指南

### 创建新文章

1. 在 `_posts` 文件夹中创建新文件
2. 文件名格式：`YYYY-MM-DD-title.markdown`
3. 文件开头需要包含 Front Matter：

```yaml
---
layout: post
title: "文章标题"
subtitle: "副标题（可选）"
date: 2025-06-25 12:00:00
author: "Jason"
header-img: "img/post-bg-xxx.jpg"
catalog: true
tags:
    - 标签1
    - 标签2
---
```

### 文章模板

```markdown
---
layout: post
title: "文章标题"
subtitle: "副标题"
date: 2025-06-25 12:00:00
author: "Jason"
header-img: "img/post-bg-2015.jpg"
catalog: true
tags:
    - 技术
    - 学习
---

## 标题

文章内容...

### 小标题

更多内容...

```

## 🔧 个性化配置

### 修改个人信息

编辑 `_config.yml` 文件中的以下字段：

- `title`: 博客标题
- `email`: 联系邮箱
- `description`: 博客描述
- `github_username`: GitHub 用户名
- `sidebar-about-description`: 侧边栏个人描述

### 添加头像

1. 将头像图片上传到 GitHub 
2. 或者使用 GitHub 头像：`https://github.com/你的用户名.png`

### 自定义域名（可选）

如果你有自己的域名：

1. 编辑 `CNAME` 文件，填入你的域名
2. 在域名提供商处设置 DNS 记录指向 GitHub Pages

## 📝 常用命令

```bash
# 安装依赖
bundle install

# 本地预览
bundle exec jekyll serve

# 构建网站
bundle exec jekyll build

# 清理构建文件
bundle exec jekyll clean
```

## 🌟 提示

1. 每次修改 `_config.yml` 后需要重启服务器
2. 图片建议放在 `img` 文件夹中
3. 可以使用 Markdown 语法编写文章
4. 推荐使用 VSCode 等编辑器，有很好的 Markdown 支持

## 📚 相关资源

- [Jekyll 官方文档](https://jekyllrb.com/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)

享受写作的乐趣吧！ 🎉
