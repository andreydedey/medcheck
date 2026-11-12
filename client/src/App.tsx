import { useState } from 'react'
import { Welcome } from '@/pages/Welcome'
import { Questionnaire } from '@/pages/Questionnaire'
import { Result } from '@/pages/Result'
import { diagnose, type Disease } from '@/lib/api'
import type { Mode } from '@/lib/modes'

type Screen = 'welcome' | 'questionnaire' | 'result' | 'loading'

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [mode, setMode] = useState<Mode>('standard')
  const [results, setResults] = useState<Disease[]>([])

  const handleStart = (m: Mode) => {
    setMode(m)
    setScreen('questionnaire')
  }

  const handleFinish = async (positiveSymptoms: string[]) => {
    setScreen('loading')
    const res = await diagnose(positiveSymptoms, 5)
    setResults(res)
    setScreen('result')
  }

  const handleReset = () => {
    setResults([])
    setScreen('welcome')
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
        <p className="text-muted-foreground font-heading">Analisando seus sintomas em Prolog...</p>
      </div>
    )
  }

  if (screen === 'questionnaire') return <Questionnaire mode={mode} onFinish={handleFinish} />
  if (screen === 'result') return <Result results={results} onReset={handleReset} />
  return <Welcome onStart={handleStart} />
}
