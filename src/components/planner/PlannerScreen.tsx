import React, { useState } from 'react';
import { EXERCISE_SEED } from '../../data/exerciseSeed';
import { Exercise, SpringBrand } from '../../types/pilates';
import { calculateSequencePacing } from '../../domain/pacingEngine';
import { getSpringForBrand } from '../../domain/springEngine';

interface Props {
  plannerState: any;
  onStartClass: () => void;
}

export const PlannerScreen: React.FC<Props> = ({ plannerState, onStartClass }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(EXERCISE_SEED[0]);

  const filteredExercises = EXERCISE_SEED.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.blockCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pacing = calculateSequencePacing(plannerState.items, plannerState.targetMinutes);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Columna 1: Catálogo de Búsqueda */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col h-1/3 lg:h-full">
        <h2 className="text-xl font-bold mb-3 text-teal-400">1. Catálogo de Ejercicios</h2>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o bloque..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mb-3 focus:outline-none focus:border-teal-500"
        />
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredExercises.map(ex => (
            <div
              key={ex.id}
              onClick={() => setSelectedExerciseForDetail(ex)}
              className={`p-3 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                selectedExerciseForDetail?.id === ex.id
                  ? 'bg-slate-800 border-teal-500'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div>
                <h4 className="font-semibold text-sm text-slate-100">{ex.title}</h4>
                <div className="flex gap-2 text-xs text-slate-400 mt-1">
                  <span className="bg-slate-700 px-2 py-0.5 rounded text-teal-300">{ex.blockCategory}</span>
                  <span>{ex.level}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  plannerState.addExercise(ex);
                }}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
              >
                + Añadir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Columna 2: Línea de Tiempo de la Clase */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col h-1/3 lg:h-full bg-slate-900/50">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-teal-400">2. Estructura de Clase</h2>
          <button
            onClick={onStartClass}
            disabled={plannerState.items.length === 0}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-lg"
          >
            ▶️ Iniciar Clase
          </button>
        </div>

        {/* Barra de Tiempo Inteligente */}
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 mb-3">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Tiempo Acumulado: {pacing.totalMinutesFormatted} min</span>
            <span className={pacing.isOverTime ? 'text-rose-400' : 'text-slate-400'}>
              Objetivo: {pacing.targetMinutes} min
            </span>
          </div>
          <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${pacing.isOverTime ? 'bg-rose-500' : 'bg-teal-500'}`}
              style={{ width: `${Math.min(100, (pacing.totalSeconds / (pacing.targetMinutes * 60)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Lista de Secuencia */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {plannerState.items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Tu clase está vacía.<br/>Toca "+ Añadir" en cualquier ejercicio del catálogo.
            </div>
          ) : (
            plannerState.items.map((item: any, index: number) => (
              <div key={item.instanceId} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-500 text-sm">#{index + 1}</span>
                  <div>
                    <h5 className="font-semibold text-sm">{item.exercise.title}</h5>
                    <span className="text-xs text-slate-400">{Math.floor(item.durationSeconds / 60)} min {item.durationSeconds % 60}s</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => plannerState.updateDuration(item.instanceId, -30)} className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded text-xs">-</button>
                  <button onClick={() => plannerState.updateDuration(item.instanceId, 30)} className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded text-xs">+</button>
                  <button onClick={() => plannerState.moveExercise(item.instanceId, 'up')} className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded text-xs">▲</button>
                  <button onClick={() => plannerState.moveExercise(item.instanceId, 'down')} className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded text-xs">▼</button>
                  <button onClick={() => plannerState.removeExercise(item.instanceId)} className="w-6 h-6 bg-rose-900/50 text-rose-300 hover:bg-rose-800 rounded text-xs ml-1">✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Columna 3: Detalle Técnico del Ejercicio */}
      <div className="w-full lg:w-1/3 p-4 flex flex-col h-1/3 lg:h-full bg-slate-950/50 overflow-y-auto">
        <h2 className="text-xl font-bold mb-3 text-teal-400">3. Detalle Técnico</h2>
        
        {/* Selector de Marca de Reformer */}
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 mb-4">
          <label className="text-xs font-semibold text-slate-400 block mb-1">Marca de Reformer en Estudio:</label>
          <select
            value={plannerState.selectedBrand}
            onChange={(e) => plannerState.setSelectedBrand(e.target.value as SpringBrand)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="balanced_body_allegro_2">Balanced Body (Allegro 2)</option>
            <option value="peak_pilates">Peak Pilates</option>
            <option value="gratz">Gratz Original</option>
            <option value="merrithew_stott">Merrithew (Stott)</option>
            <option value="elina_pilates">Elina Pilates</option>
          </select>
        </div>

        {selectedExerciseForDetail ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{selectedExerciseForDetail.title}</h3>
              <p className="text-xs text-teal-300">{selectedExerciseForDetail.equipment} • {selectedExerciseForDetail.level}</p>
            </div>

            {/* Visualizador de Resortes Traducidos */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Configuración de Resortes:</span>
              {(() => {
                const spring = getSpringForBrand(plannerState.selectedBrand, selectedExerciseForDetail.springIntensity);
                return (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      {spring.colors.map((color, idx) => (
                        <div key={idx} className="w-5 h-5 rounded-full border border-slate-500 shadow-md" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-200">{spring.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* Claves Verbales (Cues) */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-xs font-semibold text-teal-400 block mb-1">Frases de Guiado (Cues):</span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {selectedExerciseForDetail.verbalCues.map((cue, idx) => (
                  <li key={idx}>{cue}</li>
                ))}
              </ul>
            </div>

            {/* Alertas Médicas */}
            {selectedExerciseForDetail.contraindications.length > 0 && (
              <div className="bg-rose-950/40 border border-rose-800/50 p-3 rounded-xl">
                <span className="text-xs font-semibold text-rose-400 block mb-1">⚠️ Contraindicaciones:</span>
                <p className="text-xs text-rose-200">{selectedExerciseForDetail.contraindications.join(', ')}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Selecciona un ejercicio del catálogo para ver su detalle técnico.</p>
        )}
      </div>
    </div>
  );
};