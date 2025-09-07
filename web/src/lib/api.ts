export type AskParams = { message: string }

export type AskResponse = {
  intent: 'LIST_UNDER_PRICE' | 'LIST_BY_CATEGORY' | 'CHECK_STOCK' | 'LIST_ALL'
  params: { category: string | null; maxPrice: number | null }
  rows: Array<{ Name: string; Category?: string; Price?: number; Stock?: number }>
  answer: string
}

export async function askApi(message: string): Promise<AskResponse> {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message } as AskParams)
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
