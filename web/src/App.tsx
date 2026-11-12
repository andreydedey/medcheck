import { useState } from 'react'
import { Welcome } from '@/pages/Welcome'
import { Questionario } from '@/pages/Questionario'
import { Resultado } from '@/pages/Resultado'
import { diagnosticar, type Doenca } from '@/lib/api'
import type { Modo } from '@/lib/modos'

type Tela = 'welcome' | 'questionario' | 'resultado' | 'carregando'

export default function App() {
  const [tela, setTela] = useState<Tela>('welcome')
  const [modo, setModo] = useState<Modo>('padrao')
  const [resultados, setResultados] = useState<Doenca[]>([])

  const handleIniciar = (m: Modo) => {
    setModo(m)
    setTela('questionario')
  }

  const handleConcluir = async (sintomasPositivos: string[]) => {
    setTela('carregando')
    const res = await diagnosticar(sintomasPositivos, 5)
    setResultados(res)
    setTela('resultado')
  }

  const handleNova = () => {
    setResultados([])
    setTela('welcome')
  }

  if (tela === 'carregando') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
        <p className="text-muted-foreground font-heading">Analisando seus sintomas em Prolog...</p>
      </div>
    )
  }

  if (tela === 'questionario') return <Questionario modo={modo} onConcluir={handleConcluir} />
  if (tela === 'resultado') return <Resultado resultados={resultados} onNova={handleNova} />
  return <Welcome onIniciar={handleIniciar} />
}
