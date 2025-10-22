Archived files from site root

This folder contains non-essential or rarely used files moved during repository cleanup to keep the project root focused on core site sources.

Moved files
- about.html
- archive.html
- portfolio.html
- ads.txt
- feed.xml
- offline.html
- sitemap.xml
- robots.txt
- CLAUDE.md

Notes
- These were not deleted; move any file back to the project root if you still need it published by GitHub Pages.
- The site’s core content remains in `_posts/`, layouts in `_layouts/`, includes in `_includes/`, and assets in `css/`, `js/`, `img/`, `fonts/`, `pwa/`.
- Build artifacts and caches (`_site/`, `.jekyll-cache/`, `node_modules/`) were removed.

Restore guidance
- If a page (e.g., `about.html`) should remain live, move it back to the root: `git mv archive/about.html .`.
- If you rely on `feed.xml` or `sitemap.xml`, restore them or add the corresponding Jekyll plugins and templates.

Cleanup summary (approximate)
- Removed: `_site/` (~14 MB)
- Removed: `.jekyll-cache/` (~420 KB)
- Removed: `node_modules/` (~37 MB)

Total space reclaimed: ~51 MB

