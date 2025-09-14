# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Jason's personal technical blog built with Jekyll, a static site generator. The blog focuses on AI development, Agent applications, full-stack development, and hackathon projects. The site features a modern, responsive design with PWA support and tech-enhanced styling.

## Development Commands

### Prerequisites
- Ruby 2.7+
- Node.js 14+
- Git

### Local Development
```bash
# Install Ruby dependencies
bundle install

# Compile Less files to CSS (required before serving)
./build.sh
# or manually:
lessc less/jason-blog.less css/jason-blog.css
lessc --clean-css less/jason-blog.less css/jason-blog.min.css

# Start local development server
bundle exec jekyll serve

# Build for production
bundle exec jekyll build

# Clean generated files
bundle exec jekyll clean
```

### Deployment
The site uses GitHub Actions for automatic deployment to GitHub Pages. The workflow is in `.github/workflows/jekyll.yml` and triggers on pushes to the `master` branch. The workflow uses Ruby 3.1 and automatically installs gems via Bundler cache.

## Architecture

### Core Structure
- **Jekyll**: Static site generator using Liquid templating
- **Bootstrap 3**: Responsive CSS framework (customized)
- **jQuery**: JavaScript library for interactions
- **Less**: CSS preprocessor for maintainable styles

### Key Directories
- `_posts/`: Blog posts in Markdown format (YYYY-MM-DD-title.markdown)
- `_includes/`: Reusable components (header, footer, navigation, etc.)
- `_layouts/`: Page templates (default, post, page, keynote)
- `less/`: Source Less files that compile to CSS
- `js/`: JavaScript files (custom scripts in jason-blog.js)
- `css/`: Compiled CSS files (do not edit directly)

### Styling Architecture
- **Main stylesheet**: `less/jason-blog.less` imports all other Less files
- **Tech enhancements**: `less/tech-enhancements.less` contains modern UI components
- **Variables**: `less/variables.less` defines color schemes and design tokens
- **Components**: Modular Less files for specific features (sidebar, search, etc.)

### Frontend Features
- Responsive navigation with scroll effects
- Search functionality using Simple Jekyll Search
- Syntax highlighting with Rouge
- MathJax support for mathematical formulas
- PWA (Progressive Web App) capabilities
- Tech-themed visual enhancements with gradients and animations

### Content Structure
Posts use Front Matter for metadata:
```yaml
---
title: Post Title
subtitle: Optional subtitle
date: YYYY-MM-DD HH:MM:SS
author: Jason
header-img: img/path/to/image.jpg
tags: [tag1, tag2, tag3]
catalog: true
---
```

## Key Configuration

### Jekyll Configuration (_config.yml)
- Site settings, SEO metadata
- Social media links
- Pagination (10 posts per page)
- Markdown processor (Kramdown with GitHub Flavored Markdown)
- Syntax highlighting (Rouge)

### PWA Configuration
- Manifest: `pwa/manifest.json`
- Service Worker: `sw.js`
- Registration: `js/sw-registration.js`

## Build System

### Less Compilation
The project uses Less for CSS preprocessing:
- **Build script**: `./build.sh` compiles Less files
- **Source**: `/less` directory contains modular Less files
- **Output**: `/css` directory (do not edit directly)
- **Main entry**: `less/jason-blog.less` imports all other Less modules

### Jekyll Build Process
1. Less files must be compiled first (using `./build.sh`)
2. Jekyll processes Markdown posts and Liquid templates
3. Static files are copied to `_site/` directory
4. GitHub Actions automatically deploys on push to master

## Important Notes

- **CSS Workflow**: Always compile Less files before Jekyll build
- **Content**: Supports both English and Chinese posts
- **Images**: Place in `/img` directory
- **JavaScript**: Minimal custom JS, primarily for PWA and search
- **Design**: Tech-themed with gradients and modern animations
- **No package.json**: Project uses Less directly without Node.js build tools