# 剪刀石头布游戏设计文档

## 概述

使用 Svelte + Vite 构建一个人机对战的剪刀石头布网页游戏，采用简约现代风格。

## 技术栈

- Svelte 5 + Vite
- TypeScript
- CSS Variables (主题系统)
- Web Audio API (程序化音效)
- localStorage (持久化)

## 架构

```
src/
├── App.svelte            # 根组件：主题切换 + 布局
├── lib/
│   ├── Game.svelte       # 主游戏组件
│   ├── Scoreboard.svelte # 计分板组件
│   ├── ThemeToggle.svelte # 主题切换
│   └── sounds.ts         # 音效管理
├── app.css               # 全局样式 + CSS 变量
└── main.ts               # 入口
```

## 游戏流程

1. **待机**：显示三个选项按钮（✊ 石头、✌️ 剪刀、🖐️ 布），计分板在上方
2. **出招**：点击按钮，播放选择音效，按钮有按下动画
3. **揭晓**：短暂动画（约 1 秒），电脑随机出招，双方手势同时揭晓
4. **结果**：胜负文字 + 颜色反馈（绿/红/黄），播放结果音效，更新计分
5. **回到待机**：1.5 秒后可再玩

## 功能清单

### 计分板
- 显示胜/负/平次数
- localStorage 持久化
- 重置按钮

### 主题系统
- CSS 变量驱动亮色/暗色切换
- localStorage 存储偏好
- 默认跟随系统 prefers-color-scheme

### 音效
- Web Audio API 程序化生成
- 选择音、胜利音、失败音
- 无外部音频文件依赖

### 动画
- Svelte 内置 transition（fly、scale、fade）
- 按钮缩放反馈
- 结果弹入动画
- 手势翻转效果
