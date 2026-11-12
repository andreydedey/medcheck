import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { getSymptoms, type Symptom } from '@/lib/api'
import { translateSymptom } from '@/lib/translations'

interface Props {
  onFinish: (selected: string[]) => void
}

export function Questionnaire({ onFinish }: Props) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSymptoms().then((data) => {
      const sorted = [...data].sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name))
      setSymptoms(sorted)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return symptoms
    return symptoms.filter(
      (s) => translateSymptom(s.name).toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    )
  }, [symptoms, search])

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando sintomas...</p>
      </div>
    )
  }

  const count = selected.size

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <nav className="sticky top-0 z-10 bg-white border-b border-border px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            <span className="font-mono font-semibold text-violet-600">{count}</span>{' '}
            {count === 1 ? 'sintoma selecionado' : 'sintomas selecionados'}
          </span>
          <Button
            onClick={() => onFinish([...selected])}
            disabled={count === 0}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 h-9 font-heading font-semibold text-sm"
          >
            Diagnosticar
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col gap-6 px-8 py-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-foreground">Selecione seus sintomas</h1>
          <p className="text-sm text-muted-foreground">
            Marque todos os sintomas que você está sentindo agora. Os sintomas de maior peso clínico aparecem primeiro.
          </p>
        </div>

        <div className="relative max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar sintoma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <p className="text-muted-foreground text-sm">
              Nenhum sintoma encontrado para <span className="font-medium">"{search}"</span>
            </p>
            <button onClick={() => setSearch('')} className="text-sm text-violet-600 hover:underline">
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((s) => {
              const isSelected = selected.has(s.name)
              return (
                <button
                  key={s.name}
                  onClick={() => toggle(s.name)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-border bg-white text-foreground hover:border-violet-300'
                  }`}
                >
                  <div
                    className={`mt-0.5 size-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-white bg-white' : 'border-current opacity-40'
                    }`}
                  >
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium leading-snug">{translateSymptom(s.name)}</span>
                    <span className={`text-xs font-mono ${isSelected ? 'text-violet-200' : 'text-muted-foreground/50'}`}>
                      peso {s.weight}/7
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
