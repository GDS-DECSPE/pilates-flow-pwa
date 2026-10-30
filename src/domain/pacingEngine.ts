import { SequenceItem, BlockCategory } from '../types/pilates';

export interface SequencePacingSummary {
  totalSeconds: number;
  totalMinutesFormatted: string;
  targetMinutes: number;
  isOverTime: boolean;
  categoryBreakdown: Record<BlockCategory, number>; // Segundos por bloque
}

export function calculateSequencePacing(items: SequenceItem[], targetMinutes: number): SequencePacingSummary {
  const totalSeconds = items.reduce((sum, item) => sum + item.durationSeconds, 0);
  const targetSeconds = targetMinutes * 60;
  
  const categoryBreakdown: Record<BlockCategory, number> = {
    'Warmup/Integration': 0,
    'Core/Footwork': 0,
    'Abdominals': 0,
    'Spinal Articulation': 0,
    'Lateral/Extension': 0,
    'Cool_down': 0
  };

  items.forEach(item => {
    const cat = item.exercise.blockCategory;
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + item.durationSeconds;
  });

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const totalMinutesFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return {
    totalSeconds,
    totalMinutesFormatted,
    targetMinutes,
    isOverTime: totalSeconds > targetSeconds,
    categoryBreakdown
  };
}