import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Target, CheckCircle, Lock } from 'lucide-react';
import { useCourseStore } from '../store/courseStore';
import { useProgressStore } from '../store/progressStore';

const CoursePage: React.FC = () => {
  const { courseId: _courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentCourse } = useCourseStore();
  const { moduleProgress, completedModules } = useProgressStore();

  if (!currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Course not found</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const totalLessons = currentCourse.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );

  const overallProgress = currentCourse.modules.length > 0
    ? currentCourse.modules.reduce(
        (sum, module) => sum + (moduleProgress[module.module_id] || 0),
        0
      ) / currentCourse.modules.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700/5 to-cyan-600/5">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-700/10 text-indigo-700 rounded-full text-sm font-medium">
                {currentCourse.difficulty}
              </span>
              <span className="px-3 py-1 bg-cyan-600/10 text-cyan-600 rounded-full text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentCourse.estimated_total_hours}h
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {currentCourse.course_title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {currentCourse.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Overall Progress</span>
              <span className="text-sm font-medium text-indigo-700">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-700 to-cyan-600 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard
              icon={<BookOpen />}
              label="Modules"
              value={currentCourse.modules.length}
            />
            <StatCard
              icon={<Target />}
              label="Lessons"
              value={totalLessons}
            />
            <StatCard
              icon={<CheckCircle />}
              label="Completed"
              value={completedModules.size}
            />
          </div>

          {/* Prerequisites */}
          {currentCourse.prerequisites.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {currentCourse.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white rounded-full text-sm text-gray-600"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Learning Outcomes */}
          {currentCourse.learning_outcomes.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">What You'll Learn</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {currentCourse.learning_outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Modules */}
        <div className="space-y-6">
          {currentCourse.modules.map((module, index) => {
            const isLocked = index > 0 && !completedModules.has(currentCourse.modules[index - 1].module_id);
            const progress = moduleProgress[module.module_id] || 0;
            const isCompleted = completedModules.has(module.module_id);

            return (
              <motion.div
                key={module.module_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-md overflow-hidden ${
                  isLocked ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-indigo-700">
                          {module.module_id}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {module.title}
                        </h2>
                        {isCompleted && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                        {isLocked && (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{module.description}</p>

                      {/* Module Progress */}
                      {!isLocked && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium text-indigo-700">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-full bg-indigo-700 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Learning Objectives */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Learning Objectives:
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {module.learning_objectives.map((objective, i) => (
                            <li key={i} className="text-sm text-gray-600">
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Lessons */}
                      <div className="grid md:grid-cols-2 gap-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.lesson_id}
                            onClick={() => {
                              if (!isLocked) {
                                navigate(`/lesson/${lesson.lesson_id}`);
                              }
                            }}
                            disabled={isLocked}
                            className={`text-left p-4 rounded-lg transition-all ${
                              isLocked
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-gray-50 hover:bg-indigo-700/10 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-indigo-700">
                                Lesson {lessonIndex + 1}
                              </span>
                              <Clock className="w-3 h-3 text-gray-600" />
                              <span className="text-xs text-gray-600">
                                {lesson.duration_minutes}min
                              </span>
                            </div>
                            <h5 className="font-semibold text-gray-900 mb-1">
                              {lesson.title}
                            </h5>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {lesson.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
}> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="text-indigo-700">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
};

export default CoursePage;
