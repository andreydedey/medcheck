import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logo'
import type { Disease } from '@/lib/api'
import { translateSymptom, translateDisease } from '@/lib/translations'

interface Props {
  results: Disease[]
  onReset: () => void
}

export function Result({ results, onReset }: Props) {
  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Não foi possível chegar a um diagnóstico com os sintomas informados.</p>
        <Button onClick={onReset} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full">Nova Consulta</Button>
      </div>
    )
  }

  const primary = results[0]
  const others = results.slice(1)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <nav className="bg-white border-b border-border px-6 h-16 flex items-center justify-between">
        <Logo />
        <Button onClick={onReset} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-9 px-5 font-heading font-semibold text-sm">
          Nova Consulta
        </Button>
      </nav>

      <main className="flex-1 flex gap-10 px-16 py-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6 w-[640px]">
          <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground/60">Diagnóstico provável</span>
                <h1 className="text-4xl font-bold font-heading text-foreground">{translateDisease(primary.name)}</h1>
              </div>
              <div className="bg-violet-600 rounded-xl px-5 py-3 flex flex-col items-center">
                <span className="text-2xl font-bold font-mono text-white">{primary.confidence}%</span>
                <span className="text-xs text-violet-200">confiança</span>
              </div>
            </div>

            {primary.symptoms.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sintomas que levaram ao diagnóstico</span>
                <div className="flex flex-wrap gap-2">
                  {primary.symptoms.map((s) => (
                    <Badge key={s} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                      {translateSymptom(s)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-border" />

            {primary.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{primary.description}</p>
            )}
          </div>

          {primary.precautions.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-sky-100 text-sky-700 text-xs font-mono font-semibold px-2.5 py-1 rounded-full">MedlinePlus</span>
                <p className="text-sm font-semibold font-heading text-foreground">Precauções recomendadas</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {primary.precautions.map((p) => (
                  <div key={p} className="bg-neutral-50 rounded-lg px-4 py-3 flex flex-col gap-1">
                    <p className="text-sm text-foreground">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 flex-1">
          {others.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
              <p className="text-sm font-semibold font-heading text-foreground">Outros diagnósticos possíveis</p>
              {others.map((d) => (
                <div key={d.name} className="flex items-center justify-between bg-neutral-50 rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{translateDisease(d.name)}</span>
                  <span className="text-sm font-mono text-muted-foreground">{d.confidence}%</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-amber-50 rounded-2xl p-5 flex flex-col gap-2">
            <p className="text-sm font-semibold font-heading text-amber-800">⚠ Aviso importante</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              Este diagnóstico é gerado por um sistema especialista com fins educativos. Consulte sempre um profissional de saúde.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
            <p className="text-sm font-semibold font-heading text-foreground">Base de conhecimento</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono text-xs">41 doenças</Badge>
              <Badge variant="secondary" className="font-mono text-xs">131 sintomas</Badge>
              <Badge variant="secondary" className="font-mono text-xs">Dataset Kaggle</Badge>
              <Badge variant="secondary" className="font-mono text-xs">SWI-Prolog 10</Badge>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
