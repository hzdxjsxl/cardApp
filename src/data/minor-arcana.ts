import type { Suit, TarotCard } from '@/types/tarot'

// 56 张小阿卡纳。1–10 为数字牌，11–14 为宫廷牌（侍从 / 骑士 / 皇后 / 国王）
// 关键词与释义来源于韦特体系基础对应，做了精简，方便在卡面快速阅读。

const suits: { suit: Suit; cn: string; element: string; theme: string }[] = [
  { suit: 'wands', cn: '权杖', element: '火', theme: '行动 / 激情 / 创造' },
  { suit: 'cups', cn: '圣杯', element: '水', theme: '情感 / 关系 / 直觉' },
  { suit: 'swords', cn: '宝剑', element: '风', theme: '思维 / 冲突 / 真相' },
  { suit: 'pentacles', cn: '星币', element: '土', theme: '物质 / 工作 / 务实' },
]

const numberTitles: Record<number, { title: string; up: string; rev: string }> = {
  1: { title: 'Ace', up: '萌芽与种子，新的开始', rev: '能量受阻，时机未到' },
  2: { title: 'Two', up: '抉择与平衡', rev: '失衡或拖延' },
  3: { title: 'Three', up: '初步成果', rev: '协作受挫' },
  4: { title: 'Four', up: '稳定与休整', rev: '停滞或保守过头' },
  5: { title: 'Five', up: '冲突与挑战', rev: '冲突缓解或仍在消耗' },
  6: { title: 'Six', up: '回报与和谐', rev: '回报推迟或表面和谐' },
  7: { title: 'Seven', up: '权衡与坚持', rev: '动摇或自欺' },
  8: { title: 'Eight', up: '专注与深耕', rev: '失焦或过度劳累' },
  9: { title: 'Nine', up: '接近完成', rev: '接近终点反而焦虑' },
  10: { title: 'Ten', up: '圆满或重负', rev: '阶段终结，需要交接' },
}

const courtTitles: Record<number, { title: string; up: string; rev: string }> = {
  11: { title: 'Page', up: '学习者的好奇与初探', rev: '幼稚或缺乏经验' },
  12: { title: 'Knight', up: '冲劲十足，使命必达', rev: '鲁莽或失控' },
  13: { title: 'Queen', up: '内化与照护', rev: '情绪化或过度干预' },
  14: { title: 'King', up: '掌控与成熟', rev: '专断或冷漠' },
}

const suitFlavor: Record<Suit, { up: string; rev: string }> = {
  wands: { up: '把火点起来。', rev: '火焰摇摆。' },
  cups: { up: '让情感流动。', rev: '水面起涟漪。' },
  swords: { up: '思路要锋利。', rev: '念头割伤自己。' },
  pentacles: { up: '把根扎稳。', rev: '土层松动。' },
}

function buildCard(suit: Suit, suitCn: string, num: number): TarotCard {
  const meta = num <= 10 ? numberTitles[num] : courtTitles[num]
  if (!meta) {
    throw new Error(`tarot number ${num} 没有定义元信息`)
  }
  const flavor = suitFlavor[suit]
  return {
    id: `minor-${suit}-${num}`,
    arcana: 'minor',
    number: num,
    name: `${suitCn} ${num <= 10 ? num : meta.title}`,
    nameEn: `${meta.title} of ${suit.charAt(0).toUpperCase()}${suit.slice(1)}`,
    suit,
    keywords: [meta.title, suitCn, num <= 10 ? '数字牌' : '宫廷牌'],
    uprightMeaning: `${meta.up}。${flavor.up}`,
    reversedMeaning: `${meta.rev}。${flavor.rev}`,
  }
}

export const minorArcana: TarotCard[] = suits.flatMap((s) => {
  const cards: TarotCard[] = []
  for (let n = 1; n <= 14; n += 1) {
    cards.push(buildCard(s.suit, s.cn, n))
  }
  return cards
})
