export type Arcana = 'major' | 'minor'

export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

/** 牌阵类型，未来要加凯尔特十字也直接扩这里 */
export type SpreadKind = 'single' | 'three'

export type Orientation = 'upright' | 'reversed'

export interface TarotCard {
  id: string
  arcana: Arcana
  /** 大阿卡纳 0–21；小阿卡纳为 1–14（含宫廷牌） */
  number: number
  name: string
  nameEn: string
  suit?: Suit
  /** 关键词 3 个以内，列表展示用 */
  keywords: string[]
  uprightMeaning: string
  reversedMeaning: string
}

export interface DrawnCard {
  card: TarotCard
  orientation: Orientation
  /** 三牌阵中的位置：past / present / future；单抽时为 'single' */
  position: 'single' | 'past' | 'present' | 'future'
}

export interface DrawRecord {
  id: string
  spread: SpreadKind
  drawn: DrawnCard[]
  /** ISO 时间戳 */
  drawnAt: string
}
