[English](./README-EN.md) | [中文](./README.md)

# 剪刀石头布

一个美观且有趣的剪刀石头布网页游戏，使用 Svelte 5 + TypeScript + Vite 构建。

![剪刀石头布](https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)

## 功能特性

- 🎮 **经典玩法** - 剪刀、石头、布，三种选择
- 📊 **分数记录** - 自动保存胜负平记录到 localStorage
- 🔊 **音效反馈** - 出拳、胜利、失败、平局各有独特音效
- 🎨 **精美动画** - 流畅的过渡动画和交互效果
- 🌓 **主题切换** - 支持明暗主题切换
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 技术栈

- **Svelte 5** - 渐进式前端框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Vitest** - 快速单元测试框架

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

启动开发服务器，访问 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 运行测试

```bash
pnpm test        # 运行一次测试
pnpm test:watch  # 监听模式
```

## 项目结构

```
src/
├── lib/
│   ├── Game.svelte       # 游戏主组件
│   ├── gameLogic.ts      # 游戏逻辑
│   ├── Scoreboard.svelte # 记分板组件
│   ├── sounds.ts         # 音效模块
│   ├── ThemeToggle.svelte# 主题切换组件
│   └── __tests__/
│       └── gameLogic.test.ts # 游戏逻辑测试
├── App.svelte            # 应用入口
├── app.css               # 全局样式
└── main.ts               # 入口文件
```

## 游戏规则

- ✊ 石头 胜 ✌️ 剪刀
- 🖐️ 布 胜 ✊ 石头
- ✌️ 剪刀 胜 🖐️ 布
- 相同选择为平局

## 许可证

MIT License
