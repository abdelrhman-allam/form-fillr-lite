import Head from 'next/head'
import { useEffect, useState } from 'react'
import { generateFakeUsers } from '../utils/generateData'
import { toCSV } from '../utils/toCSV'

type FieldKey =
  | 'id' | 'name' | 'firstName' | 'lastName' | 'email' | 'phone'
  | 'username' | 'company' | 'jobTitle' | 'address' | 'city' | 'state'
  | 'zip' | 'country' | 'dob' | 'avatar'

const DEFAULT_FIELDS: FieldKey[] = ['id','name','email','phone','address']

export default function Home() {
  const [count, setCount] = useState<number>(25)
  const [locale, setLocale] = useState<string>('en')
  const [fields, setFields] = useState<FieldKey[]>(DEFAULT_FIELDS)
  const [format, setFormat] = useState<'json'|'csv'>('json')
  const [data, setData] = useState<Record<string, any>[]>([])
  const [previewRows, setPreviewRows] = useState<number>(6)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // initial generation
    handleGenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <title>FormFillr — Generate fake user data (client-side)</title>
        <meta name="description" content="Generate realistic fake user data (names, emails, addresses) for testing. Client-side only — your data never leaves your device." />
      </Head>

      <main className="max-w-4xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">FormFillr</h1>
            <p className="text-sm text-gray-600">Generate realistic fake user data — instantly, privately.</p>
          </div>
          <div className="text-sm text-gray-500">Client-side • No server</div>
        </header>

        <section className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-700">Count</label>
              <input
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="mt-1 block w-full border rounded p-2"
              />
              <p className="text-xs text-gray-500 mt-1">Max 500</p>
            </div>

            <div>
              <label className="text-sm text-gray-700">Locale</label>
              <select value={locale} onChange={e=>setLocale(e.target.value)} className="mt-1 block w-full border rounded p-2">
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
              <label className="text-sm text-gray-700">Format</label>
              <select value={format} onChange={e=>setFormat(e.target.value as any)} className="mt-1 block w-full border rounded p-2">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-gray-700">Fields</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'id','name','firstName','lastName','email','phone','username','company','jobTitle','address','city','state','zip','country','dob','avatar'
              ].map((f) => {
                const key = f as FieldKey
                return (
                  <label key={f} className="inline-flex items-center gap-2 bg-slate-50 px-3 py-2 rounded">
                    <input type="checkbox" checked={fields.includes(key)} onChange={()=>toggleField(key)} />
                    <span className="text-sm">{f}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handleGenerate} className="bg-brand-500 text-white px-4 py-2 rounded shadow">
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button onClick={copyToClipboard} className="border px-3 py-2 rounded">Copy</button>
            <button onClick={download} className="border px-3 py-2 rounded">Download</button>
            <div className="ml-auto text-sm text-gray-500 self-center">Preview rows:
              <input value={previewRows} onChange={(e)=>setPreviewRows(Number(e.target.value))} type="number" min={1} max={50} className="ml-2 w-16 border rounded p-1 inline-block" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Privacy: Everything runs in your browser. No data is uploaded.</p>
        </section>

        <section className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-medium mb-3">Preview</h2>
          {!data.length ? (
            <div className="text-sm text-gray-500">No preview — click Generate.</div>
          ) : (
            <>
              <div className="overflow-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left">
                      {fields.map(f => <th key={f} className="p-2 border-b text-xs text-gray-600">{f}</th>)}
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
