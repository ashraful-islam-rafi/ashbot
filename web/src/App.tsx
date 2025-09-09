import { useState } from 'react'
import { askApi } from './lib/api'
import type { AskResponse } from './lib/api'

type Msg = { role: 'user' | 'bot'; text: string }

export default function App() {
  const [history, setHistory] = useState<Msg[]>([
    { role: 'bot', text: 'Hi! Ask about products, stock, or prices (e.g., “Accessories under $50”).' }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setHistory(h => [...h, { role: 'user', text }])
    setInput('')
    setBusy(true)
    try {
      const data: AskResponse = await askApi(text)
      setHistory(h => [...h, { role: 'bot', text: data.answer || 'I have no answer.' }])
    } catch (err) {
      setHistory(h => [...h, { role: 'bot', text: 'Sorry, something went wrong.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display:'flex', flexDirection:'column', alignItems:'center', padding:'24px' }}>
      <div style={{ maxWidth: 720, width: '100%' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          Ashbot: From Databases to AI
        </h1>
        <h2 style={{ fontSize: 16, fontWeight: 400, color: '#555', marginBottom: 12 }}>
          Chatting with Azure SQL, powered by Functions + SWA
        </h2>

        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, minHeight: 300 }}>
          {history.map((m, i) => (
            <div key={i} style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>
              <strong>{m.role === 'user' ? 'You' : 'Bot'}:</strong> {m.text}
            </div>
          ))}
          {busy && <div><em>Thinking…</em></div>}
        </div>
        <form onSubmit={onSend} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Try: "Accessories under $50"'
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <button
            disabled={busy}
            style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff' }}
          >
            Send
          </button>
        </form>
        <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
          Tips: “what is in stock”, “gaming items”, “computers under 1500”
        </p>
      </div>
    </div>
  )
}
