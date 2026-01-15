# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minimal Jekyll blog with Cyberpunk Brutalism design. Live at https://jasonrobert.me.

## Development Commands

```bash
# Install dependencies
bundle install

# Local development
bundle exec jekyll serve

# Production build
bundle exec jekyll build
```

## Architecture

### Directory Structure
```
/
├── _config.yml      # Site configuration
├── _layouts/        # Page templates (default, post, page)
├── _posts/          # Blog posts (YYYY-MM-DD-title.md)
├── css/style.css    # Single CSS file (Cyberpunk Brutalism)
├── img/             # Images
├── index.html       # Homepage
├── about.md         # About page
├── archive.html     # Post archive
├── blog.html        # Blog listing with pagination
└── 404.html         # Error page
```

### Design System
- **Colors**: Dark background (#0a0a0f), Cyan accent (#00ffff)
- **Typography**: Space Mono (display), IBM Plex Sans (body), JetBrains Mono (code)
- **Style**: Cyberpunk Brutalism - sharp corners, neon glows, grid backgrounds

### Blog Posts
Posts must follow naming: `_posts/YYYY-MM-DD-title.md`

Front matter template:
```yaml
---
layout: post
title: "Post Title"
subtitle: "Optional subtitle"
description: "SEO meta description"
date: YYYY-MM-DD HH:MM:SS
author: "Calder"
tags:
  - Tag1
  - Tag2
---
```

### Deployment
- Push to `master` triggers GitHub Actions deployment
- Workflow: `.github/workflows/jekyll.yml`
- Ruby 3.1, auto-deploys to GitHub Pages
- Future-dated posts ARE published (`future: true`)

## Key Configuration

- `_config.yml` - Site metadata, social links, pagination
- `css/style.css` - Complete design system (edit directly)
