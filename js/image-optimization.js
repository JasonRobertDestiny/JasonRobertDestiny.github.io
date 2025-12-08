/*!
 * Image Optimization and Lazy Loading for Jason's Blog
 * Provides WebP support, lazy loading, and progressive enhancement
 */

(function() {
    'use strict';
    
    const ImageOptimizer = {
        // Configuration
        config: {
            rootMargin: '50px',
            threshold: 0.1,
            enableWebP: true,
            enableProgressiveLoading: true,
            placeholderColor: '#e5e7eb',
            retryAttempts: 3,
            retryDelay: 1000
        },
        
        // Initialize image optimization
        init: function() {
            this.detectWebPSupport();
            this.setupIntersectionObserver();
            this.processImages();
            this.setupImageErrorHandling();
            this.addProgressiveLoadingStyles();
            console.log('Image optimization initialized');
        },
        
        // Detect WebP support
        detectWebPSupport: function() {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.config.supportsWebP = (webP.height === 2);
                document.documentElement.classList.toggle('webp', this.config.supportsWebP);
                document.documentElement.classList.toggle('no-webp', !this.config.supportsWebP);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        },
        
        // Setup Intersection Observer for lazy loading
        setupIntersectionObserver: function() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for older browsers
                this.loadAllImages();
                return;
            }
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: this.config.rootMargin,
                threshold: this.config.threshold
            });
        },
        
        // Process all images on the page
        processImages: function() {
            const images = document.querySelectorAll('img[data-src], img[src]:not([data-lazy-processed])');
            images.forEach(img => this.processImage(img));
        },
        
        // Process individual image
        processImage: function(img) {
            // Skip if already processed
            if (img.hasAttribute('data-lazy-processed')) return;
            
            img.setAttribute('data-lazy-processed', 'true');
            
            // Set up lazy loading attributes if not present
            if (!img.hasAttribute('data-src') && img.src) {
                img.setAttribute('data-src', img.src);
                img.src = '';
            }
            
            // Add loading states
            img.classList.add('lazy-image');
            
            // Generate responsive srcset if needed
            this.generateResponsiveImages(img);
            
            // Add to observer or load immediately if in viewport
            if (this.observer && img.hasAttribute('data-src')) {
                // Create placeholder
                this.createPlaceholder(img);
                this.observer.observe(img);
            } else if (img.hasAttribute('data-src')) {
                this.loadImage(img);
            }
        },
        
        // Create placeholder for image
        createPlaceholder: function(img) {
            // Create blurred placeholder from original image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 10;
            canvas.height = 10;
            
            // Set initial placeholder
            img.style.backgroundColor = this.config.placeholderColor;
            img.style.minHeight = '200px';
            img.classList.add('lazy-loading');
            
            // Generate placeholder data URL
            const placeholderSrc = this.generatePlaceholder(img);
            if (placeholderSrc) {
                img.src = placeholderSrc;
            }
        },
        
        // Generate placeholder image
        generatePlaceholder: function(img) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 20;
            canvas.height = 20;
            
            // Create gradient placeholder
            const gradient = ctx.createLinearGradient(0, 0, 20, 20);
            gradient.addColorStop(0, '#f3f4f6');
            gradient.addColorStop(1, '#e5e7eb');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 20, 20);
            
            return canvas.toDataURL('image/png');
        },
        
        // Load image with progressive enhancement
        loadImage: function(img) {
            const dataSrc = img.getAttribute('data-src');
            const dataSrcSet = img.getAttribute('data-srcset');
            
            if (!dataSrc) return;
            
            // Create new image for preloading
            const imageLoader = new Image();
            
            // Set up error handling
            imageLoader.onerror = () => {
                this.handleImageError(img, dataSrc);
            };
            
            // Set up success handling
            imageLoader.onload = () => {
                this.onImageLoad(img, imageLoader);
            };
            
            // Set optimal source
            const optimizedSrc = this.getOptimizedSource(dataSrc);
            
            // Load responsive images if available
            if (dataSrcSet) {
                imageLoader.srcset = dataSrcSet;
            }
            
            imageLoader.src = optimizedSrc;
            img.classList.add('lazy-loading');
        },
        
        // Handle successful image load
        onImageLoad: function(img, imageLoader) {
            // Apply loaded image
            img.src = imageLoader.src;
            if (imageLoader.srcset) {
                img.srcset = imageLoader.srcset;
            }
            
            // Update classes
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            
            // Remove placeholder styling
            img.style.backgroundColor = '';
            img.style.minHeight = '';
            
            // Clean up data attributes
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            
            // Add fade-in animation
            if (this.config.enableProgressiveLoading) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });
            }
            
            // Trigger custom event
            this.triggerEvent(img, 'imageloaded');
        },
        
        // Handle image loading errors
        handleImageError: function(img, originalSrc) {
            console.warn('Failed to load image:', originalSrc);
            
            // Try fallback image
            const fallbackSrc = this.getFallbackSource(originalSrc);
            if (fallbackSrc && fallbackSrc !== originalSrc) {
                img.setAttribute('data-src', fallbackSrc);
                this.loadImage(img);
                return;
            }
            
            // Show error placeholder
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-error');
            img.alt = img.alt || '图片加载失败';
            
            // Create error placeholder
            img.src = this.createErrorPlaceholder();
            
            // Trigger error event
            this.triggerEvent(img, 'imageerror');
        },
        
        // Get optimized image source (WebP if supported)
        getOptimizedSource: function(src) {
            if (!this.config.supportsWebP || !this.config.enableWebP) {
                return src;
            }
            
            // Convert to WebP if possible
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // For external images, we can't guarantee WebP availability
            if (src.startsWith('http') && !src.includes(window.location.hostname)) {
                return src;
            }
            
            return webpSrc;
        },
        
        // Get fallback image source
        getFallbackSource: function(src) {
            // If WebP failed, try original format
            if (src.endsWith('.webp')) {
                return src.replace('.webp', '.jpg');
            }
            
            // Try different CDN or size
            return null;
        },
        
        // Create error placeholder SVG
        createErrorPlaceholder: function() {
            const svg = `
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f3f4f6"/>
                    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="14">
                        图片加载失败
                    </text>
                    <path d="M160 160h80v80h-80z M180 180v40 M200 180v40 M220 180v40" stroke="#d1d5db" stroke-width="2" fill="none"/>
                </svg>
            `;
            return `data:image/svg+xml;base64,${btoa(svg)}`;
        },
        
        // Generate responsive images
        generateResponsiveImages: function(img) {
            const dataSrc = img.getAttribute('data-src');
            if (!dataSrc) return;
            
            // Generate srcset for responsive images
            const breakpoints = [320, 480, 768, 1024, 1200, 1600];
            const srcsetEntries = [];
            
            breakpoints.forEach(width => {
                const responsiveSrc = this.generateResponsiveUrl(dataSrc, width);
                if (responsiveSrc) {
                    srcsetEntries.push(`${responsiveSrc} ${width}w`);
                }
            });
            
            if (srcsetEntries.length > 0 && !img.hasAttribute('data-srcset')) {
                img.setAttribute('data-srcset', srcsetEntries.join(', '));
                
                // Set sizes attribute if not present
                if (!img.hasAttribute('sizes')) {
                    img.setAttribute('sizes', 
                        '(max-width: 480px) 100vw, ' +
                        '(max-width: 768px) 90vw, ' +
                        '(max-width: 1024px) 80vw, ' +
                        '70vw'
                    );
                }
            }
        },
        
        // Generate responsive URL (implementation depends on your image service)
        generateResponsiveUrl: function(src, width) {
            // For local images, we might not have different sizes
            if (!src.startsWith('http')) return null;
            
            // Example for Cloudinary or similar services
            // return src.replace('/upload/', `/upload/c_scale,w_${width}/`);
            
            // For now, return original
            return null;
        },
        
        // Load all images (fallback for unsupported browsers)
        loadAllImages: function() {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                
                const dataSrcSet = img.getAttribute('data-srcset');
                if (dataSrcSet) {
                    img.srcset = dataSrcSet;
                    img.removeAttribute('data-srcset');
                }
            });
        },
        
        // Setup global image error handling
        setupImageErrorHandling: function() {
            // Global image error handler
            document.addEventListener('error', (e) => {
                if (e.target.tagName === 'IMG') {
                    this.handleImageError(e.target, e.target.src);
                }
            }, true);
        },
        
        // Add progressive loading styles
        addProgressiveLoadingStyles: function() {
            if (document.getElementById('image-optimization-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'image-optimization-styles';
            style.textContent = `
                .lazy-image {
                    transition: opacity 0.3s ease;
                }
                
                .lazy-loading {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading-shimmer 1.5s infinite;
                }
                
                .lazy-loaded {
                    opacity: 1;
                }
                
                .lazy-error {
                    opacity: 0.7;
                    filter: grayscale(100%);
                }
                
                @keyframes loading-shimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }
                
                /* WebP support detection */
                .webp .lazy-image[data-src$=".jpg"],
                .webp .lazy-image[data-src$=".jpeg"],
                .webp .lazy-image[data-src$=".png"] {
                    /* WebP supported styles */
                }
                
                .no-webp .lazy-image {
                    /* Fallback styles */
                }
                
                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    .lazy-loading {
                        animation: none;
                        background: #f0f0f0;
                    }
                    
                    .lazy-image {
                        transition: none;
                    }
                }
            `;
            document.head.appendChild(style);
        },
        
        // Trigger custom event
        triggerEvent: function(element, eventName) {
            const event = new CustomEvent(eventName, {
                detail: { element: element },
                bubbles: true
            });
            element.dispatchEvent(event);
        },
        
        // Public API methods
        loadImagesInContainer: function(container) {
            const images = container.querySelectorAll('img[data-src]');
            images.forEach(img => this.processImage(img));
        },
        
        preloadImage: function(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        },
        
        updateConfig: function(newConfig) {
            this.config = { ...this.config, ...newConfig };
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ImageOptimizer.init();
        });
    } else {
        ImageOptimizer.init();
    }
    
    // Re-process images when new content is added
    function setupMutationObserver() {
        if (!document.body) {
            // Body not ready, wait for DOMContentLoaded
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const images = node.querySelectorAll('img');
                            images.forEach(img => ImageOptimizer.processImage(img));
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Setup observer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMutationObserver);
    } else {
        setupMutationObserver();
    }

    // Export for global use
    window.ImageOptimizer = ImageOptimizer;
    
})();