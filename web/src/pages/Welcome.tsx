import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { ModalComoFunciona } from '@/components/ModalComoFunciona'
import { MODOS, type Modo } from '@/lib/modos'

interface Props {
  onIniciar: (modo: Modo) => void
}

export function Welcome({ onIniciar }: Props) {
  const [modo, setModo] = useState<Modo>('padrao')
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <nav className="bg-white border-b border-border px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-8">
          {['Início', 'Como funciona', 'Sobre'].map((l) => (
            <button
              key={l}
              onClick={l === 'Como funciona' ? () => setModalOpen(true) : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="bg-violet-100 text-violet-700 text-xs font-medium px-4 py-1.5 rounded-full">
          Sistema Especialista com Prolog + Dataset Kaggle
        </div>

        <div className="flex flex-col items-center gap-4 max-w-2xl text-center">
          <h1 className="text-5xl font-bold font-heading text-foreground leading-tight">
            Descubra o que pode<br />estar te afetando
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Responda perguntas simples sobre seus sintomas e receba um diagnóstico preliminar baseado em inferência lógica. Sempre consulte um médico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Escolha a precisão:</span>
          {(Object.entries(MODOS) as [Modo, typeof MODOS[Modo]][]).map(([key, m]) => (
            <button
              key={key}
              onClick={() => setModo(key)}
              className={`flex flex-col items-center gap-0.5 px-5 py-3 rounded-xl border-2 transition-all ${
                modo === key
                  ? 'border-violet-600 bg-violet-600 text-white'
                  : 'border-border bg-white text-foreground hover:border-violet-300'
              }`}
            >
              <span className="text-sm font-semibold font-heading">{m.label}</span>
              <span className={`text-xs ${modo === key ? 'text-violet-200' : 'text-muted-foreground'}`}>{m.perguntas} perguntas</span>
              <span className={`text-xs font-mono ${modo === key ? 'text-violet-300' : 'text-muted-foreground/60'}`}>{m.tempo}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => onIniciar(modo)}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-7 h-11 font-heading font-semibold"
          >
            Iniciar Diagnóstico
          </Button>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(true)}
            className="rounded-full px-7 h-11 font-heading"
          >
            Como funciona?
          </Button>
        </div>

        <div className="flex items-center gap-3 mt-2">
          {[['41', 'doenças analisadas'], ['131', 'sintomas avaliados'], ['Kaggle', 'dataset público']].map(([v, l]) => (
            <div key={v} className="bg-white border border-border rounded-2xl px-6 py-4 flex flex-col items-center gap-1">
              <span className="text-xl font-bold font-heading text-foreground">{v}</span>
              <span className="text-xs text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </main>

      <ModalComoFunciona open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
