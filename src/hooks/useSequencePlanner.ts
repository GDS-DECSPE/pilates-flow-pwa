import { useState } from 'react';
import { SequenceItem, Exercise, SpringBrand } from '../types/pilates';

export function useSequencePlanner() {
  const [items, setItems] = useState<SequenceItem[]>([]);
  const [targetMinutes, setTargetMinutes] = useState<number>(50);
  const [selectedBrand, setSelectedBrand] = useState<SpringBrand>('balanced_body_allegro_2');

  const addExercise = (exercise: Exercise) => {
    const newItem: SequenceItem = {
      instanceId: `inst_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      exercise,
      durationSeconds: exercise.defaultDurationSeconds,
      order: items.length + 1
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeExercise = (instanceId: string) => {
    setItems(prev => prev.filter(i => i.instanceId !== instanceId));
  };

  const updateDuration = (instanceId: string, deltaSeconds: number) => {
    setItems(prev => prev.map(item => {
      if (item.instanceId === instanceId) {
        const newDur = Math.max(30, item.durationSeconds + deltaSeconds);
        return { ...item, durationSeconds: newDur };
      }
      return item;
    }));
  };

  const moveExercise = (instanceId: string, direction: 'up' | 'down') => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.instanceId === instanceId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const newArr = [...prev];
      const temp = newArr[idx];
      newArr[idx] = newArr[targetIdx];
      newArr[targetIdx] = temp;
      return newArr;
    });
  };

  return {
    items,
    targetMinutes,
    setTargetMinutes,
    selectedBrand,
    setSelectedBrand,
    addExercise,
    removeExercise,
    updateDuration,
    moveExercise
  };
}