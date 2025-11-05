import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Zap, Target } from 'lucide-react';
import { apiService } from '../services/api';
import { useCourseStore } from '../store/courseStore';

const HomePage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setCourseId, setIsGenerating } = useCourseStore();

  const exampleTopics = [
    'Linear Algebra for Machine Learning',
    'Quantum Computing Fundamentals',
    'Neural Networks from Scratch',
    'Cryptography Basics',
    'Graph Theory Applications',
    'Differential Equations',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await apiService.generateCourse({
        topic: topic.trim(),
        difficulty,
      });

      setCourseId(response.course_id);
      setIsGenerating(true);

      // Navigate to generation page
      navigate(`/generate/${response.course_id}`);
    } catch (err: any) {
      console.error('Error generating course:', err);
      setError(err.response?.data?.detail || 'Failed to start course generation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleTopic: string) => {
    setTopic(exampleTopic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-primary mr-3" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VisualStudy
            </h1>
          </div>

          <p className="text-2xl text-text-muted mb-8 max-w-3xl mx-auto">
            AI-powered interactive learning that makes complex topics
            <span className="text-primary font-semibold"> visual</span>,
            <span className="text-accent font-semibold"> engaging</span>, and
            <span className="text-secondary font-semibold"> unforgettable</span>
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="AI-Generated Courses"
              description="Comprehensive learning paths created by advanced AI"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Interactive Visualizations"
              description="Hands-on experiments that make concepts click"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Personalized Learning"
              description="Adaptive content tailored to your level"
            />
          </div>

          {/* Main Input */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-text">
                What do you want to learn today?
              </h2>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., Linear Algebra for Machine Learning"
                className="input-field mb-4 text-lg"
                disabled={isLoading}
              />

              {/* Difficulty Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-text">
                  Difficulty Level
                </label>
                <div className="flex gap-3 justify-center">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        difficulty === level
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      disabled={isLoading}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
                className="btn-primary w-full text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Course...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Generate Course
                  </>
                )}
              </button>
            </div>

            {/* Example Topics */}
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-4 text-text">
                Try one of these topics:
              </h3>
              <div className="flex flex-wrap gap-3">
                {exampleTopics.map((exampleTopic, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => handleExampleClick(exampleTopic)}
                    className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-primary font-medium border border-primary/20 hover:border-primary/40"
                    disabled={isLoading}
                  >
                    {exampleTopic}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card text-center"
    >
      <div className="text-primary mb-3 flex justify-center">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-text">{title}</h3>
      <p className="text-text-muted text-sm">{description}</p>
    </motion.div>
  );
};

export default HomePage;
