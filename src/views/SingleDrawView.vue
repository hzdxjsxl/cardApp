<script setup lang="ts">
import { onBeforeUnmount,ref } from 'vue'
import DrawStage from '@/components/card/DrawStage.vue'
import CardMeaning from '@/components/card/CardMeaning.vue'
import LoadingMask from '@/components/feedback/LoadingMask.vue'
import { useDraw } from '@/composables/useDraw'
import AuthModal from '@/components/common/loginModel.vue'
import {useUserStore} from '@/stores/user.ts'
import { analyzeStreamApi } from '@/api/ai/index.ts'
import TarotSideAnalyzer from '@/components/common/TarotSideAnalyzer.vue'
const userStote = useUserStore();
// 控制侧边栏显示
const showAnalyzer = ref(false)
// 传入的流式文本
const aiResponseText = ref('')
// 是否正在请求大模型中
const isLoadingAI = ref(false)
const showAuth = ref(false)

const handleAuthSuccess = async () => {
  showAuth.value = false
  showAnalyzer.value = true
  aiResponseText.value = ''
  isLoadingAI.value = true

  try {
    const payload = {
      cards: drawn.value.map((c) => ({
        name: c.card.name,
        position: c.position,
        label: ''
      }))
    }

    // 调用 API 获取流对象[cite: 4]
    const stream = await analyzeStreamApi(payload)
    console.log('stream',stream)
    const reader = stream.getReader()
    console.log('reader',reader)
    const decoder = new TextDecoder('utf-8')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      // SSE 协议数据按行分割
      const lines = chunk.split('\n')

      for (const line of lines) {
        const trimmedLine = line.trim();
        try {
          const dataObj = JSON.parse(trimmedLine);
          // 严格按照你提供的结构取值：choices -> [0] -> delta -> content
          // 使用可选链 ?. 防止某一个 chunk 缺少 choices 导致页面崩溃，确保高可用
          const content = dataObj.choices?.[0]?.delta?.content || "";

          if (content) {
            // 实时追加到响应式变量，右侧组件会自动显示
            aiResponseText.value += content;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // 忽略因为 chunk 截断导致的 JSON 解析错误，等待下一个 chunk 补全即可
          console.warn("解析碎片中...");
        }
      }
    }
  } catch (error) {
    console.error("AI解析异常:", error)
    aiResponseText.value = "星象连接异常，请检查网络。"
  } finally {
    isLoadingAI.value = false
  }
}
const authMo = ref<{ reloadForm: () => void } | null>(null)
const opModal=()=>{
  showAuth.value = true
  authMo.value?.reloadForm()
}
const {
  drawn,
  flipped,
  isBusy,
  canInteract,
  isDealing,
  allRevealed,
  phaseTip,
  onDraw,
  flip,
  reset,
} = useDraw('single')
onBeforeUnmount(reset)
</script>

<template>
  <section class="single">
    <AuthModal ref="authMo" v-model:visible="showAuth" @success="handleAuthSuccess" />
    <header class="single__header">
      <h2>单张抽牌</h2>
      <p>当下最直接的提示。点「抽一张」开始。</p>
    </header>

    <DrawStage
      spread="single"
      :drawn="drawn"
      :flipped="flipped"
      :dealing="isDealing"
      :interactive="canInteract"
      @flip="flip"
    />

    <p class="single__phase" aria-live="polite">{{ phaseTip }}</p>

    <div class="single__actions">
      <button class="btn" :disabled="isBusy" @click="onDraw">
        {{ drawn.length === 0 ? '抽一张' : '再抽一张' }}
      </button>
      <button v-if="drawn.length" class="btn btn--ghost" :disabled="isBusy" @click="reset">
        清空牌面
      </button>
      <button v-if="allRevealed && drawn[0] && !userStote.token" class="btn btn--ghost" :disabled="isBusy" @click="opModal">
        登录查看解读
      </button>
      <button v-if="allRevealed && drawn[0] && userStote.token" class="btn btn--ghost" :disabled="isBusy" @click="handleAuthSuccess">
        高维能量解读
      </button>
    </div>

    <transition name="fade">
      <div v-if="allRevealed && drawn[0]" class="single__meaning">
        <CardMeaning :drawn="drawn[0]" />
      </div>
    </transition>

    <LoadingMask :visible="isBusy" tip="星象正在排列…" />
    <TarotSideAnalyzer
      :visible="showAnalyzer"
      :text="aiResponseText"
      :is-analyzing="isLoadingAI"
      @close="showAnalyzer = false"
    />
  </section>
</template>

<style scoped>
.single {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.single__header {
  text-align: center;
  margin-bottom: 8px;
}

.single__header h2 {
  font-size: var(--fz-2xl);
  letter-spacing: 4px;
}

.single__header p {
  margin: 6px 0 0;
  color: var(--color-text-dim);
}

.single__phase {
  min-height: 22px;
  font-size: var(--fz-sm);
  color: var(--color-gold-soft);
  letter-spacing: 2px;
  margin: 0;
}

.single__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.single__meaning {
  width: 100%;
  max-width: 560px;
  margin-top: 12px;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-enter-active {
  transition: opacity var(--dur-base), transform var(--dur-base);
}
</style>
