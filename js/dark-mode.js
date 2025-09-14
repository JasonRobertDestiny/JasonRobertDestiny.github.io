/*!
 * Dark Mode Toggle for Jason's Blog
 * Provides comprehensive dark mode functionality with system preference detection
 */

(function() {
    'use strict';
    
    // Constants
    const STORAGE_KEY = 'darkMode';
    const THEME_ATTRIBUTE = 'data-theme';
    const DARK_CLASS = 'dark-mode';
    
    // State management
    let isDarkMode = false;
    let systemPrefersDark = false;
    
    // DOM elements
    let toggleButton = null;
    let toggleIcon = null;
    
    /**
     * Initialize dark mode functionality
     */
    function init() {
        // Check system preference
        checkSystemPreference();
        
        // Check saved preference
        checkSavedPreference();
        
        // Create toggle button
        createToggleButton();
        
        // Apply initial theme
        applyTheme(isDarkMode);
        
        // Listen for system preference changes
        watchSystemPreference();
        
        // Add keyboard shortcut (Ctrl+Shift+D)
        addKeyboardShortcut();
    }
    
    /**
     * Check system color scheme preference
     */
    function checkSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            systemPrefersDark = true;
        }
    }
    
    /**
     * Check saved user preference
     */
    function checkSavedPreference() {
        const saved = localStorage.getItem(STORAGE_KEY);
        
        if (saved !== null) {
            // User has explicitly set a preference
            isDarkMode = saved === 'true';
        } else {
            // No saved preference, use system preference
            isDarkMode = systemPrefersDark;
        }
    }
    
    /**
     * Create the dark mode toggle button
     */
    function createToggleButton() {
        // Check if button already exists
        if (document.querySelector('.dark-mode-toggle')) {
            toggleButton = document.querySelector('.dark-mode-toggle');
            toggleIcon = toggleButton.querySelector('.icon');
            return;
        }
        
        // Create toggle button
        toggleButton = document.createElement('button');
        toggleButton.className = 'dark-mode-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle dark mode');
        toggleButton.setAttribute('title', 'Toggle dark mode (Ctrl+Shift+D)');
        
        // Create icon
        toggleIcon = document.createElement('i');
        toggleIcon.className = 'icon fa fa-moon-o';
        
        toggleButton.appendChild(toggleIcon);
        
        // Add click handler
        toggleButton.addEventListener('click', toggleDarkMode);
        
        // Add to page
        document.body.appendChild(toggleButton);
        
        // Add hover effects
        toggleButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-50%) scale(1.1)';
        });
        
        toggleButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-50%) scale(1)';
        });
    }
    
    /**
     * Apply theme to the document
     * @param {boolean} dark - Whether to apply dark theme
     */
    function applyTheme(dark) {
        // Prevent transitions during theme change
        document.body.classList.add('no-transition');
        
        if (dark) {
            document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
            document.body.classList.add(DARK_CLASS);
            updateToggleIcon('sun');
        } else {
            document.documentElement.removeAttribute(THEME_ATTRIBUTE);
            document.body.classList.remove(DARK_CLASS);
            updateToggleIcon('moon');
        }
        
        // Re-enable transitions after a short delay
        setTimeout(function() {
            document.body.classList.remove('no-transition');
        }, 100);
        
        // Update meta theme-color
        updateThemeColor(dark);
        
        // Trigger custom event
        dispatchThemeEvent(dark);
    }
    
    /**
     * Update the toggle button icon
     * @param {string} icon - 'sun' or 'moon'
     */
    function updateToggleIcon(icon) {
        if (!toggleIcon) return;
        
        if (icon === 'sun') {
            toggleIcon.className = 'icon fa fa-sun-o';
        } else {
            toggleIcon.className = 'icon fa fa-moon-o';
        }
    }
    
    /**
     * Update meta theme-color for mobile browsers
     * @param {boolean} dark - Whether dark theme is active
     */
    function updateThemeColor(dark) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        
        themeColorMeta.content = dark ? '#1e293b' : '#ffffff';
        
        // Also update Chrome tab color
        let chromeThemeMeta = document.querySelector('meta[name="msapplication-TileColor"]');
        if (chromeThemeMeta) {
            chromeThemeMeta.content = dark ? '#1e293b' : '#4f46e5';
        }
    }
    
    /**
     * Toggle dark mode
     */
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        applyTheme(isDarkMode);
        savePreference(isDarkMode);
        
        // Add ripple effect
        addRippleEffect(toggleButton);
        
        // Provide feedback
        showThemeNotification(isDarkMode);
    }
    
    /**
     * Save user preference to localStorage
     * @param {boolean} dark - Whether dark mode is enabled
     */
    function savePreference(dark) {
        try {
            localStorage.setItem(STORAGE_KEY, dark.toString());
        } catch (e) {
            console.warn('Could not save dark mode preference:', e);
        }
    }
    
    /**
     * Watch for system preference changes
     */
    function watchSystemPreference() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Modern browsers
            if (mediaQuery.addListener) {
                mediaQuery.addListener(handleSystemPreferenceChange);
            } else if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleSystemPreferenceChange);
            }
        }
    }
    
    /**
     * Handle system preference changes
     * @param {MediaQueryListEvent} e - The media query event
     */
    function handleSystemPreferenceChange(e) {
        systemPrefersDark = e.matches;
        
        // Only update if user hasn't explicitly set a preference
        const hasExplicitPreference = localStorage.getItem(STORAGE_KEY) !== null;
        
        if (!hasExplicitPreference) {
            isDarkMode = systemPrefersDark;
            applyTheme(isDarkMode);
        }
    }
    
    /**
     * Add keyboard shortcut for dark mode toggle
     */
    function addKeyboardShortcut() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+D (or Cmd+Shift+D on Mac)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                toggleDarkMode();
            }
        });
    }
    
    /**
     * Add ripple effect to button
     * @param {HTMLElement} button - The button element
     */
    function addRippleEffect(button) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    /**
     * Show theme change notification
     * @param {boolean} dark - Whether dark mode is enabled
     */
    function showThemeNotification(dark) {
        const message = dark ? 'Dark mode enabled' : 'Light mode enabled';
        
        // Try to use existing snackbar if available
        if (window.Snackbar && window.Snackbar.show) {
            window.Snackbar.show({
                text: message,
                duration: 2000,
                pos: 'bottom-right'
            });
        } else {
            // Fallback notification
            showFallbackNotification(message);
        }
    }
    
    /**
     * Show fallback notification
     * @param {string} message - The notification message
     */
    function showFallbackNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${isDarkMode ? '#1e293b' : '#4f46e5'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    /**
     * Dispatch custom theme change event
     * @param {boolean} dark - Whether dark mode is enabled
     */
    function dispatchThemeEvent(dark) {
        const event = new CustomEvent('themechange', {
            detail: {
                darkMode: dark,
                theme: dark ? 'dark' : 'light'
            }
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * Public API
     */
    window.DarkModeToggle = {
        isDark: () => isDarkMode,
        toggle: toggleDarkMode,
        setDark: (dark) => {
            isDarkMode = !!dark;
            applyTheme(isDarkMode);
            savePreference(isDarkMode);
        },
        getSystemPreference: () => systemPrefersDark
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Add CSS animations if not present
    if (!document.querySelector('#dark-mode-animations')) {
        const style = document.createElement('style');
        style.id = 'dark-mode-animations';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .dark-mode-toggle {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .no-transition * {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
})();