---
published: false
---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jason's personal technical blog built with Jekyll, focusing on AI development, Agent applications, full-stack development, and hackathon projects. The site features modern responsive design with PWA support and tech-enhanced styling.

## Development Commands

### Prerequisites
- Ruby 2.7+ (production uses Ruby 3.1)
- Less compiler (standalone, no Node.js required)
- Git

### Build & Development Workflow

```bash
# 1. Install Ruby dependencies
bundle install

# 2. Compile Less to CSS (REQUIRED before serving/deploying)
./build.sh

# 3. Start local development server
bundle exec jekyll serve

# 4. Build for production
bundle exec jekyll build

# 5. Clean generated files
bundle exec jekyll clean
```

### Critical Build Rule

**⚠️ ALWAYS compile Less files before deployment:**
- The GitHub Actions workflow does NOT compile Less files
- You MUST run `./build.sh` locally before committing CSS changes
- Never edit files in `/css` directory directly - edit `/less` files instead

### Deployment

Automatic deployment via GitHub Actions on push to `master` branch:
- Workflow: `.github/workflows/jekyll.yml`
- Ruby 3.1, Bundler cache enabled
- Deploys to GitHub Pages automatically
- Does NOT compile Less files (must be done locally)

## Architecture

### Technology Stack
- **Jekyll**: Static site generator with Liquid templating
- **Bootstrap 3**: Customized responsive framework
- **Less**: CSS preprocessor (no Node.js build system)
- **jQuery**: Client-side interactions and PWA support

### Directory Structure

```
├── _posts/           # Blog posts (YYYY-MM-DD-title.md format)
├── _layouts/         # Page templates (default, post, page, keynote)
├── _includes/        # Reusable components (nav, footer, head, etc.)
├── less/             # Less source files (EDIT HERE)
│   ├── jason-blog.less        # Main entry point
│   ├── variables.less          # Design tokens, colors
│   ├── tech-enhancements.less  # Modern UI components
│   └── dark-mode.less          # Dark mode styles
├── css/              # Compiled CSS (DO NOT EDIT)
├── js/               # JavaScript files
│   ├── jason-blog.js           # Custom scripts
│   └── sw-registration.js      # PWA service worker
└── _config.yml       # Jekyll configuration
```

### Less Build System

**Build Flow:**
1. Edit files in `/less` directory
2. Run `./build.sh` to compile
3. Generates both `css/jason-blog.css` (dev) and `css/jason-blog.min.css` (production)
4. Commit compiled CSS files to git

**Less File Organization:**
- `jason-blog.less`: Main entry, imports all modules
- `variables.less`: Colors, fonts, spacing tokens
- `tech-enhancements.less`: Gradients, animations, modern UI
- `dark-mode.less`: Dark mode theme (CSS custom properties)
- `accessibility.less`: A11y enhancements
- `sidebar.less`, `search.less`, etc.: Feature-specific styles

### Frontend Features
- Responsive navigation with scroll effects
- Simple Jekyll Search integration
- Rouge syntax highlighting with custom theme
- MathJax support (configurable per post)
- Progressive Web App (manifest + service worker)
- Dark mode toggle (CSS custom properties)
- Tech-themed gradients and animations

### Blog Post Format

Front Matter structure:
```yaml
---
layout: post
title: "Post Title"
subtitle: "Optional subtitle"
description: "SEO description"
date: YYYY-MM-DD HH:MM:SS
author: "Jason Robert"
header-img: "img/path/to/header.jpg"
catalog: true  # Enable table of contents
tags:
    - Tag1
    - Tag2
---
```

## Configuration

### Jekyll (_config.yml)
- Site metadata and SEO settings
- Social media links (GitHub, CSDN, Juejin, Bilibili, ModelScope)
- Pagination: 10 posts per page
- Markdown: Kramdown with GFM (GitHub Flavored Markdown)
- Syntax highlighting: Rouge
- Future posts: enabled (`future: true`)

### PWA Configuration
- Manifest: `pwa/manifest.json`
- Service Worker: `sw.js` (caches pages, CSS, JS)
- Registration: `js/sw-registration.js`
- Theme color: `#000000` (black)

### SEO & Analytics
- Google Analytics: `ga_track_id` in `_config.yml`
- Disqus comments: `disqus_username` in `_config.yml`
- Sitemap: `sitemap.xml` (manual, not auto-generated)
- Robots: `robots.txt` (allows all)

## Key Implementation Details

### Less Compilation Script (`build.sh`)
- Compiles `less/jason-blog.less` to two outputs:
  - `css/jason-blog.css`: Uncompressed (development)
  - `css/jason-blog.min.css`: Minified with aggressive optimization (`--clean-css="--s1 --advanced --compatibility=ie8"`)
- Displays minified file size after build

### Responsive Design Breakpoints
Defined in `variables.less`:
- Mobile: < 768px
- Tablet: 768px - 992px
- Desktop: 992px - 1200px
- Large: > 1200px

### Color System
Uses CSS custom properties for theming:
- Light mode: default (black text on white)
- Dark mode: toggled via JavaScript, uses inverted palette
- Accent colors: tech-themed gradients (blue/purple spectrum)

### Performance Optimizations
- Minified CSS and JavaScript
- Service worker caching strategy
- Lazy-loaded images (native loading="lazy")
- Preconnect to external fonts/resources
- Bundled critical CSS inline in `<head>`

## Git Workflow

### Ignored Files (`.gitignore`)
- Build artifacts: `_site/`, `.jekyll-cache/`
- Drafts: `_posts/_draft/`, `_posts/_archive/`
- System files: `.DS_Store`, `Thumbs.db`
- Logs: `*.log`, `*.lock`
- Temporary files: `*.tmp`, `*.temp`, `*.bak`, `*.swp`
- Scripts: `*.sh`, `start.sh`
- Documentation workspace: `document/`

### Branch Strategy
- Main branch: `master`
- Direct push to `master` triggers deployment
- Use feature branches for major changes

## Important Notes

- **CSS Workflow**: Never skip Less compilation - GitHub Actions won't compile it
- **Content**: Supports bilingual posts (English/Chinese)
- **Images**: Place in `/img` directory, use absolute paths in posts
- **JavaScript**: Minimal custom JS, primarily for PWA, search, and theme toggle
- **Design Philosophy**: Tech-themed modern aesthetic with accessibility focus
- **No package.json**: Uses standalone Less compiler, not npm build tools
