/*!
 * Enhanced Social Sharing Functions for Jason's Blog
 * Provides comprehensive social sharing with analytics tracking
 */

(function() {
    'use strict';
    
    // Social sharing functions
    window.shareToTwitter = function() {
        const title = document.title;
        const url = window.location.href;
        const text = encodeURIComponent(`${title} - 来自Jason的技术博客`);
        const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}&via=JasonRobertBlog`;
        
        openShareWindow(shareUrl, 'twitter');
        trackShareEvent('Twitter');
    };
    
    window.shareToFacebook = function() {
        const url = window.location.href;
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        
        openShareWindow(shareUrl, 'facebook');
        trackShareEvent('Facebook');
    };
    
    window.shareToLinkedIn = function() {
        const title = document.title;
        const url = window.location.href;
        const description = getPageDescription();
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
        
        openShareWindow(shareUrl, 'linkedin');
        trackShareEvent('LinkedIn');
    };
    
    window.shareToWechat = function() {
        const url = window.location.href;
        const title = document.title;
        
        // Generate QR code for WeChat sharing
        generateQRCode(url, title);
        trackShareEvent('WeChat');
    };
    
    window.shareToWeibo = function() {
        const title = document.title;
        const url = window.location.href;
        const description = getPageDescription();
        const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title + ' - ' + description)}&appkey=`;
        
        openShareWindow(shareUrl, 'weibo');
        trackShareEvent('Weibo');
    };
    
    window.copyToClipboard = function() {
        const url = window.location.href;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function() {
                showNotification('链接已复制到剪贴板！', 'success');
                trackShareEvent('CopyLink');
            }).catch(function() {
                fallbackCopyToClipboard(url);
            });
        } else {
            fallbackCopyToClipboard(url);
        }
    };
    
    // Helper functions
    function openShareWindow(url, platform) {
        const width = getWindowWidth(platform);
        const height = getWindowHeight(platform);
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        const popup = window.open(
            url,
            `share-${platform}`,
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
        
        if (popup) {
            popup.focus();
        } else {
            // Fallback if popup is blocked
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
    
    function getWindowWidth(platform) {
        const widths = {
            twitter: 550,
            facebook: 626,
            linkedin: 750,
            weibo: 615
        };
        return widths[platform] || 600;
    }
    
    function getWindowHeight(platform) {
        const heights = {
            twitter: 420,
            facebook: 436,
            linkedin: 570,
            weibo: 505
        };
        return heights[platform] || 500;
    }
    
    function getPageDescription() {
        let description = document.querySelector('meta[name="description"]');
        if (description) {
            return description.content;
        }
        
        // Fallback to first paragraph
        const firstParagraph = document.querySelector('.post-container p');
        if (firstParagraph) {
            return firstParagraph.textContent.substring(0, 160) + '...';
        }
        
        return '来自Jason的技术博客 - 专注AI开发和Agent应用';
    }
    
    function generateQRCode(url, title) {
        // Create modal for QR code
        const modal = createQRModal(url, title);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        // Generate QR code using online service
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
        const qrImage = modal.querySelector('.qr-code img');
        qrImage.src = qrCodeUrl;
        qrImage.alt = `QR码: ${title}`;
    }
    
    function createQRModal(url, title) {
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-modal-backdrop" onclick="closeQRModal()"></div>
            <div class="qr-modal-content">
                <div class="qr-modal-header">
                    <h4><i class="fa fa-wechat"></i> 微信扫码分享</h4>
                    <button class="qr-close-btn" onclick="closeQRModal()" aria-label="关闭">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="qr-modal-body">
                    <div class="qr-code">
                        <img src="" alt="二维码加载中..." />
                    </div>
                    <p class="qr-instructions">使用微信扫描二维码分享文章</p>
                    <div class="qr-url">
                        <input type="text" value="${url}" readonly onclick="this.select()">
                        <button onclick="copyToClipboard()" class="copy-url-btn">
                            <i class="fa fa-copy"></i> 复制链接
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    window.closeQRModal = function() {
        const modal = document.querySelector('.qr-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    };
    
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('链接已复制到剪贴板！', 'success');
                trackShareEvent('CopyLink');
            } else {
                showNotification('复制失败，请手动复制链接', 'error');
            }
        } catch (err) {
            showNotification('复制失败，请手动复制链接', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    function showNotification(message, type) {
        // Try to use existing snackbar
        if (window.Snackbar && window.Snackbar.show) {
            window.Snackbar.show({
                text: message,
                duration: 3000,
                pos: 'bottom-center',
                actionTextColor: type === 'success' ? '#10b981' : '#ef4444'
            });
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'success' ? '#10b981' : '#ef4444'};
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 100);
            
            // Hide notification
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
    }
    
    function trackShareEvent(platform) {
        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'article',
                item_id: window.location.pathname
            });
        }
        
        // Custom tracking event
        if (typeof window.analytics !== 'undefined') {
            window.analytics.track('Article Shared', {
                platform: platform,
                url: window.location.href,
                title: document.title
            });
        }
        
        console.log(`Shared to ${platform}: ${document.title}`);
    }
    
    // Add CSS for QR modal
    const qrModalStyles = document.createElement('style');
    qrModalStyles.textContent = `
        .qr-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .qr-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .qr-modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .qr-modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            max-height: 90vh;
            overflow: hidden;
        }
        
        .qr-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #7bb32e, #5a8a1f);
            color: white;
        }
        
        .qr-modal-header h4 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        
        .qr-modal-header i {
            margin-right: 8px;
        }
        
        .qr-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: background 0.2s ease;
        }
        
        .qr-close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .qr-modal-body {
            padding: 30px;
            text-align: center;
        }
        
        .qr-code {
            margin-bottom: 20px;
        }
        
        .qr-code img {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            max-width: 200px;
            height: auto;
        }
        
        .qr-instructions {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 20px;
        }
        
        .qr-url {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        .qr-url input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 12px;
            background: #f9fafb;
        }
        
        .copy-url-btn {
            padding: 8px 12px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s ease;
            white-space: nowrap;
        }
        
        .copy-url-btn:hover {
            background: #4338ca;
        }
        
        @media (max-width: 480px) {
            .qr-modal-content {
                width: 95%;
            }
            
            .qr-modal-body {
                padding: 20px;
            }
            
            .qr-url {
                flex-direction: column;
            }
            
            .qr-url input {
                width: 100%;
                margin-bottom: 8px;
            }
            
            .copy-url-btn {
                width: 100%;
            }
        }
    `;
    
    document.head.appendChild(qrModalStyles);
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeQRModal();
        }
    });
    
})();