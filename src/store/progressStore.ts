/**
 * Progress tracking state management
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentProgress } from '../types/assessment.types';

interface ProgressState {
  // Lesson progress
  lessonProgress: Record<string, number>; // lesson_id -> progress percentage
  completedLessons: Set<string>;
  currentLessonId: string | null;

  // Module progress
  moduleProgress: Record<number, number>; // module_id -> progress percentage
  completedModules: Set<number>;

  // Assessment progress
  assessmentProgress: Record<number, AssessmentProgress>; // module_id -> progress

  // Time tracking
  totalTimeSpent: number; // in minutes
  sessionStartTime: number | null;

  // Actions
  setLessonProgress: (lessonId: string, progress: number) => void;
  completeLesson: (lessonId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  setModuleProgress: (moduleId: number, progress: number) => void;
  completeModule: (moduleId: number) => void;
  setAssessmentProgress: (moduleId: number, progress: AssessmentProgress) => void;
  startSession: () => void;
  endSession: () => void;
  getTotalProgress: () => number;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      lessonProgress: {},
      completedLessons: new Set(),
      currentLessonId: null,
      moduleProgress: {},
      completedModules: new Set(),
      assessmentProgress: {},
      totalTimeSpent: 0,
      sessionStartTime: null,

      // Actions
      setLessonProgress: (lessonId, progress) => {
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: progress,
          },
        }));

        // Auto-complete if progress reaches 100%
        if (progress >= 100) {
          get().completeLesson(lessonId);
        }
      },

      completeLesson: (lessonId) => {
        set((state) => ({
          completedLessons: new Set([...state.completedLessons, lessonId]),
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: 100,
          },
        }));
      },

      setCurrentLesson: (lessonId) => {
        set({ currentLessonId: lessonId });
      },

      setModuleProgress: (moduleId, progress) => {
        set((state) => ({
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: progress,
          },
        }));

        // Auto-complete if progress reaches 100%
        if (progress >= 100) {
          get().completeModule(moduleId);
        }
      },

      completeModule: (moduleId) => {
        set((state) => ({
          completedModules: new Set([...state.completedModules, moduleId]),
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: 100,
          },
        }));
      },

      setAssessmentProgress: (moduleId, progress) => {
        set((state) => ({
          assessmentProgress: {
            ...state.assessmentProgress,
            [moduleId]: progress,
          },
        }));
      },

      startSession: () => {
        set({ sessionStartTime: Date.now() });
      },

      endSession: () => {
        const { sessionStartTime, totalTimeSpent } = get();
        if (sessionStartTime) {
          const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 60000);
          set({
            totalTimeSpent: totalTimeSpent + sessionDuration,
            sessionStartTime: null,
          });
        }
      },

      getTotalProgress: () => {
        const { lessonProgress } = get();
        const lessons = Object.keys(lessonProgress);

        if (lessons.length === 0) return 0;

        const totalProgress = lessons.reduce(
          (sum, lessonId) => sum + (lessonProgress[lessonId] || 0),
          0
        );

        return Math.round(totalProgress / lessons.length);
      },

      resetProgress: () => {
        set({
          lessonProgress: {},
          completedLessons: new Set(),
          currentLessonId: null,
          moduleProgress: {},
          completedModules: new Set(),
          assessmentProgress: {},
          totalTimeSpent: 0,
          sessionStartTime: null,
        });
      },
    }),
    {
      name: 'progress-storage',
      // Custom serialization for Sets
      partialize: (state) => ({
        ...state,
        completedLessons: Array.from(state.completedLessons),
        completedModules: Array.from(state.completedModules),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert arrays back to Sets
          state.completedLessons = new Set(state.completedLessons as any);
          state.completedModules = new Set(state.completedModules as any);
        }
      },
    }
  )
);
