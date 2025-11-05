/**
 * Type definitions for assessments
 */

export interface Assessment {
  module_id: number;
  assessments: Question[];
  mini_project: MiniProject;
}

export interface Question {
  question_id: string;
  question_type: 'multiple_choice' | 'interactive' | 'open_ended' | 'code';
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  visual_context?: string;
  options?: QuestionOption[];
  interactive_component?: InteractiveComponent;
  hints: Hint[];
  correct_feedback: string;
  incorrect_feedback: string;
  concepts_tested: string[];
  estimated_time_minutes: number;
  user_answer?: string;
  is_correct?: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
  explanation: string;
}

export interface InteractiveComponent {
  type: string;
  specification: any;
}

export interface Hint {
  level: number;
  text: string;
  revealed?: boolean;
}

export interface MiniProject {
  title: string;
  description: string;
  requirements: string[];
  starter_code?: string;
  success_criteria: string[];
  estimated_time_minutes: number;
  submitted?: boolean;
  user_submission?: string;
}

export interface AssessmentProgress {
  module_id: number;
  total_questions: number;
  completed_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_spent_minutes: number;
}
