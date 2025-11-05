/**
 * Type definitions for course structures
 */

export interface Course {
  course_id: string;
  course_title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_total_hours: number;
  prerequisites: string[];
  learning_outcomes: string[];
  modules: Module[];
  created_at?: string;
  updated_at?: string;
}

export interface Module {
  module_id: number;
  title: string;
  description: string;
  duration_hours: number;
  learning_objectives: string[];
  key_concepts: string[];
  needs_visualization: boolean;
  visualization_suggestions: string[];
  lessons: Lesson[];
  completed?: boolean;
  progress?: number;
}

export interface Lesson {
  lesson_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  concepts_covered: string[];
  practical_applications: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed?: boolean;
  progress?: number;
}

export interface LessonContent {
  lesson_id: string;
  content: {
    introduction: string;
    main_explanation: string;
    interactive_prompt: string;
    key_takeaways: string[];
    further_exploration: string[];
  };
  component?: {
    filename: string;
    code: string;
    dependencies: string[];
    props_interface: string;
  };
  examples: Example[];
}

export interface Example {
  title: string;
  description: string;
  code: string;
}

export interface CourseGenerationRequest {
  topic: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  user_background?: string;
}

export interface CourseGenerationResponse {
  course_id: string;
  status: 'initiated' | 'in_progress' | 'completed' | 'failed';
  data?: any;
  progress?: {
    current_step: string;
    progress_percentage: number;
  };
}

export interface GenerationStatus {
  course_id: string;
  status: 'initiated' | 'in_progress' | 'completed' | 'failed';
  current_step: string;
  progress_percentage: number;
  messages: string[];
}
