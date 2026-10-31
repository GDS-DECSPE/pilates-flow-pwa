import React, { useState } from 'react';
import { useSequencePlanner } from './hooks/useSequencePlanner';
import { PlannerScreen } from './components/planner/PlannerScreen';
import { GlanceableScreen } from './components/glanceable/GlanceableScreen';
import { InstallPrompt } from './components/pwa/InstallPrompt';

export function App() {
  const plannerState = useSequencePlanner();
  const [mode, setMode] = useState<'planner' | 'live_class'>('planner');

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100">
      <InstallPrompt />
      {mode === 'planner' ? (
        <PlannerScreen
          plannerState={plannerState}
          onStartClass={() => setMode('live_class')}
        />
      ) : (
        <GlanceableScreen
          items={plannerState.items}
          selectedBrand={plannerState.selectedBrand}
          students={plannerState.students}
          onExit={() => setMode('planner')}
        />
      )}
    </div>
  );
}

export default App;