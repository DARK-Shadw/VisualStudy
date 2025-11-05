import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { useCourseStore } from '../store/courseStore';
import { useProgressStore } from '../store/progressStore';

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { currentCourse, lessons } = useCourseStore();
  const { setLessonProgress, completeLesson, lessonProgress } = useProgressStore();

  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);

  useEffect(() => {
    if (!currentCourse || !lessonId) {
      navigate('/');
      return;
    }

    // Find the lesson in the course
    let foundLesson = null;
    let foundModule = null;

    for (const module of currentCourse.modules) {
      const lesson = module.lessons.find((l: any) => l.lesson_id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        foundModule = module;
        break;
      }
    }

    if (!foundLesson) {
      navigate(`/course/${currentCourse.course_id}`);
      return;
    }

    setCurrentLesson(foundLesson);
    setCurrentModule(foundModule);

    // Find lesson content
    const content = lessons.find((l: any) => l.lesson_id === lessonId);
    setLessonContent(content);

    // Mark as in progress
    if (!lessonProgress[lessonId]) {
      setLessonProgress(lessonId, 10);
    }
  }, [lessonId, currentCourse, lessons, navigate, lessonProgress, setLessonProgress]);

  const handleComplete = () => {
    if (lessonId) {
      completeLesson(lessonId);
      setLessonProgress(lessonId, 100);
    }
  };

  const handleNext = () => {
    if (!currentCourse || !currentModule || !currentLesson) return;

    // Find next lesson
    const currentModuleIndex = currentCourse.modules.findIndex(
      (m: any) => m.module_id === currentModule.module_id
    );
    const currentLessonIndex = currentModule.lessons.findIndex(
      (l: any) => l.lesson_id === lessonId
    );

    // Check if there's a next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[currentLessonIndex + 1];
      navigate(`/lesson/${nextLesson.lesson_id}`);
    } else if (currentModuleIndex < currentCourse.modules.length - 1) {
      // Move to first lesson of next module
      const nextModule = currentCourse.modules[currentModuleIndex + 1];
      if (nextModule.lessons.length > 0) {
        navigate(`/lesson/${nextModule.lessons[0].lesson_id}`);
      }
    } else {
      // Last lesson - go back to course
      navigate(`/course/${currentCourse.course_id}`);
    }
  };

  const handlePrevious = () => {
    if (!currentCourse || !currentModule || !currentLesson) return;

    const currentModuleIndex = currentCourse.modules.findIndex(
      (m: any) => m.module_id === currentModule.module_id
    );
    const currentLessonIndex = currentModule.lessons.findIndex(
      (l: any) => l.lesson_id === lessonId
    );

    // Check if there's a previous lesson in current module
    if (currentLessonIndex > 0) {
      const prevLesson = currentModule.lessons[currentLessonIndex - 1];
      navigate(`/lesson/${prevLesson.lesson_id}`);
    } else if (currentModuleIndex > 0) {
      // Move to last lesson of previous module
      const prevModule = currentCourse.modules[currentModuleIndex - 1];
      if (prevModule.lessons.length > 0) {
        const lastLesson = prevModule.lessons[prevModule.lessons.length - 1];
        navigate(`/lesson/${lastLesson.lesson_id}`);
      }
    }
  };

  if (!currentLesson || !currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const isCompleted = lessonProgress[lessonId] === 100;
  const progress = lessonProgress[lessonId] || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/course/${currentCourse?.course_id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Course
            </button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Module {currentModule.module_id}: {currentModule.title}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="h-full bg-indigo-700 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-indigo-700">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Lesson Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-700" />
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentLesson.title}
                </h1>
                <p className="text-gray-600">{currentLesson.description}</p>
              </div>
              {isCompleted && (
                <CheckCircle className="w-8 h-8 text-green-500" />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>⏱️ {currentLesson.duration_minutes} min</span>
              <span>📊 {currentLesson.difficulty}</span>
            </div>
          </motion.div>

          {/* Lesson Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-8 mb-8"
          >
            {lessonContent ? (
              <div className="prose max-w-none">
                {/* Introduction */}
                {lessonContent.content?.introduction && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Introduction</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {lessonContent.content.introduction}
                    </p>
                  </div>
                )}

                {/* Main Explanation */}
                {lessonContent.content?.main_explanation && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Understanding the Concept</h2>
                    <div
                      className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: lessonContent.content.main_explanation }}
                    />
                  </div>
                )}

                {/* Interactive Prompt */}
                {lessonContent.content?.interactive_prompt && (
                  <div className="mb-6 p-4 bg-cyan-50 border-l-4 border-cyan-600 rounded">
                    <p className="text-cyan-900 font-medium">
                      💡 {lessonContent.content.interactive_prompt}
                    </p>
                  </div>
                )}

                {/* Key Takeaways */}
                {lessonContent.content?.key_takeaways && lessonContent.content.key_takeaways.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Key Takeaways</h2>
                    <ul className="list-disc list-inside space-y-2">
                      {lessonContent.content.key_takeaways.map((takeaway: string, index: number) => (
                        <li key={index} className="text-gray-700">
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Content is being generated...</p>
                <p className="text-sm text-gray-500">
                  Lesson: {currentLesson.title}
                </p>
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Concepts Covered:</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentLesson.concepts_covered?.map((concept: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-3">
              {!isCompleted && (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark Complete
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-md"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
