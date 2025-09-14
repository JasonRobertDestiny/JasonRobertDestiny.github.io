#!/bin/bash

# Optimized Less compiler script for Jason's Blog
echo "Compiling and optimizing CSS files..."

# Create compressed CSS with optimized settings
lessc --clean-css="--s1 --advanced --compatibility=ie8" less/jason-blog.less css/jason-blog.min.css

# Create uncompressed version for development
lessc less/jason-blog.less css/jason-blog.css

echo "CSS optimization complete!"
echo "Minified CSS: $(du -h css/jason-blog.min.css | cut -f1)"