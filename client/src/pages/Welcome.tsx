import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { HowItWorksModal } from '@/components/HowItWorksModal'

interface Props {
  onStart: () => void
}

export function Welcome({ onStart }: Props) {
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

      <main className="flex-1 flex flex-col items-center justify-center gap-10 px-4 py-20">
        <div className="bg-violet-100 text-violet-700 text-sm font-medium px-5 py-2 rounded-full">
          Sistema Especialista com Prolog + Dataset Kaggle
        </div>

        <div className="flex flex-col items-center gap-5 max-w-3xl text-center">
          <h1 className="text-6xl font-bold font-heading text-foreground leading-tight">
            Descubra o que pode<br />estar te afetando
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
            Selecione seus sintomas e receba um diagnóstico preliminar baseado em inferência lógica. Sempre consulte um médico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onStart}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 h-12 font-heading font-semibold text-base"
          >
            Selecionar Sintomas
          </Button>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(true)}
            className="rounded-full px-8 h-12 font-heading text-base"
          >
            Como funciona?
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-2">
          {[['41', 'doenças analisadas'], ['131', 'sintomas avaliados'], ['Kaggle', 'dataset público']].map(([v, l]) => (
            <div key={v} className="bg-white border border-border rounded-2xl px-8 py-5 flex flex-col items-center gap-1.5">
              <span className="text-2xl font-bold font-heading text-foreground">{v}</span>
              <span className="text-sm text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </main>

      <HowItWorksModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
