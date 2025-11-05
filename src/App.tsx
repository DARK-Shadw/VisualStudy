import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CourseGenerationPage from './pages/CourseGenerationPage';
import CoursePage from './pages/CoursePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate/:courseId" element={<CourseGenerationPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
