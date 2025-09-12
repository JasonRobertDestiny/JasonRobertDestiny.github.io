/*!
 * Clean Blog v1.0.0 (http://startbootstrap.com)
 * Copyright 2015 Start Bootstrap
 * Licensed under Apache 2.0 (https://github.com/IronSummitMedia/startbootstrap/blob/gh-pages/LICENSE)
 */

 /*!
 * Jason's Blog v1.6.0 (http://startbootstrap.com)
 * Copyright 2016 @JasonRobertDestiny
 * Licensed under Apache 2.0 
 */

// Tooltip Init
// Unused since V1.6: Titles now display by default so there is no need for tooltip
// $(function() {
//     $("[data-toggle='tooltip']").tooltip();
// });


// make all images responsive
/* 
 * Unused
 * actually only Portfolio-Pages can't use it and only post-img need it.
 * so I modify the _layout/post and CSS to make post-img responsive!
 */
// $(function() {
//  $("img").addClass("img-responsive");
// });

// responsive tables
$(document).ready(function() {
    $("table").wrap("<div class='table-responsive'></div>");
    $("table").addClass("table");
});

// responsive embed videos
$(document).ready(function() {
    $('iframe[src*="youtube.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="youtube.com"]').addClass('embed-responsive-item');
    $('iframe[src*="vimeo.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="vimeo.com"]').addClass('embed-responsive-item');
});

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
    var MQL = 1170;

    // 光标跟随效果
    if ($(window).width() > 768) {
        var $cursorGlow = $('<div class="cursor-glow"></div>').appendTo('body');
        
        $(document).on('mousemove', function(e) {
            $cursorGlow.css({
                left: e.clientX,
                top: e.clientY
            });
        });
        
        $('a, button, .navbar-toggle, .search-toggle').on('mouseenter', function() {
            $cursorGlow.css('opacity', '1');
        }).on('mouseleave', function() {
            $cursorGlow.css('opacity', '0');
        });
    }

    // 滚动显示动画
    function revealOnScroll() {
        var scrolled = $(window).scrollTop();
        var win_height_padded = $(window).height() * 0.9;
        
        $('.scroll-reveal').each(function() {
            var $this = $(this);
            var offsetTop = $this.offset().top;
            
            if (scrolled + win_height_padded > offsetTop) {
                $this.addClass('revealed');
            }
        });
    }
    
    $(window).on('scroll', revealOnScroll);
    revealOnScroll();

    // 目录切换功能
    $('.catalog-toggle').on('click', function(e) {
        e.preventDefault();
        var $catalog = $(this).closest('.side-catalog');
        var $catalogBody = $catalog.find('.catalog-body');
        
        $(this).toggleClass('active');
        $catalogBody.slideToggle(300);
    });
    
    // 平滑滚动
    $('a[href*="#"]:not([href="#"])').on('click', function(e) {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
            || location.hostname == this.hostname) {
            
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
               
            if (target.length) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: target.offset().top - 70
                }, 800, 'swing');
                
                // 高亮目标元素
                target.addClass('highlighted');
                setTimeout(function() {
                    target.removeClass('highlighted');
                }, 2000);
            }
        }
    });
    
    // 标签动画效果
    $('.tags a, #tag_cloud a').on('mouseenter', function() {
        $(this).addClass('tag-animate');
    }).on('mouseleave', function() {
        $(this).removeClass('tag-animate');
    });
    
    // 图片懒加载动画
    $('.post-container img').on('load', function() {
        $(this).addClass('img-loaded');
    });
    
    // 打字机效果
    function typeWriter(element, text, speed = 50) {
        var i = 0;
        element.text('');
        
        function type() {
            if (i < text.length) {
                element.append(text.charAt(i));
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // 应用打字机效果到特定元素
    $('.typewriter').each(function() {
        var text = $(this).text();
        typeWriter($(this), text, 30);
    });
    
    // 数字计数动画
    function animateValue(element, start, end, duration) {
        var startTimestamp = null;
        
        var step = function(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            var progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.text(Math.floor(progress * (end - start) + start));
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }
    
    // 滚动时触发计数动画
    $('.counter').each(function() {
        var $this = $(this);
        var end = parseInt($this.text());
        
        $this.waypoint(function() {
            animateValue($this, 0, end, 2000);
            this.destroy();
        }, {
            offset: '80%'
        });
    });
    
    // 页面加载动画
    $(window).on('load', function() {
        $('.fade-in').each(function(index) {
            var $this = $(this);
            setTimeout(function() {
                $this.addClass('visible');
            }, index * 100);
        });
    });
    
    // 鼠标移动视差效果
    $('.parallax-element').on('mousemove', function(e) {
        var $this = $(this);
        var x = e.clientX / window.innerWidth;
        var y = e.clientY / window.innerHeight;
        
        $this.find('.parallax-layer').each(function() {
            var speed = $(this).data('speed') || 10;
            var xPos = -(x * speed);
            var yPos = -(y * speed);
            
            $(this).css({
                'transform': 'translate(' + xPos + 'px, ' + yPos + 'px)'
            });
        });
    });
    
    // 回到顶部按钮
    var $backToTop = $('<a href="#" class="back-to-top"><i class="fa fa-arrow-up"></i></a>').appendTo('body');
    
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $backToTop.addClass('show');
        } else {
            $backToTop.removeClass('show');
        }
    });
    
    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 800, 'swing');
    });
    
    // 文章阅读进度条
    var $progressBar = $('<div class="reading-progress"></div>').appendTo('body');
    
    $(window).on('scroll', function() {
        var winHeight = $(window).height();
        var docHeight = $(document).height();
        var scrollTop = $(window).scrollTop();
        var trackLength = docHeight - winHeight;
        var percent = Math.floor((scrollTop / trackLength) * 100);
        
        $progressBar.css('width', percent + '%');
    });
    
    // 深色模式切换（如果需要）
    $('.dark-mode-toggle').on('click', function() {
        $('body').toggleClass('dark-mode');
        localStorage.setItem('darkMode', $('body').hasClass('dark-mode'));
    });
    
    // 检查本地存储的深色模式设置
    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
    }

    // 搜索功能增强
    $('.search-toggle').on('click', function() {
        var $search = $('.search-form');
        if ($search.length === 0) {
            $search = $('<div class="search-form"><input type="text" placeholder="搜索文章..." autocomplete="off"></div>');
            $('body').append($search);
            
            $search.find('input').on('input', function() {
                var searchTerm = $(this).val().toLowerCase();
                // 这里可以添加实际的搜索逻辑
            });
        }
        
        $search.fadeToggle(200);
        if ($search.is(':visible')) {
            $search.find('input').focus();
        }
    });

    // 图片懒加载和悬停效果
    $('img').each(function() {
        var $img = $(this);
        if (!$img.parent().hasClass('img-hover-zoom')) {
            $img.wrap('<div class="img-hover-zoom"></div>');
        }
    });

    // 标签点击波纹效果
    $('.tags a, .nav-link, .tech-button').addClass('ripple');

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var headerHeight = $('.navbar-custom').height(),
            bannerHeight  = $('.intro-header .container').height();     
        $(window).on('scroll', {
                previousTop: 0
            },
            function() {
                var currentTop = $(window).scrollTop(),
                    $catalog = $('.side-catalog');

                //check if user is scrolling up by mouse or keyboard
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                        $('.navbar-custom').addClass('is-visible');
                    } else {
                        $('.navbar-custom').removeClass('is-visible is-fixed');
                    }
                } else {
                    //if scrolling down...
                    $('.navbar-custom').removeClass('is-visible');
                    if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
                }
                this.previousTop = currentTop;


                //adjust the appearance of side-catalog
                $catalog.show();
                if (currentTop > (bannerHeight + 41)) {
                    $catalog.addClass('fixed')
                } else {
                    $catalog.removeClass('fixed')
                }
            });
    }

    // 平滑滚动
    $('a[href^="#"]').on('click', function(e) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800);
        }
    });

    // 添加淡入动画
    setTimeout(function() {
        $('.fade-in').addClass('visible');
    }, 100);
});