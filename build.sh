#!/bin/bash

# Optimized Less compiler script for Calder's Lab
echo "Compiling and optimizing CSS files..."

# Create compressed CSS with optimized settings
lessc --clean-css="--s1 --advanced --compatibility=ie8" less/calder-blog.less css/calder-blog.min.css

# Create uncompressed version for development
lessc less/calder-blog.less css/calder-blog.css

echo "CSS optimization complete!"
echo "Minified CSS: $(du -h css/calder-blog.min.css | cut -f1)"
