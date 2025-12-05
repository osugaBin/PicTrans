# 部署说明

## GitHub Pages 部署

这个项目可以轻松部署到 GitHub Pages 进行免费托管：

### 方法一：直接使用 GitHub Pages

1. 进入你的GitHub仓库：https://github.com/osugaBin/PicTrans
2. 点击 Settings 标签
3. 在左侧菜单中找到 Pages
4. 在 Source 部分选择 Deploy from a branch
5. 选择 main 分支和 /(root) 目录
6. 点击 Save

几分钟后，你的网站就可以通过以下地址访问：
`https://osugabin.github.io/PicTrans/`

### 方法二：使用 GitHub Actions 自动部署

1. 在项目根目录创建 `.github/workflows/deploy.yml`
2. 添加以下内容：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

3. 提交并推送，GitHub Actions 会自动部署

### 其他托管平台

这个项目是纯静态网站，可以部署到任何支持静态文件托管的服务：

- **Vercel**：连接GitHub仓库即可自动部署
- **Netlify**：拖拽文件夹或连接GitHub仓库
- **Surge.sh**：`surge` 命令快速部署
- **Firebase Hosting**：使用 `firebase deploy` 命令

### 本地运行

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx http-server

# 访问 http://localhost:8000
```

## 注意事项

- 确保所有文件都包含在仓库中
- 检查文件路径是否正确
- GitHub Pages 默认支持HTTPS
- 如有自定义域名，可在仓库设置中配置