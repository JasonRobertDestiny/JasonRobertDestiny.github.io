/**
 * Article Interactions - 文章页面交互增强
 * 遵循 frontend-design 原则：渐进增强、性能优先、用户反馈
 */

(function() {
  'use strict';

  // ============================================
  // 工具函数 (Utility Functions)
  // ============================================

  // 节流函数
  function throttle(func, wait) {
    let timeout;
    let previous = 0;

    return function() {
      const context = this;
      const args = arguments;
      const now = Date.now();
      const remaining = wait - (now - previous);

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(function() {
          previous = Date.now();
          timeout = null;
          func.apply(context, args);
        }, remaining);
      }
    };
  }

  // 检测元素是否在视口内
  function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -offset &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // ============================================
  // 阅读进度条 (Reading Progress)
  // ============================================
  function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    const article = document.querySelector('.post-container');
    if (!article) return;

    function updateProgress() {
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 计算阅读进度
      const progress = Math.min(
        Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
        1
      );

      // 使用 scaleX 而不是 width 以获得更好的性能
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // 初始化
    updateProgress();

    // 滚动时更新（节流）
    window.addEventListener('scroll', throttle(updateProgress, 16)); // ~60fps
  }

  // ============================================
  // 滚动显示动画 (Scroll Reveal)
  // ============================================
  function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    // 检查浏览器是否支持 IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              // 一次性动画，显示后停止观察
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      elements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // 降级方案：使用滚动事件
      function checkVisibility() {
        elements.forEach(function(el) {
          if (isInViewport(el, 50) && !el.classList.contains('revealed')) {
            el.classList.add('revealed');
          }
        });
      }

      checkVisibility();
      window.addEventListener('scroll', throttle(checkVisibility, 100));
    }
  }

  // ============================================
  // 侧边目录激活 (Side Catalog Active)
  // ============================================
  function initSideCatalog() {
    const catalogLinks = document.querySelectorAll('.side-catalog .catalog-body a');
    if (!catalogLinks.length) return;

    // 获取所有标题元素
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    if (!headings.length) return;

    function updateActiveCatalog() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      let activeHeading = null;

      // 找到当前最接近视口顶部的标题
      headings.forEach(function(heading) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          activeHeading = heading;
        }
      });

      // 更新目录激活状态
      catalogLinks.forEach(function(link) {
        link.classList.remove('active');

        if (activeHeading) {
          const href = link.getAttribute('href');
          const id = '#' + activeHeading.id;
          if (href === id) {
            link.classList.add('active');
          }
        }
      });
    }

    window.addEventListener('scroll', throttle(updateActiveCatalog, 100));
    updateActiveCatalog();
  }

  // ============================================
  // 返回顶部按钮 (Back to Top)
  // ============================================
  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    function toggleVisibility() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }

    // 点击返回顶部
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', throttle(toggleVisibility, 100));
    toggleVisibility();
  }

  // ============================================
  // 社交分享功能 (Social Share)
  // ============================================

  // 获取当前页面信息
  function getPageInfo() {
    return {
      url: window.location.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || document.title
    };
  }

  // Twitter 分享
  window.shareToTwitter = function() {
    const info = getPageInfo();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(info.title)}&url=${encodeURIComponent(info.url)}`;
    window.open(url, '_blank', 'width=550,height=400');
    return false;
  };

  // Facebook 分享
  window.shareToFacebook = function() {
    const info = getPageInfo();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(info.url)}`;
    window.open(url, '_blank', 'width=550,height=400');
    return false;
  };

  // LinkedIn 分享
  window.shareToLinkedIn = function() {
    const info = getPageInfo();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(info.url)}`;
    window.open(url, '_blank', 'width=550,height=400');
    return false;
  };

  // 微信分享（显示二维码）
  window.shareToWechat = function() {
    const info = getPageInfo();
    showToast('请使用微信扫描二维码分享', 'info');
    // 可以集成 QRCode.js 生成二维码
    return false;
  };

  // 微博分享
  window.shareToWeibo = function() {
    const info = getPageInfo();
    const url = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(info.url)}&title=${encodeURIComponent(info.title)}`;
    window.open(url, '_blank', 'width=550,height=400');
    return false;
  };

  // 复制链接
  window.copyToClipboard = function() {
    const info = getPageInfo();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(info.url)
        .then(function() {
          showToast('链接已复制到剪贴板', 'success');
        })
        .catch(function() {
          fallbackCopyToClipboard(info.url);
        });
    } else {
      fallbackCopyToClipboard(info.url);
    }

    return false;
  };

  // 降级复制方案
  function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      showToast('链接已复制到剪贴板', 'success');
    } catch (err) {
      showToast('复制失败，请手动复制', 'error');
    }

    document.body.removeChild(textarea);
  }

  // ============================================
  // Toast 通知 (Toast Notification)
  // ============================================
  function showToast(message, type = 'info', duration = 3000) {
    // 移除已存在的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    // 图标映射
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    toast.innerHTML = `
      <div class="toast__content">
        <div class="toast__icon">
          <i class="fa ${icons[type] || icons.info}" aria-hidden="true"></i>
        </div>
        <div class="toast__message">${message}</div>
        <button class="toast__close" aria-label="关闭">
          <i class="fa fa-times" aria-hidden="true"></i>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // 触发动画
    setTimeout(function() {
      toast.classList.add('show');
    }, 10);

    // 关闭按钮
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', function() {
      hideToast(toast);
    });

    // 自动关闭
    setTimeout(function() {
      hideToast(toast);
    }, duration);
  }

  function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(function() {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // ============================================
  // 代码块语言标签 (Code Block Language Tag)
  // ============================================
  function initCodeBlockLabels() {
    const codeBlocks = document.querySelectorAll('.article-content pre code[class*="language-"]');

    codeBlocks.forEach(function(codeBlock) {
      const className = codeBlock.className;
      const match = className.match(/language-(\w+)/);

      if (match) {
        const language = match[1];
        const pre = codeBlock.parentElement;

        // 设置语言属性（用于 CSS ::before 伪元素）
        pre.setAttribute('data-lang', language.toUpperCase());
      }
    });
  }

  // ============================================
  // 图片懒加载增强 (Image Lazy Loading Enhancement)
  // ============================================
  function initImageEnhancements() {
    const images = document.querySelectorAll('.article-content img');

    images.forEach(function(img) {
      // 添加加载完成类
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function() {
          img.classList.add('loaded');
        });
      }

      // 添加点击放大功能（可选）
      img.style.cursor = 'pointer';
      img.addEventListener('click', function() {
        // 简单的图片查看器
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          cursor: pointer;
        `;

        const enlargedImg = document.createElement('img');
        enlargedImg.src = img.src;
        enlargedImg.style.cssText = `
          max-width: 90%;
          max-height: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border-radius: 8px;
        `;

        overlay.appendChild(enlargedImg);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function() {
          overlay.remove();
        });
      });
    });
  }

  // ============================================
  // 外链安全处理 (External Links Security)
  // ============================================
  function initExternalLinks() {
    const links = document.querySelectorAll('.article-content a[href^="http"]');

    links.forEach(function(link) {
      const url = new URL(link.href);
      const currentDomain = window.location.hostname;

      // 如果是外部链接
      if (url.hostname !== currentDomain) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');

        // 添加外链图标（可选）
        if (!link.querySelector('.external-icon')) {
          const icon = document.createElement('i');
          icon.className = 'fa fa-external-link external-icon';
          icon.style.cssText = 'margin-left: 4px; font-size: 0.85em; opacity: 0.6;';
          link.appendChild(icon);
        }
      }
    });
  }

  // ============================================
  // 初始化所有功能 (Initialize All)
  // ============================================
  function init() {
    // 检查是否在文章页面
    if (!document.querySelector('.post-container')) {
      return;
    }

    // 尊重用户的动画偏好
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 初始化各项功能
    initReadingProgress();

    if (!prefersReducedMotion) {
      initScrollReveal();
    }

    initSideCatalog();
    initBackToTop();
    initCodeBlockLabels();
    initImageEnhancements();
    initExternalLinks();

    console.log('Article interactions initialized');
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
