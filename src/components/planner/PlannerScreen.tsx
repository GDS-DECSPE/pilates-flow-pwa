import React, { useState } from 'react';
import { Exercise, SpringBrand, Student, BlockCategory, Level, Equipment } from '../../types/pilates';
import { calculateSequencePacing } from '../../domain/pacingEngine';
import { getSpringForBrand } from '../../domain/springEngine';

interface Props {
  plannerState: any;
  onStartClass: () => void;
}

export const PlannerScreen: React.FC<Props> = ({ plannerState, onStartClass }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(
    plannerState.allExercises[0] || null
  );

  // Modal states
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // New exercise form state
  const [newTitle, setNewTitle] = useState('');
  const [newEquipment, setNewEquipment] = useState<Equipment>('Reformer');
  const [newLevel, setNewLevel] = useState<Level>('Essential');
  const [newCategory, setNewCategory] = useState<BlockCategory>('Warmup/Integration');
  const [newSpringIntensity, setNewSpringIntensity] = useState<'Light' | 'Medium' | 'Medium_Heavy' | 'Heavy'>('Medium');
  const [newMuscles, setNewMuscles] = useState('');
  const [newCues, setNewCues] = useState('');
  const [newContraindications, setNewContraindications] = useState('');

  // New student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentConditions, setNewStudentConditions] = useState('');
  const [newStudentNotes, setNewStudentNotes] = useState('');

  const filteredExercises = plannerState.allExercises.filter((ex: Exercise) => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.blockCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.targetMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pacing = calculateSequencePacing(plannerState.items, plannerState.targetMinutes);

  const presentStudents: Student[] = plannerState.students.filter((s: Student) => s.isPresent);
  const presentConditions = new Set(presentStudents.flatMap(s => s.conditions));

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    plannerState.addCustomExercise({
      title: newTitle.trim(),
      equipment: newEquipment,
      props: [],
      level: newLevel,
      blockCategory: newCategory,
      springIntensity: newSpringIntensity,
      targetMuscles: newMuscles.split(',').map(m => m.trim()).filter(Boolean),
      verbalCues: newCues.split('\n').map(c => c.trim()).filter(Boolean),
      contraindications: newContraindications.split(',').map(c => c.trim()).filter(Boolean),
      modifications: {},
      defaultDurationSeconds: 120
    });

    setNewTitle('');
    setNewMuscles('');
    setNewCues('');
    setNewContraindications('');
    setShowAddExerciseModal(false);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    plannerState.addStudent(
      newStudentName.trim(),
      newStudentConditions.split(',').map(c => c.trim()).filter(Boolean),
      newStudentNotes.trim()
    );

    setNewStudentName('');
    setNewStudentConditions('');
    setNewStudentNotes('');
  };

  // Function to check safety alerts for an exercise against present students
  const getStudentAlertsForExercise = (exercise: Exercise) => {
    const alerts: { student: Student; condition: string; modification?: string }[] = [];
    presentStudents.forEach(student => {
      student.conditions.forEach(cond => {
        if (exercise.contraindications.includes(cond)) {
          alerts.push({
            student,
            condition: cond,
            modification: exercise.modifications[cond]
          });
        }
      });
    });
    return alerts;
  };

  const activeDetailAlerts = selectedExerciseForDetail 
    ? getStudentAlertsForExercise(selectedExerciseForDetail) 
    : [];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-900 text-slate-100 overflow-hidden">
      
      {/* COLUMNA 1: Catálogo de Ejercicios */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col h-1/3 lg:h-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-teal-400">1. Catálogo</h2>
          <button
            onClick={() => setShowAddExerciseModal(true)}
            className="bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-500/50 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            ➕ Nuevo Ejercicio
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar por nombre, bloque o músculo..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mb-3 focus:outline-none focus:border-teal-500"
        />

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredExercises.map((ex: Exercise) => (
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
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-100">{ex.title}</h4>
                  {ex.id.startsWith('custom_') && (
                    <span className="bg-amber-900/60 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-700/50">Custom</span>
                  )}
                </div>
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

      {/* COLUMNA 2: Estructura de Clase & Panel de Alumnas */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col h-1/3 lg:h-full bg-slate-900/50">
        
        {/* Encabezado con Botón de Iniciar Clase */}
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

        {/* Módulo de Asistencia & Fichas Médicas de Alumnas */}
        <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
              👥 Asistencia & Fichas Clínicas ({presentStudents.length} presentes)
            </span>
            <button
              onClick={() => setShowStudentModal(true)}
              className="text-[11px] text-teal-400 hover:underline"
            >
              Gestionar Alumnas
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plannerState.students.map((std: Student) => (
              <button
                key={std.id}
                onClick={() => plannerState.toggleStudentPresence(std.id)}
                className={`text-xs px-2 py-0.5 rounded-md border transition flex items-center gap-1 ${
                  std.isPresent
                    ? 'bg-teal-950/80 border-teal-600 text-teal-200'
                    : 'bg-slate-900/40 border-slate-700 text-slate-500 line-through'
                }`}
              >
                <span>{std.isPresent ? '✓' : '✗'}</span>
                <span>{std.name}</span>
                {std.conditions.length > 0 && (
                  <span className="text-[10px] bg-rose-900/60 text-rose-300 px-1 rounded">
                    {std.conditions.join(', ')}
                  </span>
                )}
              </button>
            ))}
          </div>
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
            plannerState.items.map((item: any, index: number) => {
              const itemAlerts = getStudentAlertsForExercise(item.exercise);
              return (
                <div key={item.instanceId} className={`p-3 rounded-xl border transition ${
                  itemAlerts.length > 0
                    ? 'bg-slate-800/90 border-rose-600/70'
                    : 'bg-slate-800 border-slate-700'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-500 text-sm">#{index + 1}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-sm">{item.exercise.title}</h5>
                          {itemAlerts.length > 0 && (
                            <span className="bg-rose-900/80 text-rose-200 text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse border border-rose-700">
                              ⚠️ Alerta Médica ({itemAlerts.length})
                            </span>
                          )}
                        </div>
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

                  {/* Detalle rápido de alerta en la secuencia */}
                  {itemAlerts.length > 0 && (
                    <div className="mt-2 bg-rose-950/60 p-2 rounded-lg border border-rose-800/50 text-xs text-rose-200">
                      {itemAlerts.map((a, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="font-semibold">⚠️ {a.student.name} ({a.condition}):</span>
                          <span className="text-slate-300 text-[11px]">{a.modification || 'Adaptar posición o sustituir.'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* COLUMNA 3: Detalle Técnico del Ejercicio & Alertas Médicas en Vivo */}
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

            {/* ALERTA MÉDICA DESTACADA DE ALUMNA PRESENTES */}
            {activeDetailAlerts.length > 0 && (
              <div className="bg-rose-950 border-2 border-rose-600 p-3 rounded-xl shadow-lg animate-pulse">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1 mb-1">
                  🚨 ALERTA DE SEGURIDAD EN CLASE ({activeDetailAlerts.length})
                </span>
                {activeDetailAlerts.map((alert, idx) => (
                  <div key={idx} className="mt-1 text-xs text-rose-100 bg-rose-900/40 p-2 rounded border border-rose-700">
                    <p className="font-bold">Alumna: {alert.student.name} ({alert.condition})</p>
                    <p className="mt-0.5 text-slate-200">
                      💡 Modificación: {alert.modification || alert.student.notes || 'Reemplazar por alternativa neutra.'}
                    </p>
                  </div>
                ))}
              </div>
            )}

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

            {/* Músculos Principales Trabajados */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-xs font-semibold text-teal-400 block mb-1">💪 Músculos Principales:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedExerciseForDetail.targetMuscles.map((muscle, idx) => (
                  <span key={idx} className="bg-slate-700/80 text-teal-200 text-xs px-2 py-0.5 rounded-md border border-slate-600">
                    {muscle}
                  </span>
                ))}
              </div>
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

            {/* Contraindicaciones Generales */}
            {selectedExerciseForDetail.contraindications.length > 0 && (
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
                <span className="text-xs font-semibold text-amber-400 block mb-1">⚠️ Contraindicaciones Generales:</span>
                <p className="text-xs text-slate-300">{selectedExerciseForDetail.contraindications.join(', ')}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Selecciona un ejercicio del catálogo para ver su detalle técnico.</p>
        )}
      </div>

      {/* MODAL: Crear Nuevo Ejercicio */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-teal-400">➕ Crear Nuevo Ejercicio</h3>
              <button onClick={() => setShowAddExerciseModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título del Ejercicio:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Long Stretch Series"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Equipo:</label>
                  <select
                    value={newEquipment}
                    onChange={e => setNewEquipment(e.target.value as Equipment)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Reformer">Reformer</option>
                    <option value="Mat">Mat</option>
                    <option value="Cadillac">Cadillac</option>
                    <option value="Chair">Chair</option>
                    <option value="Barrels">Barrels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nivel:</label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value as Level)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Essential">Essential</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bloque:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as BlockCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Warmup/Integration">Warmup/Integration</option>
                    <option value="Core/Footwork">Core/Footwork</option>
                    <option value="Abdominals">Abdominals</option>
                    <option value="Spinal Articulation">Spinal Articulation</option>
                    <option value="Lateral/Extension">Lateral/Extension</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Resorte Recomendado:</label>
                  <select
                    value={newSpringIntensity}
                    onChange={e => setNewSpringIntensity(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Light">Light (Ligero)</option>
                    <option value="Medium">Medium (Medio)</option>
                    <option value="Medium_Heavy">Medium-Heavy</option>
                    <option value="Heavy">Heavy (Pesado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Músculos Objetivo (separados por coma):</label>
                <input
                  type="text"
                  placeholder="Cuádriceps, Isquiotibiales, Abdomen"
                  value={newMuscles}
                  onChange={e => setNewMuscles(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Consignas Verbales (Cues - 1 por línea):</label>
                <textarea
                  rows={2}
                  placeholder="Mantener la pelvis neutra&#10;Inhalar al extender"
                  value={newCues}
                  onChange={e => setNewCues(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contraindicaciones Médicas (separadas por coma):</label>
                <input
                  type="text"
                  placeholder="Hernia_Cervical, Osteoporosis, Pregnancy_T2_T3"
                  value={newContraindications}
                  onChange={e => setNewContraindications(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExerciseModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold"
                >
                  Guardar Ejercicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Gestionar Alumnas & Fichas Médicas */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-teal-400">👥 Gestión de Alumnas & Fichas Clínicas</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Agregar nueva alumna */}
            <form onSubmit={handleCreateStudent} className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 space-y-2 text-xs">
              <span className="font-bold text-slate-200 block">➕ Registrar Nueva Alumna</span>
              <input
                type="text"
                required
                placeholder="Nombre de la alumna"
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
              />
              <input
                type="text"
                placeholder="Condiciones médicas (ej. Hernia_Cervical, Osteoporosis)"
                value={newStudentConditions}
                onChange={e => setNewStudentConditions(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
              />
              <input
                type="text"
                placeholder="Observaciones posturales / Notas clínicas"
                value={newStudentNotes}
                onChange={e => setNewStudentNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
              />
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-1.5 rounded transition">
                + Guardar Alumna
              </button>
            </form>

            {/* Lista de Alumnas registradas */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              <span className="font-bold text-slate-300 block">Listado de Alumnas Registradas:</span>
              {plannerState.students.map((std: Student) => (
                <div key={std.id} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-100">{std.name}</span>
                    {std.conditions.length > 0 && (
                      <p className="text-[11px] text-rose-300">Condiciones: {std.conditions.join(', ')}</p>
                    )}
                    {std.notes && <p className="text-[10px] text-slate-400">{std.notes}</p>}
                  </div>
                  <button
                    onClick={() => plannerState.toggleStudentPresence(std.id)}
                    className={`px-3 py-1 rounded font-bold transition ${
                      std.isPresent
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {std.isPresent ? 'Presente ✓' : 'Ausente'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowStudentModal(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};