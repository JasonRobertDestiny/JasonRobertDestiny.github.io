# 📝 Jekyll博客写作完全指南

## 📖 文章结构

每篇Jekyll博客文章都包含两部分：
1. **Front Matter**（文件头部的YAML配置）
2. **正文内容**（Markdown格式）

## 🎯 Front Matter 详解

每篇文章开头必须有Front Matter，用三个短横线包围：

```yaml
---
layout: post           # 布局模板（固定为post）
title: "文章标题"       # 文章标题
subtitle: "副标题"      # 副标题（可选）
date: 2025-06-26 10:00:00  # 发布日期和时间
author: "Jason"        # 作者名
header-img: "img/post-bg-example.jpg"  # 头部背景图
catalog: true          # 是否显示目录
tags:                  # 标签
    - 技术
    - 学习
    - 编程
---
```

### Front Matter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `layout` | ✅ | 固定为 `post` |
| `title` | ✅ | 文章标题 |
| `subtitle` | ❌ | 副标题，会显示在标题下方 |
| `date` | ✅ | 发布日期时间，格式：`YYYY-MM-DD HH:MM:SS` |
| `author` | ✅ | 作者名称 |
| `header-img` | ❌ | 背景图片路径（相对于网站根目录） |
| `catalog` | ❌ | 是否显示文章目录，默认false |
| `tags` | ❌ | 文章标签，可以有多个 |

## 📂 文件命名规则

文章文件必须放在 `_posts` 文件夹中，文件名格式：
```
YYYY-MM-DD-title.markdown
```

**示例：**
- `2025-06-26-my-first-post.markdown`
- `2025-06-26-learning-javascript.md`
- `2025-06-26-技术分享.markdown`

## ✨ Markdown 语法

### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

### 段落和换行
```markdown
这是第一段内容。

这是第二段内容。

段落内换行，在行末加两个空格  
然后这里就是新的一行。
```

### 强调
```markdown
**粗体文字**
*斜体文字*
***粗体加斜体***
~~删除线~~
```

### 列表
```markdown
## 无序列表
- 第一项
- 第二项
  - 子项目
  - 另一个子项目
- 第三项

## 有序列表
1. 第一步
2. 第二步
3. 第三步
```

### 链接
```markdown
[链接文字](https://example.com)
[链接文字](https://example.com "鼠标悬停显示的标题")
```

### 图片
```markdown
![图片描述](img/example.jpg)
![图片描述](https://example.com/image.jpg "图片标题")
```

### 代码
````markdown
## 行内代码
这是一段包含 `代码` 的文字。

## 代码块
```javascript
function hello() {
    console.log("Hello World!");
}
```

```python
def hello():
    print("Hello World!")
```
````

### 引用
```markdown
> 这是一段引用文字
> 可以有多行
>> 还可以嵌套引用
```

### 表格
```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |
```

## 🎨 特殊功能

### 目录功能
在Front Matter中设置 `catalog: true`，会自动为文章生成目录。

### 数学公式（如果启用MathJax）
```markdown
行内公式：$E = mc^2$

块级公式：
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$
```

### 代码高亮
支持多种编程语言的语法高亮：
- `javascript`, `js`
- `python`, `py`
- `java`
- `html`
- `css`
- `bash`, `shell`
- `json`
- `xml`
- 等等...

## 📝 文章模板

### 技术文章模板
```markdown
---
layout: post
title: "技术文章标题"
subtitle: "简短的副标题描述"
date: 2025-06-26 10:00:00
author: "Jason"
header-img: "img/post-bg-tech.jpg"
catalog: true
tags:
    - 技术
    - 编程
    - 教程
---

## 前言

简单介绍文章的背景和目的。

## 问题描述

详细描述要解决的问题。

## 解决方案

### 方法一

具体的解决步骤...

### 方法二

另一种解决方案...

## 代码示例

```javascript
// 示例代码
function example() {
    return "Hello World!";
}
```

## 总结

总结文章的要点和收获。

## 参考资料

- [参考链接1](https://example.com)
- [参考链接2](https://example.com)
```

### 生活感悟模板
```markdown
---
layout: post
title: "感悟文章标题"
subtitle: "生活中的小思考"
date: 2025-06-26 20:00:00
author: "Jason"
header-img: "img/post-bg-life.jpg"
catalog: false
tags:
    - 生活
    - 感悟
    - 思考
---

## 起因

描述触发这次思考的事件...

## 思考过程

详细描述自己的思考过程...

## 感悟

总结自己的心得体会...

## 后记

一些延伸的思考或计划...
```

## 🚀 发布流程

1. **创建文章文件**
   ```bash
   # 在 _posts 文件夹中创建新文件
   2025-06-26-my-new-post.markdown
   ```

2. **编写内容**
   - 添加Front Matter
   - 用Markdown编写正文

3. **本地预览**（可选）
   ```bash
   bundle exec jekyll serve
   ```

4. **提交到GitHub**
   ```bash
   git add .
   git commit -m "发布新文章：文章标题"
   git push origin master
   ```

5. **等待部署**
   - GitHub Pages会自动构建
   - 通常2-5分钟后文章就会在线显示

## 💡 写作技巧

### 1. 标题要吸引人
- ✅ "5分钟学会JavaScript闭包"
- ❌ "关于JavaScript的一些知识"

### 2. 使用合适的标签
- 技术文章：技术栈名称、编程语言
- 生活文章：生活、感悟、思考
- 学习笔记：学习、笔记、总结

### 3. 添加目录
对于长文章，建议开启 `catalog: true`

### 4. 图片使用
- 将图片放在 `img/` 文件夹中
- 使用相对路径引用：`img/your-image.jpg`

### 5. 代码格式化
- 使用合适的语言标识符
- 添加注释说明关键部分

## 🎯 SEO优化

1. **标题优化**：包含关键词，简洁明了
2. **标签使用**：选择相关性强的标签
3. **内容质量**：原创、有价值的内容
4. **图片优化**：添加alt属性描述

---

现在你已经掌握了Jekyll博客的写作方法！开始创作你的第一篇技术文章吧！ 🎉
