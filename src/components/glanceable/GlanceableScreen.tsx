import React, { useState, useEffect } from 'react';
import { SpringBrand, Student } from '../../types/pilates';
import { getSpringForBrand } from '../../domain/springEngine';

interface Props {
  items: any[];
  selectedBrand: SpringBrand;
  students?: Student[];
  onExit: () => void;
}

export const GlanceableScreen: React.FC<Props> = ({ items, selectedBrand, students = [], onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(items[0]?.durationSeconds || 120);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!currentItem) return;
    setSecondsRemaining(currentItem.durationSeconds);
  }, [currentIndex, currentItem]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, secondsRemaining]);

  if (!currentItem) {
    return (
      <div className="h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">¡Clase Finalizada! 🎉</h2>
        <p className="text-slate-400 mb-6">Has completado la secuencia de ejercicios de hoy.</p>
        <button onClick={onExit} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl">
          Volver al Planificador
        </button>
      </div>
    );
  }

  const spring = getSpringForBrand(selectedBrand, currentItem.exercise.springIntensity);
  const nextItem = items[currentIndex + 1];

  const presentStudents = students.filter(s => s.isPresent);
  const activeAlerts = presentStudents.flatMap(s => 
    s.conditions
      .filter(c => currentItem.exercise.contraindications.includes(c))
      .map(c => ({
        student: s,
        condition: c,
        modification: currentItem.exercise.modifications[c] || s.notes || 'Adaptar posición o sustituir por opción neutra.'
      }))
  );

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Barra Superior de Control */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">
            EJERCICIO {currentIndex + 1} DE {items.length}
          </span>
          <h3 className="text-sm font-semibold text-slate-400">{currentItem.exercise.blockCategory}</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-2xl font-mono font-bold bg-slate-900 px-4 py-1.5 rounded-xl border border-slate-800 text-teal-300">
            {Math.floor(secondsRemaining / 60)}:{secondsRemaining % 60 < 10 ? '0' : ''}{secondsRemaining % 60}
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700"
          >
            {isPlaying ? '⏸️ PAUSA' : '▶️ CONTINUAR'}
          </button>
          <button onClick={onExit} className="bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 px-3 py-2 rounded-xl text-xs border border-rose-800/50">
            ✕ SALIR
          </button>
        </div>
      </div>

      {/* Contenido Gigante Principal */}
      <div className="flex-1 flex flex-col justify-center py-4 space-y-4 overflow-y-auto">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-1">
            {currentItem.exercise.title}
          </h1>
          <p className="text-lg text-teal-300 font-medium">{currentItem.exercise.equipment} • {currentItem.exercise.level}</p>
        </div>

        {/* Tensión de Resortes */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 inline-block max-w-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            ⚙️ Resortes Configurados ({selectedBrand.replace(/_/g, ' ')}):
          </span>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {spring.colors.map((color: string, idx: number) => (
                <div key={idx} className="w-8 h-8 rounded-full border-2 border-slate-400 shadow-lg" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="text-lg font-bold text-slate-100">{spring.label}</span>
          </div>
        </div>

        {/* Claves Verbales (Cues) */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-2">
            🗣️ Claves de Guiado (Cues):
          </span>
          <ul className="space-y-1.5 text-base lg:text-lg text-slate-200">
            {currentItem.exercise.verbalCues.map((cue: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-teal-400 font-bold">•</span>
                <span>{cue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ALERTA DE SEGURIDAD EN VIVO PARA ALUMNAS PRESENTES */}
        {activeAlerts.length > 0 ? (
          <div className="bg-rose-950/90 border-2 border-rose-600 p-4 rounded-2xl flex items-start gap-3 text-rose-100 animate-pulse">
            <span className="text-2xl">🚨</span>
            <div>
              <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                ALERTA DE SEGURIDAD EN CLASE ({activeAlerts.length})
              </h5>
              {activeAlerts.map((a, i) => (
                <p key={i} className="text-sm font-semibold mt-1">
                  • <span className="underline">{a.student.name}</span> ({a.condition}): {a.modification}
                </p>
              ))}
            </div>
          </div>
        ) : (
          currentItem.exercise.contraindications.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              <span className="text-xs font-bold text-amber-400 uppercase">Contraindicaciones Generales:</span>
              <p className="text-xs text-slate-300 mt-0.5">{currentItem.exercise.contraindications.join(', ')}</p>
            </div>
          )
        )}
      </div>

      {/* Botón Gigante Inferior de Navegación */}
      <button
        onClick={() => setCurrentIndex(prev => prev + 1)}
        className="w-full bg-teal-600 hover:bg-teal-500 active:scale-[0.99] transition text-white font-black py-4 rounded-2xl text-xl shadow-2xl flex items-center justify-center gap-3"
      >
        <span>SIGUIENTE EJERCICIO ⏭️</span>
        {nextItem && <span className="text-sm font-normal text-teal-200">({nextItem.exercise.title})</span>}
      </button>
    </div>
  );
};