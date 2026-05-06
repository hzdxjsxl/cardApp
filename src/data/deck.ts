import type { TarotCard } from '@/types/tarot'
import { majorArcana } from './major-arcana'
import { minorArcana } from './minor-arcana'

export const fullDeck: TarotCard[] = [...majorArcana, ...minorArcana]

/** 78 张完整韦特塔罗 */
export const TOTAL_CARDS = fullDeck.length
