# 夜行卡牌 · Tarot de la Nuit

一款塔罗卡牌抽取工具的单页应用。支持单张抽牌、三牌阵（过去 / 现在 / 未来），以及本地历史回顾。

技术栈：Vue 3 + Vite + TypeScript + Pinia + Axios + 纯 CSS3 3D 动画。

## 功能清单

- 单张随机抽牌，正逆位独立
- 三牌阵：过去 / 现在 / 未来
- CSS3 3D 翻牌（含洗牌、发牌入场、悬浮微交互）
- 响应式适配：手机 / 平板 / PC 三档
- 本地历史记录（最近 50 次，localStorage 持久化）
- 抽牌按钮全局防抖 + 统一 Toast 异常提示
- 支持 `prefers-reduced-motion`，对动效敏感用户自动降级

## 启动命令

```bash
# 安装依赖
npm install

# 开发模式（默认 5173 端口）
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

要求 Node ≥ 18.18。包管理器 npm / pnpm / yarn 均可，本仓库用 npm 验证过。

## 目录结构（精简）

```
src/
├── api/              # axios 实例 + 业务接口（含 mock 通道）
├── assets/styles/    # 设计变量与基础样式
├── components/       # 表现层组件
│   ├── card/         # 卡牌相关：TarotCard / CardFace / CardBack ...
│   ├── feedback/     # Toast / Loading
│   └── layout/       # 框架级组件
├── composables/      # 复用逻辑：useDraw / useDebounce / useToast ...
├── data/             # 78 张塔罗牌静态数据
├── router/           # 路由
├── stores/           # Pinia: deck / draw / history
├── types/            # 类型定义
├── utils/            # 工具：shuffle / storage / id / format
└── views/            # 页面级视图
```

更详细的架构与核心实现在 `docs/ARCHITECTURE.md`。

## 部署

构建产物在 `dist/`，是纯静态文件，丢任意 CDN 或静态托管都可以。

- Vercel / Netlify：直接绑定仓库即可，构建命令 `npm run build`，输出目录 `dist`
- GitHub Pages：使用 hash 路由（已在 `src/router/index.ts` 选用 `createWebHashHistory`），不需要额外配置 nginx 重写

## 备注

- 项目里的 78 张牌数据放在 `src/data/*`。大阿卡纳 22 张是逐张手写的牌意；小阿卡纳 56 张以韦特体系基础对应做了语义化的简释，便于在卡面快速阅读。
- 关于"接口对接"：业务里抽牌本可纯前端完成，但题目要求 Axios，于是在 `src/api/http.ts` 里做了完整的实例 / 拦截器 / 错误归一化封装，并保留了一个 `mock` 通道（`src/api/tarot.ts`），上层调用方式与真实接口一致，未来切到后端只需替换实现。
