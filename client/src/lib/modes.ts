export type Mode = 'quick' | 'standard' | 'complete'

export const MODES = {
  quick:    { label: 'Quick',    questions: 20,  time: '~2 min' },
  standard: { label: 'Standard', questions: 60,  time: '~5 min' },
  complete: { label: 'Complete', questions: 120, time: '~10 min' },
} as const
