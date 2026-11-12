export type Modo = 'rapido' | 'padrao' | 'completo'

export const MODOS = {
  rapido:   { label: 'Rápido',   perguntas: 20,  tempo: '~2 min' },
  padrao:   { label: 'Padrão',   perguntas: 60,  tempo: '~5 min' },
  completo: { label: 'Completo', perguntas: 120, tempo: '~10 min' },
} as const
