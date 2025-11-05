/**
 * Course state management with Zustand
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course, GenerationStatus, LessonContent } from '../types/course.types';
import type { Visualization } from '../types/visualization.types';
import type { Assessment } from '../types/assessment.types';

interface CourseState {
  // Current course data
  currentCourse: Course | null;
  courseId: string | null;
  visualizations: Visualization[];
  lessons: LessonContent[];
  assessments: Assessment[];

  // Generation status
  generationStatus: GenerationStatus | null;
  isGenerating: boolean;

  // Actions
  setCurrentCourse: (course: Course) => void;
  setCourseId: (id: string) => void;
  setGenerationStatus: (status: GenerationStatus) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setVisualizations: (visualizations: Visualization[]) => void;
  setLessons: (lessons: LessonContent[]) => void;
  setAssessments: (assessments: Assessment[]) => void;
  updateLessonProgress: (lessonId: string, progress: number) => void;
  updateModuleProgress: (moduleId: number, progress: number) => void;
  clearCourse: () => void;
  setCourseData: (data: any) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCourse: null,
      courseId: null,
      visualizations: [],
      lessons: [],
      assessments: [],
      generationStatus: null,
      isGenerating: false,

      // Actions
      setCurrentCourse: (course) => set({ currentCourse: course }),

      setCourseId: (id) => set({ courseId: id }),

      setGenerationStatus: (status) => set({ generationStatus: status }),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setVisualizations: (visualizations) => set({ visualizations }),

      setLessons: (lessons) => set({ lessons }),

      setAssessments: (assessments) => set({ assessments }),

      updateLessonProgress: (lessonId, progress) => {
        const { currentCourse } = get();
        if (!currentCourse) return;

        const updatedModules = currentCourse.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.lesson_id === lessonId
              ? { ...lesson, progress, completed: progress >= 100 }
              : lesson
          ),
        }));

        set({
          currentCourse: {
            ...currentCourse,
            modules: updatedModules,
          },
        });
      },

      updateModuleProgress: (moduleId, progress) => {
        const { currentCourse } = get();
        if (!currentCourse) return;

        const updatedModules = currentCourse.modules.map(module =>
          module.module_id === moduleId
            ? { ...module, progress, completed: progress >= 100 }
            : module
        );

        set({
          currentCourse: {
            ...currentCourse,
            modules: updatedModules,
          },
        });
      },

      clearCourse: () =>
        set({
          currentCourse: null,
          courseId: null,
          visualizations: [],
          lessons: [],
          assessments: [],
          generationStatus: null,
          isGenerating: false,
        }),

      setCourseData: (data) => {
        // Set all course data from backend response
        if (data.curriculum) {
          set({
            currentCourse: {
              ...data.curriculum,
              course_id: get().courseId || '',
            },
          });
        }
        if (data.visualizations?.visualizations) {
          set({ visualizations: data.visualizations.visualizations });
        }
        if (data.lessons) {
          set({ lessons: data.lessons });
        }
        if (data.assessments) {
          set({ assessments: data.assessments });
        }
      },
    }),
    {
      name: 'course-storage',
      partialize: (state) => ({
        currentCourse: state.currentCourse,
        courseId: state.courseId,
      }),
    }
  )
);
