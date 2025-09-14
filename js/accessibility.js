/*!
 * Accessibility Enhancement Script for Jason's Blog
 * Provides comprehensive accessibility features and WCAG 2.1 AA compliance
 */

(function() {
    'use strict';
    
    // Accessibility manager
    const A11yManager = {
        init: function() {
            this.addSkipLinks();
            this.enhanceKeyboardNavigation();
            this.addAriaLabels();
            this.setupFocusManagement();
            this.addLiveRegion();
            this.enhanceFormAccessibility();
            this.setupMediaQueries();
            this.addLandmarks();
            console.log('Accessibility enhancements loaded');
        },
        
        // Add skip links for keyboard navigation
        addSkipLinks: function() {
            const skipLinks = document.createElement('nav');
            skipLinks.className = 'skip-links';
            skipLinks.setAttribute('aria-label', '快速导航');
            skipLinks.innerHTML = `
                <a href="#main-content" class="skip-link">跳转到主内容</a>
                <a href="#navbar" class="skip-link">跳转到导航</a>
                <a href="#sidebar" class="skip-link">跳转到侧边栏</a>
            `;
            document.body.insertBefore(skipLinks, document.body.firstChild);
            
            // Add target anchors if they don't exist
            this.ensureAnchors();
        },
        
        // Ensure navigation anchors exist
        ensureAnchors: function() {
            const targets = [
                { id: 'main-content', selector: 'main, .post-container, .container' },
                { id: 'navbar', selector: '.navbar, nav' },
                { id: 'sidebar', selector: '.sidebar, .sidebar-container' }
            ];
            
            targets.forEach(target => {
                if (!document.getElementById(target.id)) {
                    const element = document.querySelector(target.selector);
                    if (element && !element.id) {
                        element.id = target.id;
                    }
                }
            });
        },
        
        // Enhance keyboard navigation
        enhanceKeyboardNavigation: function() {
            // Add keyboard navigation for dropdowns
            const dropdowns = document.querySelectorAll('.dropdown-toggle');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('keydown', this.handleDropdownKeydown.bind(this));
            });
            
            // Add keyboard navigation for tabs
            const tabs = document.querySelectorAll('[role="tab"]');
            tabs.forEach(tab => {
                tab.addEventListener('keydown', this.handleTabKeydown.bind(this));
            });
            
            // Add escape key handler for modals
            document.addEventListener('keydown', this.handleEscapeKey.bind(this));
            
            // Trap focus in modals
            this.setupFocusTrap();
        },
        
        // Handle dropdown keyboard navigation
        handleDropdownKeydown: function(e) {
            const dropdown = e.target.closest('.dropdown');
            const items = dropdown.querySelectorAll('.dropdown-menu a');
            const currentIndex = Array.from(items).indexOf(document.activeElement);
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                    items[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                    items[prevIndex].focus();
                    break;
                case 'Escape':
                    e.preventDefault();
                    dropdown.querySelector('.dropdown-toggle').focus();
                    break;
            }
        },
        
        // Handle tab keyboard navigation
        handleTabKeydown: function(e) {
            const tabList = e.target.closest('[role="tablist"]');
            const tabs = tabList.querySelectorAll('[role="tab"]');
            const currentIndex = Array.from(tabs).indexOf(e.target);
            
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                    this.activateTab(tabs[prevIndex]);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                    this.activateTab(tabs[nextIndex]);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.activateTab(tabs[0]);
                    break;
                case 'End':
                    e.preventDefault();
                    this.activateTab(tabs[tabs.length - 1]);
                    break;
            }
        },
        
        // Activate tab with proper ARIA attributes
        activateTab: function(tab) {
            const tabList = tab.closest('[role="tablist"]');
            const allTabs = tabList.querySelectorAll('[role="tab"]');
            const tabPanelId = tab.getAttribute('aria-controls');
            const tabPanel = document.getElementById(tabPanelId);
            
            // Deactivate all tabs
            allTabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '-1');
                const panelId = t.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);
                if (panel) {
                    panel.hidden = true;
                }
            });
            
            // Activate current tab
            tab.setAttribute('aria-selected', 'true');
            tab.setAttribute('tabindex', '0');
            tab.focus();
            
            if (tabPanel) {
                tabPanel.hidden = false;
            }
        },
        
        // Handle escape key for modals
        handleEscapeKey: function(e) {
            if (e.key === 'Escape') {
                // Close modals
                const openModal = document.querySelector('.modal[aria-hidden="false"]');
                if (openModal) {
                    this.closeModal(openModal);
                }
                
                // Close dropdowns
                const openDropdown = document.querySelector('.dropdown.show');
                if (openDropdown) {
                    this.closeDropdown(openDropdown);
                }
            }
        },
        
        // Setup focus trap for modals
        setupFocusTrap: function() {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        this.trapFocus(e, modal);
                    }
                });
            });
        },
        
        // Trap focus within element
        trapFocus: function(e, container) {
            const focusableElements = container.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        },
        
        // Add ARIA labels and descriptions
        addAriaLabels: function() {
            // Add labels to navigation items
            const navItems = document.querySelectorAll('.nav-link');
            navItems.forEach(item => {
                if (!item.getAttribute('aria-label') && item.textContent) {
                    item.setAttribute('aria-label', item.textContent.trim());
                }
            });
            
            // Add labels to social media links
            const socialLinks = document.querySelectorAll('.share-btn');
            socialLinks.forEach(link => {
                if (!link.getAttribute('aria-label')) {
                    const platform = link.className.match(/share-btn\s+(\w+)/)?.[1];
                    if (platform) {
                        link.setAttribute('aria-label', `分享到${platform}`);
                    }
                }
            });
            
            // Add descriptions to form inputs
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea, select');
                const helpText = group.querySelector('.help-text');
                if (input && helpText) {
                    const helpId = `help-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    helpText.id = helpId;
                    input.setAttribute('aria-describedby', helpId);
                }
            });
            
            // Add landmarks
            this.addLandmarks();
        },
        
        // Add ARIA landmarks
        addLandmarks: function() {
            // Main content
            const mainContent = document.querySelector('.post-container, .container');
            if (mainContent && !mainContent.getAttribute('role')) {
                mainContent.setAttribute('role', 'main');
                mainContent.setAttribute('aria-label', '主要内容');
            }
            
            // Navigation
            const nav = document.querySelector('.navbar, nav');
            if (nav && !nav.getAttribute('role')) {
                nav.setAttribute('role', 'navigation');
                nav.setAttribute('aria-label', '主导航');
            }
            
            // Sidebar
            const sidebar = document.querySelector('.sidebar-container');
            if (sidebar && !sidebar.getAttribute('role')) {
                sidebar.setAttribute('role', 'complementary');
                sidebar.setAttribute('aria-label', '侧边栏');
            }
            
            // Footer
            const footer = document.querySelector('footer');
            if (footer && !footer.getAttribute('role')) {
                footer.setAttribute('role', 'contentinfo');
                footer.setAttribute('aria-label', '网站信息');
            }
        },
        
        // Setup focus management
        setupFocusManagement: function() {
            // Remember focus on page navigation
            this.rememberFocus();
            
            // Add focus indicators
            this.addFocusIndicators();
            
            // Handle modal focus
            this.handleModalFocus();
        },
        
        // Remember focus position
        rememberFocus: function() {
            const links = document.querySelectorAll('a[href]');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    sessionStorage.setItem('lastFocusedElement', link.getAttribute('href'));
                });
            });
            
            // Restore focus on page load
            window.addEventListener('load', () => {
                const lastFocused = sessionStorage.getItem('lastFocusedElement');
                if (lastFocused && window.location.pathname.includes(lastFocused)) {
                    const element = document.querySelector('h1, [role="main"]');
                    if (element) {
                        element.focus();
                    }
                }
            });
        },
        
        // Add visual focus indicators
        addFocusIndicators: function() {
            const style = document.createElement('style');
            style.textContent = `
                .focus-indicator {
                    position: relative;
                }
                .focus-indicator:focus::after {
                    content: '';
                    position: absolute;
                    top: -3px;
                    left: -3px;
                    right: -3px;
                    bottom: -3px;
                    border: 3px solid #4f46e5;
                    border-radius: 4px;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
            
            // Apply to interactive elements
            const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
            interactiveElements.forEach(element => {
                element.classList.add('focus-indicator');
            });
        },
        
        // Handle modal focus management
        handleModalFocus: function() {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'aria-hidden') {
                            if (modal.getAttribute('aria-hidden') === 'false') {
                                // Modal opened
                                this.onModalOpen(modal);
                            } else {
                                // Modal closed
                                this.onModalClose(modal);
                            }
                        }
                    });
                });
                
                observer.observe(modal, { attributes: true });
            });
        },
        
        // Modal opened
        onModalOpen: function(modal) {
            // Save current focus
            modal._lastFocus = document.activeElement;
            
            // Focus first focusable element in modal
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
            
            // Announce modal
            this.announceToScreenReader(`模态框已打开`);
        },
        
        // Modal closed
        onModalClose: function(modal) {
            // Restore focus
            if (modal._lastFocus) {
                modal._lastFocus.focus();
                delete modal._lastFocus;
            }
            
            // Restore background scrolling
            document.body.style.overflow = '';
            
            // Announce modal closure
            this.announceToScreenReader(`模态框已关闭`);
        },
        
        // Add live region for announcements
        addLiveRegion: function() {
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'live-region sr-only';
            liveRegion.id = 'live-region';
            document.body.appendChild(liveRegion);
        },
        
        // Announce message to screen readers
        announceToScreenReader: function(message) {
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
                
                // Clear after announcement
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        },
        
        // Enhance form accessibility
        enhanceFormAccessibility: function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                // Add form labels
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                        const label = form.querySelector(`label[for="${input.id}"]`);
                        if (!label && input.placeholder) {
                            input.setAttribute('aria-label', input.placeholder);
                        }
                    }
                    
                    // Add required indicators
                    if (input.required && !input.getAttribute('aria-required')) {
                        input.setAttribute('aria-required', 'true');
                    }
                    
                    // Add invalid state
                    input.addEventListener('invalid', () => {
                        input.setAttribute('aria-invalid', 'true');
                        this.announceToScreenReader(`${input.name || '字段'} 输入无效`);
                    });
                    
                    input.addEventListener('input', () => {
                        if (input.checkValidity()) {
                            input.setAttribute('aria-invalid', 'false');
                        }
                    });
                });
                
                // Add form submission feedback
                form.addEventListener('submit', (e) => {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        const firstInvalid = form.querySelector('[aria-invalid="true"], :invalid');
                        if (firstInvalid) {
                            firstInvalid.focus();
                            this.announceToScreenReader('表单包含错误，请检查并重试');
                        }
                    } else {
                        this.announceToScreenReader('表单提交中...');
                    }
                });
            });
        },
        
        // Setup media queries for accessibility preferences
        setupMediaQueries: function() {
            // Reduced motion
            if (window.matchMedia) {
                const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                this.handleMotionPreference(motionQuery);
                motionQuery.addListener(this.handleMotionPreference);
                
                // High contrast
                const contrastQuery = window.matchMedia('(prefers-contrast: high)');
                this.handleContrastPreference(contrastQuery);
                contrastQuery.addListener(this.handleContrastPreference);
            }
        },
        
        // Handle motion preferences
        handleMotionPreference: function(mediaQuery) {
            if (mediaQuery.matches) {
                document.documentElement.classList.add('reduce-motion');
            } else {
                document.documentElement.classList.remove('reduce-motion');
            }
        },
        
        // Handle contrast preferences
        handleContrastPreference: function(mediaQuery) {
            if (mediaQuery.matches) {
                document.documentElement.classList.add('high-contrast');
            } else {
                document.documentElement.classList.remove('high-contrast');
            }
        },
        
        // Close modal
        closeModal: function(modal) {
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        },
        
        // Close dropdown
        closeDropdown: function(dropdown) {
            dropdown.classList.remove('show');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = 'none';
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => A11yManager.init());
    } else {
        A11yManager.init();
    }
    
    // Export for global use
    window.A11yManager = A11yManager;
    
})();