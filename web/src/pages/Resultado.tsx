import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/Logo'
import type { Doenca } from '@/lib/api'

interface Props {
  resultados: Doenca[]
  onNova: () => void
}

function formatarNome(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Resultado({ resultados, onNova }: Props) {
  if (resultados.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Não foi possível chegar a um diagnóstico com os sintomas informados.</p>
        <Button onClick={onNova} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full">Nova Consulta</Button>
      </div>
    )
  }

  const principal = resultados[0]
  const outros = resultados.slice(1)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <nav className="bg-white border-b border-border px-6 h-16 flex items-center justify-between">
        <Logo />
        <Button onClick={onNova} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-9 px-5 font-heading font-semibold text-sm">
          Nova Consulta
        </Button>
      </nav>

      <main className="flex-1 flex gap-8 px-12 py-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-5 w-[560px]">
          <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground/60">Diagnóstico provável</span>
                <h1 className="text-4xl font-bold font-heading text-foreground">{formatarNome(principal.nome)}</h1>
              </div>
              <div className="bg-violet-600 rounded-xl px-5 py-3 flex flex-col items-center">
                <span className="text-2xl font-bold font-mono text-white">{principal.confianca}%</span>
                <span className="text-xs text-violet-200">confiança</span>
              </div>
            </div>

            {principal.sintomas.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sintomas que levaram ao diagnóstico</span>
                <div className="flex flex-wrap gap-2">
                  {principal.sintomas.map((s) => (
                    <Badge key={s} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                      {formatarNome(s)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-border" />

            {principal.descricao && (
              <p className="text-sm text-muted-foreground leading-relaxed">{principal.descricao}</p>
            )}
          </div>

          {principal.precaucoes.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-sky-100 text-sky-700 text-xs font-mono font-semibold px-2.5 py-1 rounded-full">MedlinePlus</span>
                <p className="text-sm font-semibold font-heading text-foreground">Precauções recomendadas</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {principal.precaucoes.map((p) => (
                  <div key={p} className="bg-neutral-50 rounded-lg px-4 py-3 flex flex-col gap-1">
                    <p className="text-sm text-foreground">{formatarNome(p)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 flex-1">
          {outros.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
              <p className="text-sm font-semibold font-heading text-foreground">Outros diagnósticos possíveis</p>
              {outros.map((d) => (
                <div key={d.nome} className="flex items-center justify-between bg-neutral-50 rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{formatarNome(d.nome)}</span>
                  <span className="text-sm font-mono text-muted-foreground">{d.confianca}%</span>
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
