export type Equipment = 'Reformer' | 'Mat' | 'Cadillac' | 'Chair' | 'Barrels';
export type Level = 'Essential' | 'Intermediate' | 'Advanced' | 'Master';
export type BlockCategory = 
  | 'Warmup/Integration' 
  | 'Core/Footwork' 
  | 'Abdominals' 
  | 'Spinal Articulation' 
  | 'Lateral/Extension' 
  | 'Cool_down';

export type SpringBrand = 
  | 'balanced_body_allegro_2'
  | 'peak_pilates'
  | 'gratz'
  | 'merrithew_stott'
  | 'elina_pilates';

export interface Exercise {
  id: string;
  title: string;
  equipment: Equipment;
  props: string[];
  level: Level;
  blockCategory: BlockCategory;
  targetMuscles: string[];
  springIntensity: 'Light' | 'Medium' | 'Heavy' | 'Medium_Heavy';
  verbalCues: string[];
  contraindications: string[];
  modifications: Record<string, string>;
  defaultDurationSeconds: number;
}

export interface Student {
  id: string;
  name: string;
  conditions: string[];
  notes?: string;
  isPresent: boolean;
}

export interface SequenceItem {
  instanceId: string;
  exercise: Exercise;
  durationSeconds: number;
  order: number;
  customNote?: string;
}

export interface Sequence {
  id: string;
  title: string;
  targetDurationMinutes: number;
  level: Level;
  equipment: Equipment;
  items: SequenceItem[];
  createdAt: string;
}
