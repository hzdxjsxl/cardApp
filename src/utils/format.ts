const pad = (n: number) => n.toString().padStart(2, '0')

/** 把 ISO 字符串格式化为 YYYY-MM-DD HH:mm，本地时区 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
