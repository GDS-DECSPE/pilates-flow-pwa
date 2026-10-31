import { useState, useEffect } from 'react';
import { SequenceItem, Exercise, SpringBrand, Student } from '../types/pilates';
import { EXERCISE_SEED } from '../data/exerciseSeed';
import { INITIAL_STUDENTS } from '../data/studentSeed';

export function useSequencePlanner() {
  const [items, setItems] = useState<SequenceItem[]>([]);
  const [targetMinutes, setTargetMinutes] = useState<number>(50);
  const [selectedBrand, setSelectedBrand] = useState<SpringBrand>('balanced_body_allegro_2');

  // Custom Exercises
  const [customExercises, setCustomExercises] = useState<Exercise[]>(() => {
    try {
      const saved = localStorage.getItem('pilates_custom_exercises');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Students
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('pilates_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pilates_custom_exercises', JSON.stringify(customExercises));
    } catch (e) {
      console.error(e);
    }
  }, [customExercises]);

  useEffect(() => {
    try {
      localStorage.setItem('pilates_students', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  const allExercises = [...EXERCISE_SEED, ...customExercises];

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

  const addCustomExercise = (newEx: Omit<Exercise, 'id'>) => {
    const created: Exercise = {
      ...newEx,
      id: `custom_ex_${Date.now()}`
    };
    setCustomExercises(prev => [created, ...prev]);
  };

  const addStudent = (name: string, conditions: string[], notes?: string) => {
    const newStd: Student = {
      id: `std_${Date.now()}`,
      name,
      conditions,
      notes: notes || '',
      isPresent: true
    };
    setStudents(prev => [...prev, newStd]);
  };

  const toggleStudentPresence = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isPresent: !s.isPresent } : s));
  };

  return {
    items,
    allExercises,
    customExercises,
    students,
    targetMinutes,
    setTargetMinutes,
    selectedBrand,
    setSelectedBrand,
    addExercise,
    removeExercise,
    updateDuration,
    moveExercise,
    addCustomExercise,
    addStudent,
    toggleStudentPresence
  };
}