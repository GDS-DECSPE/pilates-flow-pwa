import React, { useState } from 'react';

interface Props {
  exerciseTitle: string;
  category: string;
  className?: string;
}

export const BiomechanicalVisualizer: React.FC<Props> = ({ exerciseTitle, category, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1);

  const titleLower = exerciseTitle.toLowerCase();

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center select-none shadow-xl ${className}`}>
      {/* Header del Visualizador Offline */}
      <div className="w-full flex justify-between items-center mb-3 text-xs font-semibold text-slate-400">
        <span className="flex items-center gap-1.5 text-teal-400">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          🎬 Demostración Biomecánica (100% Offline)
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSpeed(s => s === 1 ? 0.5 : s === 0.5 ? 1.5 : 1)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700"
          >
            Velocidad: {speed}x
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700"
          >
            {isPlaying ? '⏸️ Pausa' : '▶️ Play'}
          </button>
        </div>
      </div>

      {/* Contenedor del Lienzo Biomecánico Vectorial */}
      <div className="w-full h-48 bg-slate-950/80 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center">
        {/* Grilla Biomecánica de Fondo */}
        <svg className="absolute inset-0 w-full h-full opacity-10" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Renderizado de Animaciones según Ejercicio */}
        <svg 
          viewBox="0 0 400 200" 
          className="w-full h-full max-w-sm"
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        >
          {/* Estructura Base del Reformer */}
          {/* Rieles y Marco */}
          <rect x="30" y="145" width="340" height="8" rx="4" fill="#334155" />
          <rect x="40" y="153" width="10" height="20" fill="#1e293b" />
          <rect x="350" y="153" width="10" height="20" fill="#1e293b" />
          
          {/* Barra de Pies (Footbar) */}
          <path d="M 50 150 L 50 95 Q 50 85 60 85 L 65 85" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
          
          {/* Cabezal y Hombreras Base */}
          <g>
            <style>{`
              @keyframes carriageSlide {
                0%, 100% { transform: translateX(0px); }
                50% { transform: translateX(110px); }
              }
              @keyframes hundredPump {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-12px); }
              }
              @keyframes spineRoll {
                0%, 100% { transform: rotate(0deg) translateY(0px); }
                50% { transform: rotate(-25deg) translateY(-25px); }
              }
              @keyframes mermaidStretch {
                0%, 100% { transform: skewX(0deg); }
                50% { transform: skewX(-15deg); }
              }
              .anim-carriage {
                animation: carriageSlide ${3 / speed}s ease-in-out infinite;
                animation-play-state: ${isPlaying ? 'running' : 'paused'};
              }
              .anim-pump {
                animation: hundredPump ${0.6 / speed}s ease-in-out infinite;
                animation-play-state: ${isPlaying ? 'running' : 'paused'};
              }
              .anim-spine {
                animation: spineRoll ${4 / speed}s ease-in-out infinite;
                animation-play-state: ${isPlaying ? 'running' : 'paused'};
              }
            `}</style>

            {/* Carro Móvil (Carriage) con Animación según Ejercicio */}
            {titleLower.includes('footwork') ? (
              <g className="anim-carriage">
                {/* Carro */}
                <rect x="110" y="130" width="150" height="15" rx="4" fill="#0f766e" />
                {/* Resorte Tensión */}
                <line x1="60" y1="138" x2="110" y2="138" stroke="#f43f5e" strokeWidth="4" strokeDasharray="3,2" />
                {/* Cuerpo del Alumno en Posición Supina */}
                {/* Tronco */}
                <rect x="150" y="118" width="80" height="12" rx="6" fill="#38bdf8" />
                {/* Cabeza */}
                <circle cx="240" cy="120" r="10" fill="#fde047" />
                {/* Piernas articulando contra la footbar */}
                <path d="M 150 120 L 100 100 L 60 90" fill="none" stroke="#2dd4bf" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ) : titleLower.includes('hundred') ? (
              <g className="anim-carriage">
                {/* Carro */}
                <rect x="110" y="130" width="150" height="15" rx="4" fill="#0f766e" />
                {/* Cuerpo Supino con Flexión Cérvico-Torácica */}
                <rect x="150" y="118" width="70" height="12" rx="6" fill="#38bdf8" />
                <circle cx="225" cy="112" r="10" fill="#fde047" />
                {/* Piernas a 45 grados */}
                <path d="M 150 120 L 110 85" fill="none" stroke="#2dd4bf" strokeWidth="7" strokeLinecap="round" />
                {/* Brazo Bombeando */}
                <g className="anim-pump">
                  <path d="M 200 120 L 150 115" fill="none" stroke="#fb7185" strokeWidth="5" strokeLinecap="round" />
                </g>
              </g>
            ) : titleLower.includes('short spine') ? (
              <g className="anim-carriage">
                <rect x="110" y="130" width="150" height="15" rx="4" fill="#0f766e" />
                {/* Elevación de Pelvis y Articulación de Columna */}
                <g className="anim-spine" style={{ transformOrigin: '240px 120px' }}>
                  <path d="M 240 120 L 170 115 L 140 70 L 110 50" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="245" cy="120" r="10" fill="#fde047" />
                </g>
              </g>
            ) : titleLower.includes('elephant') ? (
              <g className="anim-carriage">
                <rect x="110" y="130" width="150" height="15" rx="4" fill="#0f766e" />
                {/* Alumno de Pie en C-Shape */}
                <path d="M 60 90 L 120 70 Q 150 65 170 128" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeLinecap="round" />
                <circle cx="130" cy="72" r="10" fill="#fde047" />
              </g>
            ) : (
              /* Animación Estándar Generica de Movimiento */
              <g className="anim-carriage">
                <rect x="110" y="130" width="150" height="15" rx="4" fill="#0f766e" />
                <rect x="140" y="115" width="90" height="15" rx="7" fill="#38bdf8" />
                <circle cx="240" cy="120" r="10" fill="#fde047" />
                <path d="M 140 122 L 95 95" fill="none" stroke="#2dd4bf" strokeWidth="6" strokeLinecap="round" />
              </g>
            )}
          </g>
        </svg>

        {/* Leyenda y Estado de Red */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-slate-900/90 px-2 py-1 rounded-md text-[10px] text-emerald-400 border border-slate-700">
          <span>⚡ Modo Offline Activo</span>
        </div>
      </div>

      {/* Explicación Técnica en Texto Corto */}
      <div className="w-full mt-2 text-[11px] text-slate-400 text-center">
        {titleLower.includes('footwork') && 'Extensión y flexión controlada de rodillas y caderas con alineación de tobillos.'}
        {titleLower.includes('hundred') && 'Flexión torácica fija sostenida con bombeo rítmico armónico de brazos.'}
        {titleLower.includes('short spine') && 'Articulación secuencial vértebra por vértebra elevando el sacro.'}
        {titleLower.includes('elephant') && 'Tracción abdominal profunda manteniendo la columna en C redonda.'}
        {titleLower.includes('mermaid') && 'Apertura lateral del talle y caja torácica sin despegar isquiones.'}
        {!titleLower.includes('footwork') && !titleLower.includes('hundred') && !titleLower.includes('short spine') && !titleLower.includes('elephant') && !titleLower.includes('mermaid') && 'Patrón de movimiento biomecánico continuo en Reformer.'}
      </div>
    </div>
  );
};
