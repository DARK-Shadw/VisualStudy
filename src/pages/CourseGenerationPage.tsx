import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Loader, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import { useCourseStore } from '../store/courseStore';
import type { GenerationStatus } from '../types/course.types';

const CourseGenerationPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const {
    setGenerationStatus,
    setIsGenerating,
    setCourseData,
    currentCourse,
  } = useCourseStore();

  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      navigate('/');
      return;
    }

    const pollGeneration = async () => {
      try {
        const courseData = await apiService.pollCourseGeneration(
          courseId,
          (progressStatus) => {
            setStatus(progressStatus);
            setGenerationStatus(progressStatus);
          }
        );

        // Generation complete
        setIsGenerating(false);
        setCourseData(courseData.data);

        // Navigate to course page after a short delay
        setTimeout(() => {
          navigate(`/course/${courseId}`);
        }, 2000);
      } catch (err: any) {
        console.error('Generation error:', err);
        setError(err.message || 'Failed to generate course');
        setIsGenerating(false);
      }
    };

    pollGeneration();
  }, [courseId, navigate, setGenerationStatus, setIsGenerating, setCourseData]);

  const steps = [
    { name: 'Analyzing topic', key: 'analyzing' },
    { name: 'Creating syllabus', key: 'syllabus' },
    { name: 'Designing visualizations', key: 'visualizations' },
    { name: 'Generating content', key: 'content' },
    { name: 'Creating assessments', key: 'assessments' },
    { name: 'Finalizing', key: 'finalizing' },
  ];

  const getCurrentStepIndex = () => {
    if (!status) return 0;
    const currentStep = status.current_step.toLowerCase();

    if (currentStep.includes('analyzing') || currentStep.includes('initiated')) return 0;
    if (currentStep.includes('curriculum') || currentStep.includes('syllabus')) return 1;
    if (currentStep.includes('visualization')) return 2;
    if (currentStep.includes('content') || currentStep.includes('generating')) return 3;
    if (currentStep.includes('assessment')) return 4;
    if (currentStep.includes('finalizing') || currentStep.includes('completed')) return 5;

    return Math.floor((status.progress_percentage / 100) * steps.length);
  };

  const currentStepIndex = getCurrentStepIndex();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700/5 to-cyan-600/5 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-red-500 text-5xl mb-4">✗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700/5 via-background to-cyan-600/5">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-indigo-700 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Creating Your Course
            </h1>
            <p className="text-xl text-gray-600">
              Our AI agents are working together to build your personalized learning experience
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {status?.current_step || 'Initializing...'}
                </span>
                <span className="text-sm font-medium text-indigo-700">
                  {status?.progress_percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-700 to-cyan-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${status?.progress_percentage || 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <StepItem
                  key={step.key}
                  name={step.name}
                  isComplete={index < currentStepIndex}
                  isActive={index === currentStepIndex}
                  isPending={index > currentStepIndex}
                />
              ))}
            </div>
          </div>

          {/* Messages */}
          {status && status.messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Activity Log</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {status.messages.slice().reverse().map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{message}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StepItem: React.FC<{
  name: string;
  isComplete: boolean;
  isActive: boolean;
  isPending: boolean;
}> = ({ name, isComplete, isActive, isPending }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4"
    >
      <div className="flex-shrink-0">
        {isComplete && (
          <CheckCircle className="w-8 h-8 text-green-500" />
        )}
        {isActive && (
          <Loader className="w-8 h-8 text-indigo-700 animate-spin" />
        )}
        {isPending && (
          <Circle className="w-8 h-8 text-gray-300" />
        )}
      </div>
      <div className="flex-grow">
        <span
          className={`font-medium ${
            isComplete ? 'text-green-500' :
            isActive ? 'text-indigo-700' :
            'text-gray-400'
          }`}
        >
          {name}
        </span>
      </div>
    </motion.div>
  );
};

export default CourseGenerationPage;
