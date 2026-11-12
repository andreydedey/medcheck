import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logo'
import { getSymptoms, type Symptom } from '@/lib/api'
import { MODES, type Mode } from '@/lib/modes'

interface Answer { symptom: string; yes: boolean }

interface Props {
  mode: Mode
  onFinish: (positiveSymptoms: string[]) => void
}

function formatSymptom(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Questionnaire({ mode, onFinish }: Props) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)

  const total = MODES[mode].questions

  useEffect(() => {
    getSymptoms().then((data) => {
      const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, total)
      setSymptoms(shuffled)
      setLoading(false)
    })
  }, [total])

  const respond = (yes: boolean) => {
    const current = symptoms[index]
    const newAnswer: Answer = { symptom: current.name, yes }
    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    if (index + 1 >= symptoms.length) {
      onFinish(newAnswers.filter((a) => a.yes).map((a) => a.symptom))
    } else {
      setIndex(index + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando sintomas...</p>
      </div>
    )
  }

  const progress = Math.round((index / symptoms.length) * 100)
  const positiveSymptoms = answers.filter((a) => a.yes)
  const recentAnswers = answers.slice(-4).reverse()

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <nav className="bg-white border-b border-border px-6 h-16 flex items-center justify-between">
        <Logo />
        <span className="text-sm text-muted-foreground font-mono">
          Passo {index + 1} de {symptoms.length}
        </span>
      </nav>

      <main className="flex-1 flex gap-12 px-16 py-14 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-8 w-[560px]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span className="text-violet-600 font-mono font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wide">
              Sintoma {index + 1} de {symptoms.length}
            </span>
            <h2 className="text-4xl font-bold font-heading text-foreground leading-snug">
              Você está sentindo<br />{formatSymptom(symptoms[index].name)}?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Peso deste sintoma: <span className="font-mono text-violet-600">{symptoms[index].weight}/7</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => respond(true)}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-13 font-heading font-semibold text-base"
            >
              Sim
            </Button>
            <Button
              onClick={() => respond(false)}
              variant="secondary"
              className="flex-1 rounded-xl h-13 font-heading font-semibold text-base"
            >
              Não
            </Button>
          </div>

          {recentAnswers.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground/60">Respostas anteriores</span>
              {recentAnswers.map((a) => (
                <div key={a.symptom} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-border">
                  <span className="text-sm text-muted-foreground">{formatSymptom(a.symptom)}</span>
                  <Badge variant={a.yes ? 'default' : 'secondary'} className={a.yes ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}>
                    {a.yes ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
            <p className="text-sm font-semibold font-heading text-foreground">Sintomas confirmados</p>
            {positiveSymptoms.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum sintoma confirmado ainda.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {positiveSymptoms.map((a) => (
                  <Badge key={a.symptom} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                    {formatSymptom(a.symptom)}
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
