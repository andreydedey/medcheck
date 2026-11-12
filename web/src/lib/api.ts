const API_URL = import.meta.env.VITE_API_URL ?? ''

export interface Sintoma {
  nome: string
  peso: number
}

export interface Doenca {
  nome: string
  confianca: number
  descricao: string
  precaucoes: string[]
  sintomas: string[]
}

export interface ResultadoDiagnostico {
  resultados: Doenca[]
}

export async function getSintomas(): Promise<Sintoma[]> {
  const res = await fetch(`${API_URL}/api/sintomas`)
  const data = await res.json()
  return data.sintomas
}

export async function diagnosticar(
  sintomas: string[],
  limite = 5
): Promise<Doenca[]> {
  const res = await fetch(`${API_URL}/api/diagnosticar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sintomas, limite }),
  })
  const data: ResultadoDiagnostico = await res.json()
  return data.resultados
}
