# Netlify 环境变量配置

## 必需的环境变量

在Netlify部署设置中需要配置以下环境变量：

### Supabase 配置

```
VITE_SUPABASE_URL=https://yobpdwtturkwqrisirdi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnBkd3R0dXJrd3FyaXNpcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY1MTQsImV4cCI6MjA3MDYwMjUxNH0.UAa-hHQ5vbu6Ydf4Wyp7TmUhCwCAcK0KqJjYurhf6Ac
```

## 如何在Netlify中设置

1. 登录Netlify控制台
2. 进入您的站点设置
3. 点击 "Environment variables"
4. 添加上述环境变量

## 构建设置

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js version: `20`

## 注意事项

- 确保所有环境变量都正确配置
- 检查构建日志确认没有错误
- 确保GitHub仓库已正确连接到Netlify
