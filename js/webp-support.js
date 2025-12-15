/**
 * WebP Support Detection and Auto-Replacement
 * Automatically replaces JPG/PNG with WebP when supported
 */
(function() {
    'use strict';

    // Check WebP support
    function supportsWebP() {
        var elem = document.createElement('canvas');
        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }

    // Replace background images with WebP
    function replaceBackgroundImages() {
        if (!supportsWebP()) return;

        // Replace intro-header background
        var headers = document.querySelectorAll('.intro-header[style*="background-image"]');
        headers.forEach(function(header) {
            var style = header.getAttribute('style');
            if (style) {
                // Replace .jpg and .jpeg with .webp
                var newStyle = style.replace(/\.jpe?g/gi, '.webp');
                if (newStyle !== style) {
                    header.setAttribute('style', newStyle);
                }
            }
        });

        // Replace LOCAL img src with WebP (skip external URLs like GitHub avatars)
        var images = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]');
        images.forEach(function(img) {
            var src = img.getAttribute('src');
            if (src) {
                // SKIP external URLs - only process local images
                if (src.indexOf('github.com') !== -1 ||
                    src.indexOf('githubusercontent.com') !== -1 ||
                    src.indexOf('//') === 0 && src.indexOf(window.location.host) === -1 ||
                    src.indexOf('http') === 0 && src.indexOf(window.location.host) === -1) {
                    return; // Skip external images
                }

                var webpSrc = src.replace(/\.jpe?g$/i, '.webp').replace(/\.png$/i, '.webp');
                img.setAttribute('src', webpSrc);
                img.onerror = function() {
                    // Fallback to original if WebP doesn't exist
                    this.src = src;
                    this.onerror = null;
                };
            }
        });
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceBackgroundImages);
    } else {
        replaceBackgroundImages();
    }
})();
