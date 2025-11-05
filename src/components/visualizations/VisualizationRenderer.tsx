import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

// Dynamic imports for visualization components
const CodePlayground = lazy(() => import('./CodePlayground'));
const VectorVisualizer = lazy(() => import('./templates/VectorVisualizer'));

interface VisualizationSpec {
  visualization_type: string;
  concept: string;
  main_interaction?: any;
  code_playground?: {
    enabled: boolean;
    starter_code?: string;
  };
  implementation?: {
    technology: string;
    component_code?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface VisualizationRendererProps {
  spec: VisualizationSpec;
  lessonId: string;
}

const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({
  spec,
  lessonId,
}) => {
  // Render based on visualization type
  const renderVisualization = () => {
    // Code playground
    if (spec.code_playground?.enabled || spec.visualization_type === 'code_playground') {
      return (
        <CodePlayground
          starterCode={spec.code_playground?.starter_code || '# Write your Python code here\nprint("Hello, World!")'}
          enableVisualization={true}
        />
      );
    }

    // Vector visualization
    if (spec.concept?.toLowerCase().includes('vector') ||
        spec.visualization_type === 'vector_2d') {
      return <VectorVisualizer allowDrag={true} showResultant={true} showGrid={true} />;
    }

    // Detect from technology
    const tech = spec.implementation?.technology || '';

    if (tech.includes('pyodide') || tech.includes('python')) {
      return (
        <CodePlayground
          starterCode={spec.implementation?.component_code || '# Python code\nprint("Hello!")'}
        />
      );
    }

    // Default: Show coming soon with spec details
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Interactive Visualization
        </h3>
        <p className="text-gray-600 mb-4">
          {spec.concept || 'Concept Visualization'}
        </p>
        <div className="text-sm text-gray-500 mb-4">
          Type: {spec.visualization_type || 'Interactive'}
        </div>

        {/* Show interaction hints */}
        {spec.guidance_text && Array.isArray(spec.guidance_text) && (
          <div className="mt-6 space-y-2">
            {spec.guidance_text.map((text: string, index: number) => (
              <div key={index} className="text-left bg-white rounded-lg p-3 text-gray-700">
                💡 {text}
              </div>
            ))}
          </div>
        )}

        {/* Progressive steps */}
        {spec.progressive_steps && Array.isArray(spec.progressive_steps) && (
          <div className="mt-6 space-y-2">
            <div className="font-semibold text-gray-900 mb-2">Try this:</div>
            {spec.progressive_steps.map((step: any, index: number) => (
              <div key={index} className="text-left bg-white rounded-lg p-3">
                <div className="font-medium text-indigo-700">Step {step.step || index + 1}</div>
                <div className="text-gray-700">{step.prompt || step.interaction}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-400">
          Visualization ID: {lessonId}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 bg-gray-50 rounded-xl">
            <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading interactive visualization...</span>
          </div>
        }
      >
        {renderVisualization()}
      </Suspense>
    </motion.div>
  );
};

export default VisualizationRenderer;
