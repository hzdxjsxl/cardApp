import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { SpreadKind } from '@/types/tarot'
import { useDrawStore } from '@/stores/draw'
import { useToast } from './useToast'
import { useDebounce } from './useDebounce'

const SHUFFLE_MS = 700
const DEAL_MS = 800
const DEBOUNCE_MS = 350

/**
 * 把抽牌逻辑（按钮防抖、加载提示、错误归一化）从视图里抽出来，
 * 单抽和三牌阵共用，保持视图层只描述「样子」。
 */
export function useDraw(spread: SpreadKind) {
  const draw = useDrawStore()
  const toast = useToast()
  const refs = storeToRefs(draw)

  const phaseTip = computed(() => {
    switch (refs.phase.value) {
      case 'shuffling':
        return '正在洗牌…'
      case 'dealing':
        return '发牌中…'
      case 'revealable':
        return '点击卡牌翻面'
      case 'revealed':
        return '已揭晓'
      default:
        return ''
    }
  })

  async function performDraw() {
    if (draw.isBusy) return
    try {
      await draw.startDraw(spread, SHUFFLE_MS, DEAL_MS)
    } catch (e) {
      const msg = (e as { message?: string })?.message ?? '抽牌失败'
      toast.error(msg)
    }
  }

  const [onDraw] = useDebounce(performDraw, DEBOUNCE_MS, { leading: true })

  function flip(i: number) {
    draw.flip(i)
  }

  function flipAll() {
    draw.flipAll()
  }

  function reset() {
    draw.reset()
  }

  return {
    spread,
    phase: refs.phase,
    drawn: refs.drawn,
    flipped: refs.flipped,
    isBusy: computed(() => draw.isBusy),
    canInteract: computed(
      () => refs.phase.value === 'revealable' || refs.phase.value === 'revealed',
    ),
    isDealing: computed(() => refs.phase.value === 'dealing'),
    allRevealed: computed(() => draw.allRevealed),
    phaseTip,
    onDraw,
    flip,
    flipAll,
    reset,
  }
}
