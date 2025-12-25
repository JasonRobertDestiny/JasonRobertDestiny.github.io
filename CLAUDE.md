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
3. Entry point: `less/jason-blog.less` imports all modules
4. Output: `css/jason-blog.css` (dev) + `css/jason-blog.min.css` (prod)

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
description: "SEO description"
date: YYYY-MM-DD HH:MM:SS
author: "Jason Robert"
header-img: "img/path/to/header.jpg"
catalog: true  # Table of contents
tags:
    - Tag1
---
```

## Architecture

### Key Directories
- `less/` - Less source files (edit here for styles)
  - `variables.less` - Design tokens, colors, breakpoints
  - `dark-mode.less` - Dark theme (CSS custom properties)
- `_layouts/` - Page templates (default, post, page, keynote)
- `_includes/` - Reusable components (nav, footer, head)
- `js/` - Client scripts (dark-mode.js, search, PWA registration)

### Less Module Structure
`jason-blog.less` imports in order: variables -> design-tokens -> mixins -> component modules.

Key modules for common tasks:
- Typography/colors: `variables.less`, `design-tokens.less`
- Dark mode: `dark-mode.less` (uses CSS custom properties)
- Syntax highlighting: `highlight.less`
- Responsive: breakpoints in `variables.less` (768/992/1200px)

### Deployment
- Push to `master` triggers GitHub Actions deployment
- Workflow: `.github/workflows/jekyll.yml`
- Ruby 3.1, auto-deploys to GitHub Pages

## Common Issues

### Styles not updating after deploy
You forgot to run `./build.sh` before commit. The compiled CSS files must be committed.

### Jekyll serve fails
Run `bundle install` first. Check Ruby version (needs 2.7+, prod uses 3.1).

### Dark mode not working
Check `js/dark-mode.js` and `less/dark-mode.less`. Uses CSS custom properties toggled via JavaScript.

### Build script fails on Windows
Use WSL or Git Bash: `bash build.sh`

## Configuration

- Site config: `_config.yml` (SEO, social links, pagination)
- PWA manifest: `pwa/manifest.json`
- Service worker: `sw.js`
- Google Analytics: `ga_track_id` in `_config.yml`
