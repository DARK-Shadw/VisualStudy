/**
 * Type definitions for visualizations
 */

export interface Visualization {
  lesson_id: string;
  module_id: number;
  concept: string;
  viz_type: 'interactive_2d_canvas' | 'interactive_3d' | 'svg_diagram' | 'interactive_chart' | 'animation';
  technology: 'react-canvas' | 'three-js' | 'd3-js' | 'svg' | 'recharts';
  interactions: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  visual_elements: VisualElements;
  user_controls: UserControl[];
  code_structure: CodeStructure;
  learning_objectives: string[];
  progressive_steps: string[];
}

export interface VisualElements {
  objects: string[];
  colors: string[];
  animations: string[];
}

export interface UserControl {
  type: 'slider' | 'input' | 'button' | 'toggle' | 'dropdown';
  parameter: string;
  range?: {
    min: number;
    max: number;
  };
  default: number | string | boolean;
  description: string;
}

export interface CodeStructure {
  components: string[];
  state_management: string[];
  key_functions: string[];
}

export interface VisualizationProps {
  width?: number;
  height?: number;
  className?: string;
  onInteraction?: (data: any) => void;
}
