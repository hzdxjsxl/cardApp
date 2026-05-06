# 技术文档

## 一、项目说明

**夜行卡牌 · Tarot de la Nuit**，是一款单页塔罗抽牌工具。题目要求是"卡牌抽取工具"，
塔罗刚好同时具备牌阵、正逆位、文化语义这三层东西，能把交互精度和数据结构都铺开，
所以最终选了塔罗作为业务载体（而不是抽奖卡）。

## 二、技术选型与权衡

| 层 | 选型 | 备选 | 选它的原因 |
|---|---|---|---|
| 框架 | Vue 3 + `<script setup>` | Vue 3 Options API | TS 类型推导更顺畅、模板与组合式函数解耦更彻底 |
| 构建 | Vite 5 | webpack | 启动快、HMR 干净，Vue 官方默认搭档 |
| 状态 | Pinia | Vuex | Vue 官方推荐，TS 友好，DevTools 一线 |
| 路由 | vue-router 4（hash 模式） | history 模式 | 静态托管不需要服务端 rewrite，部署成本最低 |
| 网络 | Axios | fetch + 二次封装 | 题目硬性要求；拦截器 / 取消语义成熟 |
| 动画 | 纯 CSS3 3D + transition | GSAP / Anime.js | 题目点名 CSS3 3D 动画；不引入额外运行时库，更克制 |
| 样式 | 原生 CSS（CSS Module 局部 + tokens 变量） | UnoCSS / Tailwind | 78 张牌的题量不需要原子化样式，scoped + 变量足够 |

## 三、整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│  视图层 (views / components)                                   │
│  HomeView · SingleDrawView · ThreeCardsView · HistoryView      │
│           │                                                     │
│           ▼ 调用                                                │
│  组合式函数 (composables)                                       │
│  useDraw · useToast · useDebounce · useReducedMotion           │
│           │                                                     │
│           ▼ 操作                                                │
│  状态层 (Pinia stores)                                          │
│  useDeckStore · useDrawStore · useHistoryStore                 │
│           │                                                     │
│           ▼ 调用                                                │
│  接口层 (api/)                                                  │
│  http.ts (axios 实例 / 拦截器 / 取消)                           │
│  tarot.ts (业务接口 / 当前 mock，可切真实接口)                  │
│           │                                                     │
│           ▼                                                     │
│  数据层 (data/) + 工具层 (utils/)                               │
└─────────────────────────────────────────────────────────────────┘
```

设计原则：
- 视图层只描述「样子」，不写抽牌业务规则
- 业务逻辑沉到 `composables/useDraw.ts`，单抽与三牌阵共用一份
- store 是单一事实源，视图通过 `storeToRefs` 取响应式引用
- API 层做错误归一化，视图层只关心 `NormalizedError`

## 四、核心实现

### 4.1 3D 翻牌（核心动画）

文件：`src/components/card/TarotCard.vue`

要点：
1. 外层 `perspective` 给出 3D 透视空间，统一在 `--card-perspective` 变量
2. `transform-style: preserve-3d` 让子元素参与 3D 渲染
3. 两面用绝对定位重叠，正面 `transform: rotateY(180deg)` 预先翻转
4. `backface-visibility: hidden` 防止"穿模"
5. 翻牌通过 `.tarot-card--flipped` 修饰类切换 `rotateY`
6. 缓动函数采用 `cubic-bezier(0.4, 0.18, 0.18, 1)`（在 tokens 里叫 `--ease-flip`），
   起手平稳、收尾干净，避免 ease 的"塑料感"
7. 入场使用 `@keyframes deal-in` 做发牌错位（top → 0 + 微抖）
8. 仅在 `transform / opacity` 上做动画，避免触发 layout，**will-change** 限定在内层 inner

降级：
- `prefers-reduced-motion: reduce` 直接把所有动画时长归零，并在 keyframes 上 `animation: none`
- 旧 Safari 通过 `-webkit-backface-visibility` 兜底

### 4.2 抽牌状态机

文件：`src/stores/draw.ts`

```
idle ─── startDraw ──▶ shuffling ──(api+timer)──▶ dealing ──(timer)──▶ revealable
                                                                      │
                                                                      ▼
                                                                  user flip
                                                                      │
                                                                      ▼
                                                                  revealed
```

- 抽牌请求与"洗牌动画"通过 `Promise.all` 并行，保证整体节奏
- 用户必须等动画到 `revealable` 才能翻牌（组件 `interactive` 受控）
- 全部翻完时自动写入历史，用户无感知

### 4.3 防抖

文件：`src/composables/useDebounce.ts`

- 支持 `leading: true`，首次立即执行，剩余事件防抖
- `onScopeDispose` 自动清理 timer，组件卸载零泄漏
- 抽牌按钮使用 `leading: true`，避免"按下去没反应"的体感问题

### 4.4 Axios 封装

文件：`src/api/http.ts`

- 单实例：`instance`，10s 超时
- 请求拦截器：预留 token / trace-id 注入口
- 响应拦截器：错误统一走 `normalize()`，输出 `NormalizedError`
- `request<T>()`：统一剥壳 `ApiEnvelope`，对同名 `cancelKey` 自动取消上一次请求（处理快速重复点击）
- 取消借助 `AbortController`，新写法，比 `CancelToken` 干净

### 4.5 历史持久化

文件：`src/stores/history.ts` + `src/utils/storage.ts`

- localStorage 作为存储介质，key 加版本号 `card-draw-app:history@v1`，未来要改字段也可平滑迁移
- 读取时反序列化失败自动清理坏数据，避免反复抛错
- 写入时 try/catch 捕获 `QuotaExceededError`，业务层不崩
- 单条记录上限 50，超出滚动淘汰最旧的

### 4.6 响应式适配

`src/assets/styles/tokens.css` 用 CSS 变量做断点切换：

| 设备 | 断点 | 卡牌尺寸 | 行为 |
|---|---|---|---|
| 手机 | ≤ 640px | 132×211 | 隐藏品牌副标题、动效保留 |
| 平板 / 普通 PC | 默认 | 180×288 | 完整布局 |

布局上：
- `flex-wrap` + `gap` 保证三牌阵在窄屏自动换行
- `clamp()` 控制 padding / 字号在不同屏幕弹性伸缩
- 不依赖 JS 监听 resize，避免 mismatch

## 五、运行 / 部署步骤

### 本地

```bash
npm install
npm run dev
# 浏览器访问 http://localhost:5173
```

### 构建

```bash
npm run build      # 输出到 dist/
npm run preview    # 本地预览构建产物
```

### 部署

#### Vercel（推荐）
1. 把仓库推到 GitHub
2. Vercel 导入仓库，框架选择 `Vite`
3. 构建命令 `npm run build`、输出目录 `dist`
4. 路由用了 hash 模式，不需要额外 rewrite

#### Netlify / Cloudflare Pages
同上，零配置。

#### 自托管 nginx
```nginx
location / {
  root /path/to/dist;
  try_files $uri $uri/ /index.html;
}
```

## 六、自我评估

### 满足项
- 题目硬性要求的功能、技术栈、交付物全部覆盖
- 抽牌全流程动效（洗牌等待 → 发牌入场错位 → 3D 翻面 → 牌意揭晓）一气呵成
- 单文件最长不超过 300 行，组件拆分得比较克制
- 历史记录、防抖、异常提示、响应式都做了
- 接口层做了完整 axios 封装与错误归一化，未来切真实后端零改造

### 取舍 / 不足
- 没有写单元测试。24 小时内取舍掉了，但 `utils/shuffle.ts`、`composables/useDebounce.ts` 是非常容易加 Vitest 的目标
- 卡面没有用真实塔罗牌图，是用 SVG 自绘 + 渐变 + 关键字组合表达"质感"，避免版权和资源体积。视觉上偏抽象但保持统一风格
- 78 张牌的释义是精简版，工程量上不可能在交付时间窗口里写出 78 段博士级牌意
- 没做 PWA / i18n。本次范围内是过度设计

### 复盘
- 翻牌动画的缓动反复试了 4 版才定。最初用 `ease-out` 太"软"，改 `cubic-bezier(.4,.2,.2,1)` 后干净利落
- 抽牌按钮防抖没有立刻接 `leading: true`，导致连点像没响应，后来改 leading 后体感才正常
- 移动端窄屏下，原先 gap 太大三张牌挤变形，最后改成媒体查询 + flex-wrap 才稳

## 七、附：关键路径示例

### 用户从首页"单张抽牌"到看到牌意

1. 用户点 `RouterLink "/single"`，路由切换 → `SingleDrawView` 加载
2. 视图调用 `useDraw('single')` → 拿到 store 引用与 `onDraw`
3. 用户点「抽一张」→ 防抖（leading）触发 `draw.startDraw('single', 700, 800)`
4. store 阶段切到 `shuffling`，并行发起 `drawCardsRemote(1)` + `wait(700ms)`
5. 都完成后切到 `dealing`，组件给卡牌挂上 `dealing` class，触发 `deal-in` keyframes
6. 800ms 后切到 `revealable`，卡牌变可点击
7. 用户点击卡牌 → `onActivate` → emit('flip') → 视图调 `flip(0)` → store 写入 `flipped[0] = true`
8. CSS 类 `.tarot-card--flipped` 生效，720ms 翻面动画
9. `flipped.every(Boolean)` 为真 → 阶段切到 `revealed`，自动写入 `useHistoryStore().push(...)`
10. 视图通过 `allRevealed` 显示 `CardMeaning` 组件渲染牌意
