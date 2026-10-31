import { Student } from '../types/pilates';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_001',
    name: 'María López',
    conditions: ['Hernia_Cervical'],
    notes: 'Evitar flexiones cervicales forzadas; usar apoyo bajo la cabeza.',
    isPresent: true
  },
  {
    id: 'std_002',
    name: 'Carla Gómez',
    conditions: ['Osteoporosis'],
    notes: 'Contraindicada flexión espinal con carga. Mantener columna neutra.',
    isPresent: false
  },
  {
    id: 'std_003',
    name: 'Elena Rossi',
    conditions: ['Pregnancy_T2_T3'],
    notes: 'Usar cuña postural (Wedge) en decúbito supino.',
    isPresent: true
  }
];
