# 🛠️ Windows环境博客搭建完全指南

## 📋 准备工作

### 1. 安装Ruby

Jekyll需要Ruby环境，推荐使用RubyInstaller：

1. 访问 [RubyInstaller官网](https://rubyinstaller.org/downloads/)
2. 下载 `Ruby+Devkit 3.1.x (x64)` 版本
3. 运行安装程序，**确保勾选"Add Ruby executables to your PATH"**
4. 安装完成后，在弹出的命令行窗口中选择选项 `3`（安装MSYS2和开发工具链）

### 2. 验证安装

打开新的PowerShell或命令提示符，运行：

```powershell
ruby --version
gem --version
```

应该能看到版本信息。

### 3. 安装Jekyll和Bundler

```powershell
gem install jekyll bundler
```

## 🚀 启动博客

### 1. 安装项目依赖

在项目目录中运行：

```powershell
cd "d:\JasonRobertDestiny.github.io"
bundle install
```

### 2. 启动本地服务器

```powershell
bundle exec jekyll serve
```

或者使用npm脚本：

```powershell
npm start
```

### 3. 预览博客

在浏览器中访问：[http://localhost:4000](http://localhost:4000)

## 📝 已完成的配置

我已经帮你完成了以下配置：

✅ **基本信息**
- 博客标题：Jason's Blog
- 网站URL：https://jasonrobertdestiny.github.io
- GitHub用户名：JasonRobertDestiny

✅ **个人信息**
- 侧边栏描述：热爱技术的程序员
- 头像：GitHub头像（自动获取）

✅ **清理原作者信息**
- 移除了原作者的社交媒体链接
- 清空了朋友链接（你可以后续添加）
- 移除了Google Analytics跟踪代码

✅ **创建了首篇文章**
- 文件：`_posts/2025-06-25-hello-world.markdown`
- 这是一篇欢迎文章，介绍了博客的用途

## 🔧 需要你手动完成的配置

### 1. 更新邮箱地址

编辑 `_config.yml` 文件，将 `your-email@example.com` 替换为你的真实邮箱。

### 2. 添加社交媒体（可选）

如果你有以下社交媒体账号，可以在 `_config.yml` 中添加：

```yaml
weibo_username: 你的微博用户名
zhihu_username: 你的知乎用户名
twitter_username: 你的Twitter用户名
```

### 3. 设置评论系统（可选）

如果需要评论功能，可以：
- 注册 [Disqus](https://disqus.com/) 账号
- 在 `_config.yml` 中填入 `disqus_username`

### 4. 设置Google Analytics（可选）

如果需要访问统计：
- 注册 [Google Analytics](https://analytics.google.com/)
- 在 `_config.yml` 中填入 `ga_track_id`

## 📱 GitHub Pages部署

### 1. 推送代码

```powershell
git add .
git commit -m "初始化个人博客"
git push origin main
```

### 2. 启用GitHub Pages

1. 访问你的GitHub仓库
2. 进入 Settings > Pages
3. 在 Source 中选择 "Deploy from a branch"
4. 选择 "main" 分支
5. 点击 Save

几分钟后，你的博客就会在 `https://jasonrobertdestiny.github.io` 上线了！

## 🎨 自定义建议

### 1. 更换背景图片

- 将你喜欢的图片放到 `img/` 文件夹
- 在 `_config.yml` 中修改 `header-img` 字段

### 2. 修改配色

- 编辑 `less/` 文件夹中的样式文件
- 运行 `grunt` 命令编译样式

### 3. 添加新页面

- 参考 `about.html` 创建新页面
- 在导航栏中添加链接

## 🆘 常见问题

### Q: Ruby安装失败？
A: 确保下载的是带Devkit的版本，并以管理员身份运行安装程序。

### Q: bundle install失败？
A: 可能是网络问题，尝试：
```powershell
bundle config mirror.https://rubygems.org https://gems.ruby-china.com
bundle install
```

### Q: 本地预览空白？
A: 检查 `_config.yml` 中的 `baseurl` 是否为空。

### Q: GitHub Pages部署失败？
A: 检查仓库名是否为 `用户名.github.io` 格式。

---

🎉 恭喜！你的博客即将上线。记得定期更新内容哦！
