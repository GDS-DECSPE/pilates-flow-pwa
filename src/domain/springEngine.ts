import { SpringBrand } from '../types/pilates';

export interface SpringConfig {
  label: string;
  colors: string[]; // Códigos Hex
  colorNames: string[];
}

export const SPRING_TRANSLATION_MAP: Record<SpringBrand, Record<string, SpringConfig>> = {
  balanced_body_allegro_2: {
    Light: { label: '1 Amarillo', colors: ['#EAB308'], colorNames: ['Amarillo (Ligero)'] },
    Medium: { label: '1 Azul', colors: ['#3B82F6'], colorNames: ['Azul (Medio)'] },
    Medium_Heavy: { label: '1 Rojo + 1 Azul', colors: ['#EF4444', '#3B82F6'], colorNames: ['Rojo', 'Azul'] },
    Heavy: { label: '2 Rojos + 1 Azul', colors: ['#EF4444', '#EF4444', '#3B82F6'], colorNames: ['Rojo', 'Rojo', 'Azul'] }
  },
  peak_pilates: {
    Light: { label: '1 Azul', colors: ['#3B82F6'], colorNames: ['Azul'] },
    Medium: { label: '1 Amarillo', colors: ['#EAB308'], colorNames: ['Amarillo'] },
    Medium_Heavy: { label: '2 Amarillos', colors: ['#EAB308', '#EAB308'], colorNames: ['Amarillo', 'Amarillo'] },
    Heavy: { label: '3 Amarillos', colors: ['#EAB308', '#EAB308', '#EAB308'], colorNames: ['Amarillo', 'Amarillo', 'Amarillo'] }
  },
  gratz: {
    Light: { label: '2 Resortes Estándar', colors: ['#94A3B8', '#94A3B8'], colorNames: ['Gratz Acero', 'Gratz Acero'] },
    Medium: { label: '3 Resortes Estándar', colors: ['#94A3B8', '#94A3B8', '#94A3B8'], colorNames: ['Gratz Acero', 'Gratz Acero', 'Gratz Acero'] },
    Medium_Heavy: { label: '3 Resortes Tensión Alta', colors: ['#64748B', '#64748B', '#64748B'], colorNames: ['Gratz Acero', 'Gratz Acero', 'Gratz Acero'] },
    Heavy: { label: '4 Resortes Estándar', colors: ['#475569', '#475569', '#475569', '#475569'], colorNames: ['Gratz Acero', 'Gratz Acero', 'Gratz Acero', 'Gratz Acero'] }
  },
  merrithew_stott: {
    Light: { label: '1 Blanco (25%)', colors: ['#F8FAFC'], colorNames: ['Blanco'] },
    Medium: { label: '1 Azul (50%)', colors: ['#3B82F6'], colorNames: ['Azul'] },
    Medium_Heavy: { label: '1 Rojo (100%) + 1 Azul (50%)', colors: ['#EF4444', '#3B82F6'], colorNames: ['Rojo', 'Azul'] },
    Heavy: { label: '3 Rojos (100%)', colors: ['#EF4444', '#EF4444', '#EF4444'], colorNames: ['Rojo', 'Rojo', 'Rojo'] }
  },
  elina_pilates: {
    Light: { label: '1 Amarillo', colors: ['#EAB308'], colorNames: ['Amarillo'] },
    Medium: { label: '1 Verde', colors: ['#22C55E'], colorNames: ['Verde'] },
    Medium_Heavy: { label: '1 Rojo + 1 Verde', colors: ['#EF4444', '#22C55E'], colorNames: ['Rojo', 'Verde'] },
    Heavy: { label: '2 Rojos + 1 Verde', colors: ['#EF4444', '#EF4444', '#22C55E'], colorNames: ['Rojo', 'Rojo', 'Verde'] }
  }
};

export function getSpringForBrand(brand: SpringBrand, intensity: string): SpringConfig {
  return SPRING_TRANSLATION_MAP[brand]?.[intensity] || {
    label: intensity,
    colors: ['#94A3B8'],
    colorNames: [intensity]
  };
}