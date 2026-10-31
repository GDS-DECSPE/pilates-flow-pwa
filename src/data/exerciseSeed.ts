import { Exercise } from '../types/pilates';

export const EXERCISE_SEED: Exercise[] = [
  {
    id: 'ex_ref_001',
    title: 'Footwork: Toes',
    equipment: 'Reformer',
    props: [],
    level: 'Essential',
    blockCategory: 'Warmup/Integration',
    targetMuscles: ['Cuádriceps', 'Glúteos', 'Gemelos', 'Abdomen Profundo'],
    springIntensity: 'Heavy',
    verbalCues: [
      'Pelvis en neutro y sacro pesado apoyado en el carro.',
      'Empuja el carro desde glúteos sin bloquear rodillas.',
      'Mantén los talones congelados en relevé alto durante toda la serie.'
    ],
    contraindications: ['Pregnancy_T2_T3', 'Achilles_Tendinitis_Acute'],
    modifications: {
      'Pregnancy_T2_T3': 'Usar cuña de elevación postural (Wedge) para evitar posición supina prolongada.'
    },
    defaultDurationSeconds: 120
  },
  {
    id: 'ex_ref_002',
    title: 'Footwork: Arches',
    equipment: 'Reformer',
    props: [],
    level: 'Essential',
    blockCategory: 'Warmup/Integration',
    targetMuscles: ['Cuádriceps', 'Isquiotibiales', 'Planta del Pie'],
    springIntensity: 'Heavy',
    verbalCues: [
      'Apoya los arcos plantares firmes en la barra.',
      'Mantén las rodillas alineadas con las crestas ilíacas.',
      'Extiende las piernas con control sin dar tirones.'
    ],
    contraindications: [],
    modifications: {},
    defaultDurationSeconds: 120
  },
  {
    id: 'ex_ref_003',
    title: 'The Hundred',
    equipment: 'Reformer',
    props: [],
    level: 'Intermediate',
    blockCategory: 'Abdominals',
    targetMuscles: ['Recto Abdominal', 'Transverso', 'Flexores de Cadera'],
    springIntensity: 'Medium',
    verbalCues: [
      'Flexión cérvico-torácica profunda mirando hacia el ombligo.',
      'Bombeo de brazos enérgico a la altura de las caderas.',
      'Inhala en 5 tiempos, exhala en 5 tiempos coordinado con las piernas.'
    ],
    contraindications: ['Hernia_Cervical', 'Dolor_Lumbar_Agudo'],
    modifications: {
      'Hernia_Cervical': 'Mantener la cabeza apoyada sobre el cabezal elevado o usar pelota suave.'
    },
    defaultDurationSeconds: 180
  },
  {
    id: 'ex_ref_004',
    title: 'Short Spine Massage',
    equipment: 'Reformer',
    props: [],
    level: 'Intermediate',
    blockCategory: 'Spinal Articulation',
    targetMuscles: ['Isquiotibiales', 'Glúteos', 'Erectores Espinales'],
    springIntensity: 'Medium_Heavy',
    verbalCues: [
      'Articula la columna vértebra por vértebra al elevar la pelvis.',
      'Mantiene los tirantes tensos sin dejar caer el carro de golpe.',
      'Flexiona rodillas hacia los hombros manteniendo el sacro elevado.'
    ],
    contraindications: ['Osteoporosis', 'Inestabilidad_Cervical'],
    modifications: {
      'Osteoporosis': 'Contraindicado por flexión espinal con carga. Sustituir por Bridge neutro.'
    },
    defaultDurationSeconds: 150
  },
  {
    id: 'ex_ref_005',
    title: 'Elephant',
    equipment: 'Reformer',
    props: [],
    level: 'Essential',
    blockCategory: 'Core/Footwork',
    targetMuscles: ['Abdomen Profundo', 'Isquiotibiales', 'Estabilizadores de Hombro'],
    springIntensity: 'Medium',
    verbalCues: [
      'Empuja el carro únicamente desde la fuerza abdominal profunda.',
      'Apoya talones firmes en la plataforma de madera.',
      'Mantén la columna en una C mayúscula redonda y protegida.'
    ],
    contraindications: ['Lesion_Muñeca'],
    modifications: {
      'Lesion_Muñeca': 'Apoyar antebrazos sobre la barra de pies elevada.'
    },
    defaultDurationSeconds: 120
  },
  {
    id: 'ex_ref_006',
    title: 'Mermaid',
    equipment: 'Reformer',
    props: [],
    level: 'Essential',
    blockCategory: 'Lateral/Extension',
    targetMuscles: ['Oblicuos', 'Intercostales', 'Dorsal Ancho'],
    springIntensity: 'Light',
    verbalCues: [
      'Ancla el isquión opuesto firmemente sobre el carro.',
      'Abre las costillas como un acordeón hacia el techo.',
      'Mantén los hombros lejos de las orejas durante la flexión lateral.'
    ],
    contraindications: [],
    modifications: {},
    defaultDurationSeconds: 120
  }
];