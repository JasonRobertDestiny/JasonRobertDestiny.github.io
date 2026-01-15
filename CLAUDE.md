# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jekyll-based technical blog with PWA support, dark mode, and bilingual content (English/Chinese). Live at https://jasonrobert.me.

## Development Commands

```bash
# Install dependencies
bundle install

# Compile Less to CSS (REQUIRED before any commit with CSS changes)
./build.sh
# Windows: bash build.sh

# Local development
bundle exec jekyll serve

# Production build
bundle exec jekyll build
```

## Critical Rules

### CSS/Less Workflow
1. **NEVER edit `/css` files directly** - edit `/less` files instead
2. **ALWAYS run `./build.sh` before committing CSS changes** - GitHub Actions does NOT compile Less
3. Entry point: `less/calder-blog.less` imports all modules
4. Output: `css/calder-blog.css` (dev) + `css/calder-blog.min.css` (prod)

### Frontend Development
**Invoke `Skill(frontend-design)` before any UI/CSS work** - this ensures design quality and avoids generic AI aesthetics.

### Blog Posts
Posts must follow naming: `_posts/YYYY-MM-DD-title.md`

Front matter template:
```yaml
---
layout: post
title: "Post Title"
subtitle: "Optional subtitle"
description: "SEO meta description (150-160 chars)"
date: YYYY-MM-DD HH:MM:SS
author: "Calder"
header-img: "img/path/to/header.jpg"
catalog: true  # Enables table of contents sidebar
multilingual: false  # Set true for posts with en.md/zh.md in _includes/posts/
tags:
    - Tag1
---
```

For FAQ structured data, use `{% include faq-schema.html %}` in posts.

## Architecture

### Key Directories
- `less/` - Less source files (edit here for styles)
- `_layouts/` - Page templates (default, post, page, keynote)
- `_includes/` - Reusable components (nav, footer, head, faq-schema)
- `js/` - Client scripts (dark-mode.js, search, PWA registration)

### Less Module Structure
`calder-blog.less` imports 19 modules in order:
1. `variables.less` - CSS custom properties, colors, breakpoints (768/992/1200px)
2. `design-tokens.less` - Spacing, typography scales
3. `mixins.less` - Reusable Less mixins
4. Component modules: sidebar, side-catalog, snackbar, highlight, search
5. Enhancement modules: tech, home, scroll, interactive, article, archive
6. `dark-mode.less` - Dark theme via `[data-theme="dark"]` selector
7. `accessibility.less`, `multilingual.less`, `mobile-performance.less`, `editorial-design.less`

Dark mode uses CSS custom properties toggled by `js/dark-mode.js`. Edit `variables.less` for both light and dark theme colors.

### Bilingual Content
Language-specific content lives in `_includes/` subdirectories:
- `_includes/about/en.md` / `zh.md` - About page content
- `_includes/posts/[date]-[slug]/en.md` / `zh.md` - Post translations

The multilingual selector component is in `_includes/multilingual-sel.html`.

### Deployment
- Push to `master` triggers GitHub Actions deployment
- Workflow: `.github/workflows/jekyll.yml`
- Ruby 3.1, auto-deploys to GitHub Pages
- Future-dated posts ARE published (`future: true` in _config.yml)

### PWA / Service Worker
`sw.js` implements offline-first caching with auto-versioning on each Jekyll build. Cache strategies:
- Pages: NetworkFirst (1hr cache)
- Static assets (JS/CSS): CacheFirst
- Images/fonts: Separate cache buckets

Edit `PRECACHE_LIST` in `sw.js` to add critical offline resources.

## Common Issues

### Styles not updating after deploy
You forgot to run `./build.sh` before commit. The compiled CSS files must be committed.

### Jekyll serve fails
Run `bundle install` first. Check Ruby version (needs 2.7+, prod uses 3.1).

### Dark mode not working
Check `js/dark-mode.js` and `less/variables.less` (both `:root` and `[data-theme="dark"]` blocks). Toggle via browser DevTools: `document.documentElement.dataset.theme = 'dark'`.

### Build script fails on Windows
Use WSL or Git Bash: `bash build.sh`

## Key Configuration Files

- `_config.yml` - Site metadata, SEO fields, social links, pagination, excluded paths
- `pwa/manifest.json` - PWA app manifest
- `sw.js` - Service worker (auto-versions via Jekyll)
