export function toCSV(data: Record<string, any>[], fields: string[]) {
  if (!data || !data.length) return ''
  const esc = (v: any) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }
  const header = fields.join(',')
  const rows = data.map(r => fields.map(f => esc(r[f])).join(','))
  return [header, ...rows].join('\n')
}
