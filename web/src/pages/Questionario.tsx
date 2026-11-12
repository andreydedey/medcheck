import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logo'
import { getSintomas, type Sintoma } from '@/lib/api'
import { MODOS, type Modo } from '@/lib/modos'

interface Resposta { sintoma: string; sim: boolean }

interface Props {
  modo: Modo
  onConcluir: (sintomasPositivos: string[]) => void
}

function formatarSintoma(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Questionario({ modo, onConcluir }: Props) {
  const [sintomas, setSintomas] = useState<Sintoma[]>([])
  const [indice, setIndice] = useState(0)
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [carregando, setCarregando] = useState(true)

  const total = MODOS[modo].perguntas

  useEffect(() => {
    getSintomas().then((data) => {
      const embaralhados = [...data].sort(() => Math.random() - 0.5).slice(0, total)
      setSintomas(embaralhados)
      setCarregando(false)
    })
  }, [total])

  const responder = (sim: boolean) => {
    const atual = sintomas[indice]
    const novaResposta: Resposta = { sintoma: atual.nome, sim }
    const novasRespostas = [...respostas, novaResposta]
    setRespostas(novasRespostas)

    if (indice + 1 >= sintomas.length) {
      onConcluir(novasRespostas.filter((r) => r.sim).map((r) => r.sintoma))
    } else {
      setIndice(indice + 1)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando sintomas...</p>
      </div>
    )
  }

  const progresso = Math.round((indice / sintomas.length) * 100)
  const sintomasPositivos = respostas.filter((r) => r.sim)
  const ultimasRespostas = respostas.slice(-4).reverse()

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <nav className="bg-white border-b border-border px-6 h-16 flex items-center justify-between">
        <Logo />
        <span className="text-sm text-muted-foreground font-mono">
          Passo {indice + 1} de {sintomas.length}
        </span>
      </nav>

      <main className="flex-1 flex gap-10 px-14 py-12 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-7 w-[480px]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span className="text-violet-600 font-mono font-medium">{progresso}%</span>
            </div>
            <Progress value={progresso} className="h-1.5" />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wide">
              Sintoma {indice + 1} de {sintomas.length}
            </span>
            <h2 className="text-3xl font-bold font-heading text-foreground leading-snug">
              Você está sentindo<br />{formatarSintoma(sintomas[indice].nome)}?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Peso deste sintoma: <span className="font-mono text-violet-600">{sintomas[indice].peso}/7</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => responder(true)}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-13 font-heading font-semibold text-base"
            >
              Sim
            </Button>
            <Button
              onClick={() => responder(false)}
              variant="secondary"
              className="flex-1 rounded-xl h-13 font-heading font-semibold text-base"
            >
              Não
            </Button>
          </div>

          {ultimasRespostas.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground/60">Respostas anteriores</span>
              {ultimasRespostas.map((r) => (
                <div key={r.sintoma} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-border">
                  <span className="text-sm text-muted-foreground">{formatarSintoma(r.sintoma)}</span>
                  <Badge variant={r.sim ? 'default' : 'secondary'} className={r.sim ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}>
                    {r.sim ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
            <p className="text-sm font-semibold font-heading text-foreground">Sintomas confirmados</p>
            {sintomasPositivos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum sintoma confirmado ainda.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sintomasPositivos.map((r) => (
                  <Badge key={r.sintoma} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                    {formatarSintoma(r.sintoma)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="bg-violet-50 rounded-2xl p-5 flex flex-col gap-2">
            <p className="text-sm font-semibold font-heading text-violet-700">Dica</p>
            <p className="text-sm text-violet-600 leading-relaxed">
              Quanto mais sintomas você informar, mais preciso será o diagnóstico. Responda com honestidade sobre o que está sentindo agora.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
