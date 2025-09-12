/**
 * 背景切换器组件
 * 支持多种背景主题的动态切换
 */
class BackgroundSwitcher {
    constructor() {
        this.themes = {
            'default': {
                name: '默认',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                icon: '🌟'
            },
            'ocean': {
                name: '海洋',
                background: 'linear-gradient(135deg, #667db6 0%, #0082c8 25%, #0082c8 75%, #667db6 100%)',
                icon: '🌊'
            },
            'sunset': {
                name: '日落',
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                icon: '🌅'
            },
            'forest': {
                name: '森林',
                background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
                icon: '🌲'
            },
            'galaxy': {
                name: '星空',
                background: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 25%, #2c3e50 50%, #4a6741 75%, #2c3e50 100%)',
                icon: '🌌'
            },
            'aurora': {
                name: '极光',
                background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                icon: '🌈'
            }
        };
        
        this.currentTheme = localStorage.getItem('bg-theme') || 'default';
        this.init();
    }
    
    init() {
        this.createSwitcher();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }
    
    createSwitcher() {
        // 检查是否已经存在背景切换器，避免重复创建
        if (document.querySelector('.bg-switcher')) {
            return;
        }
        
        // 创建背景切换器容器
        const switcher = document.createElement('div');
        switcher.className = 'bg-switcher';
        switcher.innerHTML = `
            <div class="bg-switcher-toggle">
                <i class="fa fa-palette"></i>
                <span>背景</span>
            </div>
            <div class="bg-switcher-panel">
                <div class="bg-switcher-title">选择背景主题</div>
                <div class="bg-switcher-themes">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="bg-theme-option" data-theme="${key}" title="${theme.name}">
                            <div class="bg-theme-preview" style="background: ${theme.background}"></div>
                            <span class="bg-theme-icon">${theme.icon}</span>
                            <span class="bg-theme-name">${theme.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(switcher);
    }
    
    bindEvents() {
        const toggle = document.querySelector('.bg-switcher-toggle');
        const panel = document.querySelector('.bg-switcher-panel');
        const options = document.querySelectorAll('.bg-theme-option');
        
        // 确保元素存在后再绑定事件
        if (!toggle || !panel || options.length === 0) {
            console.warn('Background switcher elements not found');
            return;
        }
        
        // 切换面板显示/隐藏
        toggle.addEventListener('click', () => {
            panel.classList.toggle('active');
        });
        
        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.bg-switcher')) {
                panel.classList.remove('active');
            }
        });
        
        // 主题选择
        options.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.switchTheme(theme);
                panel.classList.remove('active');
            });
        });
    }
    
    switchTheme(themeKey) {
        if (this.themes[themeKey]) {
            this.currentTheme = themeKey;
            this.applyTheme(themeKey);
            localStorage.setItem('bg-theme', themeKey);
            
            // 更新选中状态
            document.querySelectorAll('.bg-theme-option').forEach(option => {
                option.classList.remove('active');
            });
            document.querySelector(`[data-theme="${themeKey}"]`).classList.add('active');
        }
    }
    
    applyTheme(themeKey) {
        const theme = this.themes[themeKey];
        if (theme) {
            // 应用到body背景
            document.body.style.background = theme.background;
            document.body.style.backgroundAttachment = 'fixed';
            
            // 应用到intro-header背景
            const introHeader = document.querySelector('.intro-header');
            if (introHeader) {
                introHeader.style.background = theme.background;
            }
            
            // 更新选中状态
            setTimeout(() => {
                document.querySelectorAll('.bg-theme-option').forEach(option => {
                    option.classList.remove('active');
                });
                const activeOption = document.querySelector(`[data-theme="${themeKey}"]`);
                if (activeOption) {
                    activeOption.classList.add('active');
                }
            }, 100);
        }
    }
}

// 页面加载完成后初始化背景切换器
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundSwitcher();
});