const API_URL = import.meta.env.VITE_API_URL ?? ''

export interface Symptom {
  name: string
  weight: number
}

export interface Disease {
  name: string
  confidence: number
  description: string
  precautions: string[]
  symptoms: string[]
}

export async function getSymptoms(): Promise<Symptom[]> {
  const res = await fetch(`${API_URL}/api/symptoms`)
  const data = await res.json()
  return data.symptoms
}

export async function diagnose(symptoms: string[], limit = 5): Promise<Disease[]> {
  const res = await fetch(`${API_URL}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms, limit }),
  })
  const data = await res.json()
  return data.results
}
