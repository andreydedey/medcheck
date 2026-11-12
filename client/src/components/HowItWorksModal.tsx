import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const steps = [
  { num: '1', color: 'bg-violet-600', title: 'Escolha a precisão', desc: 'Selecione entre 20, 60 ou 120 perguntas. Mais perguntas = diagnóstico mais preciso.' },
  { num: '2', color: 'bg-emerald-500', title: 'Responda sobre seus sintomas', desc: 'O sistema pergunta sobre febre, tosse, dor, manchas e outros sintomas. Responda com sim ou não.' },
  { num: '3', color: 'bg-amber-500', title: 'Inferência lógica em Prolog', desc: 'Um motor de inferência escrito em Prolog analisa suas respostas com base em 41 doenças e 131 sintomas reais.' },
  { num: '4', color: 'bg-sky-600', title: 'Resultado com MedlinePlus', desc: 'O diagnóstico traz descrição oficial, precauções e orientações médicas do NIH.' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function HowItWorksModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Como funciona?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 mt-2">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-4 items-start">
              <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {s.num}
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold font-heading text-sm text-foreground">{s.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
          <div className="bg-amber-50 rounded-xl p-4 flex gap-3 items-start">
            <span className="text-amber-700 text-sm">⚠</span>
            <p className="text-sm text-amber-700 leading-relaxed">
              Este sistema é educativo e não substitui consulta médica profissional.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
