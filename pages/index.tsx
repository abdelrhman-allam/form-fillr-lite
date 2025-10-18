import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { generateFakeUsers } from '../utils/generateData'
import { toCSV } from '../utils/toCSV'
import { useRouter } from 'next/router'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { getLocaleFromPath, getStrings, applyDirection } from '../I18N'

type FieldKey =
  | 'id' | 'name' | 'firstName' | 'lastName' | 'email' | 'phone'
  | 'username' | 'company' | 'jobTitle' | 'address' | 'city' | 'state'
  | 'zip' | 'country' | 'dob' | 'avatar'

const DEFAULT_FIELDS: FieldKey[] = ['id','name','email','phone','address']

export default function Home() {
  const router = useRouter()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const [count, setCount] = useState<number>(25)
  const [locale, setLocale] = useState<string>('en')
  const [fields, setFields] = useState<FieldKey[]>(DEFAULT_FIELDS)
  const [format, setFormat] = useState<'json'|'csv'>('json')
  const [data, setData] = useState<Record<string, any>[]>([])
  const [previewRows, setPreviewRows] = useState<number>(6)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const l = getLocaleFromPath(window.location.pathname, basePath)
    setLocale(l)
    applyDirection(l)
    // initial generation
    handleGenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const l = getLocaleFromPath(router.asPath, basePath)
    setLocale(l)
    applyDirection(l)
  }, [router.asPath])

  const strings = useMemo(() => getStrings((locale as any) || 'en'), [locale])

  function toggleField(f: FieldKey) {
    setFields(prev => prev.includes(f) ? prev.filter(x=>x!==f) : [...prev, f])
  }

  async function handleGenerate() {
    setLoading(true)
    try {
      const gen = await generateFakeUsers(Math.max(1, Math.min(500, count)), fields, locale)
      setData(gen)
    } catch (e) {
      console.error(e)
      alert('Generation error')
    } finally {
      setLoading(false)
    }
  }

  function download() {
    if (!data.length) return alert('Generate first')
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `formfillr_${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const csv = toCSV(data, fields)
      const blob = new Blob([csv], {type:'text/csv'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `formfillr_${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  async function copyToClipboard() {
    if (!data.length) return alert('Generate first')
    try {
      await navigator.clipboard.writeText(format === 'json' ? JSON.stringify(data, null, 2) : toCSV(data, fields))
      alert('Copied to clipboard')
    } catch {
      alert('Copy failed')
    }
  }

  return (
    
    <div>
      <Head>
        <title>{strings.title}</title>
        <meta name="description" content="Generate realistic fake user data (names, emails, addresses) for testing. Client-side only — your data never leaves your device." />
      </Head>

      <main className="max-w-4xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur rounded-xl p-4 shadow-soft">
          <div>
            <h1 className="text-2xl font-semibold text-brand-700">{strings.title}</h1>
            <p className="text-sm text-gray-600">{strings.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-sm text-gray-500">Client-side • No server</span>
          </div>
        </header>

        <section className="bg-white rounded-xl shadow p-5 mb-6 border border-brand-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-700">{strings.count}</label>
              <input
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <p className="text-xs text-gray-500 mt-1">Max 500</p>
            </div>

            <div>
              <label className="text-sm text-gray-700">{strings.locale}</label>
              <select value={locale} onChange={e=>{ const newLocale = e.target.value; setLocale(newLocale); const pathname = window.location.pathname; const afterBase = basePath ? pathname.replace(new RegExp(`^${basePath}`), "") : pathname; const path = afterBase.replace(/^\/(en|ar)/, ""); router.push(`/${newLocale}${path}`); }} className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand-300">
                <option value="ar">ar (Arabic)</option>
                <option value="en">en (English)</option>
                <option value="es">es (Spanish)</option>
                <option value="fr">fr (French)</option>
                <option value="de">de (German)</option>
                <option value="pt_BR">pt_BR (Portuguese-BR)</option>
                <option value="ja">ja (Japanese)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700">{strings.format}</label>
              <select value={format} onChange={e=>setFormat(e.target.value as any)} className="mt-1 block w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand-300">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-gray-700">{strings.fields}</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'id','name','firstName','lastName','email','phone','username','company','jobTitle','address','city','state','zip','country','dob','avatar'
              ].map((f) => {
                const key = f as FieldKey
                return (
                  <label key={f} className="inline-flex items-center gap-2 bg-slate-50 px-3 py-2 rounded hover:bg-slate-100">
                    <input type="checkbox" checked={fields.includes(key)} onChange={()=>toggleField(key)} />
                    <span className="text-sm">{f}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handleGenerate} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded shadow">
              {loading ? 'Generating...' : strings.generate}
            </button>
            <button onClick={copyToClipboard} className="border px-3 py-2 rounded hover:bg-slate-50">{strings.copy}</button>
            <button onClick={download} className="border px-3 py-2 rounded hover:bg-slate-50">{strings.download}</button>
            <div className="ml-auto text-sm text-gray-500 self-center">Preview rows:
              <input value={previewRows} onChange={(e)=>setPreviewRows(Number(e.target.value))} type="number" min={1} max={50} className="ml-2 w-16 border rounded p-1 inline-block" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Privacy: Everything runs in your browser. No data is uploaded.</p>
        </section>

        <section className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-medium mb-3 text-brand-700">Preview</h2>
          {!data.length ? (
            <div className="text-sm text-gray-500">No preview — click Generate.</div>
          ) : (
            <>
              <div className="overflow-auto rounded border border-slate-200">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left rtl:text-right bg-slate-50">
                      {fields.map(f => <th key={f} className="p-2 border-b text-xs text-gray-700 font-medium">{f}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, previewRows).map((row, idx) => (
                      <tr key={idx} className="align-top">
                        {fields.map(f => <td key={f} className="p-2 align-top border-b text-sm">{String(row[f] ?? '')}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <details>
                  <summary className="cursor-pointer text-sm text-gray-600">Show raw {format.toUpperCase()}</summary>
                  <pre className="mt-2 max-h-64 overflow-auto bg-slate-900 text-slate-100 p-3 rounded text-xs">
                    {format === 'json' ? JSON.stringify(data, null, 2) : toCSV(data, fields)}
                  </pre>
                </details>
              </div>
            </>
          )}
        </section>

        <footer className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} FormFillr — Client-side fake data generator. Great for dev, QA, and demos.
        </footer>
      </main>
    </div>
  )
}
