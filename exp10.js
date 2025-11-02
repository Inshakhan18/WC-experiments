App.js
 
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AICourseService } from "./services/AICourseService";
import LoadingSpinner from "./components/LoadingSpinner";
import CourseCard from "./components/CourseCard";
import CourseDetailModal from "./components/CourseDetailModal";
 
export default function AICourseGenerator() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [focusAreas, setFocusAreas] = useState(["technical", "practical"]);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("generate");
 
  useEffect(() => {
    loadSavedCourses();
  }, []);
 
  const loadSavedCourses = async () => {
    const courses = await AICourseService.getSavedCourses();
    setSavedCourses(courses);
  };
 
  const availableFocusAreas = [
    { id: "technical", name: "Technical", description: "Code-focused learning", icon: "💻" },
    { id: "theoretical", name: "Theoretical", description: "Concept deep-dive", icon: "📚" },
    { id: "practical", name: "Practical", description: "Real-world projects", icon: "🛠️" },
    { id: "creative", name: "Creative", description: "Innovation & design", icon: "🎨" }
  ];
 
  const toggleFocusArea = (areaId) => {
    setFocusAreas(prev =>
      prev.includes(areaId)
        ? prev.filter(area => area !== areaId)
        : [...prev, areaId]
    );
  };
 
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
   
    if (!topic.trim()) {
      setError("Please enter a course topic");
      return;
    }
 
    if (focusAreas.length === 0) {
      setError("Please select at least one focus area");
      return;
    }
 
    setIsLoading(true);
    setCourse(null);
 
    try {
      const result = await AICourseService.generateCourse({
        topic: topic.trim(),
        level,
        durationWeeks,
        focusAreas
      });
      setCourse(result);
      setActiveTab("preview");
    } catch (err) {
      setError("Failed to generate course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleSaveCourse = async () => {
    await loadSavedCourses();
    setSelectedCourse(null);
  };
 
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const result = await AICourseService.deleteCourse(courseId);
      if (result.success) {
        setSavedCourses(result.courses);
      }
    }
  };
 
  const handleProgressUpdate = async (courseId, progress) => {
    const result = await AICourseService.updateCourseProgress(courseId, { progress });
    if (result.success) {
      await loadSavedCourses();
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b23] via-[#1a0b3b] to-[#2d1b69] text-white">
      {/* Header */}
      <header className="border-b border-[#2b2b5b] bg-[#121228]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                AI Course Generator
              </h1>
              <p className="text-gray-400 text-sm">Create personalized learning journeys with AI</p>
            </div>
           
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("generate")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "generate"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Generate
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`px-4 py-2 rounded-lg transition-all relative ${
                  activeTab === "saved"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Saved Courses
                {savedCourses.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {savedCourses.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
 
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Generate Tab */}
        {activeTab === "generate" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Input Form */}
            <div className="bg-[#121228]/70 backdrop-blur-md rounded-3xl border border-[#2b2b5b] p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Course</h2>
 
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Machine Learning with React, Advanced Python..."
                    className="w-full px-4 py-3 bg-[#181832] text-white rounded-xl border border-[#2a2a4d] focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
 
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-[#181832] text-white rounded-xl border border-[#2a2a4d] focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
 
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration: {durationWeeks} weeks
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2 weeks</span>
                    <span>12 weeks</span>
                  </div>
                </div>
 
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Focus Areas ({focusAreas.length}/4 selected)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableFocusAreas.map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleFocusArea(area.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          focusAreas.includes(area.id)
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-[#2a2a4d] bg-[#181832] hover:border-purple-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{area.icon}</span>
                          <div>
                            <div className="font-medium text-white">{area.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{area.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
 
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
 
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating Course...
                    </span>
                  ) : (
                    "Generate Course with AI"
                  )}
                </button>
              </form>
            </div>
 
            {/* Preview Panel */}
            <div className="bg-[#121228]/70 backdrop-blur-md rounded-3xl border border-[#2b2b5b] p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Course Preview</h2>
             
              {isLoading && <LoadingSpinner />}
             
              {course && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-[#0f0f24] p-6 rounded-2xl border border-[#2a2a4d]">
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">{course.title}</h3>
                    <p className="text-gray-400 mb-4">{course.description}</p>
                   
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`level-badge ${course.level.toLowerCase()}`}>
                        {course.level}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {course.duration} weeks
                      </span>
                      {course.focusAreas.map((area, index) => (
                        <span key={index} className={`focus-tag ${area}`}>
                          {area}
                        </span>
                      ))}
                    </div>
 
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                    >
                      View Full Course Details
                    </button>
                  </div>
                </motion.div>
              )}
 
              {!course && !isLoading && (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <p>Configure your course settings and generate a personalized learning plan</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
 
        {/* Saved Courses Tab */}
        {activeTab === "saved" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Saved Courses</h2>
              <span className="text-gray-400">
                {savedCourses.length} course{savedCourses.length !== 1 ? 's' : ''} saved
              </span>
            </div>
 
            {savedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {savedCourses.map((savedCourse) => (
                    <CourseCard
                      key={savedCourse.id}
                      course={savedCourse}
                      onDelete={handleDeleteCourse}
                      onSelect={setSelectedCourse}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 bg-[#121228] rounded-2xl">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No saved courses yet</h3>
                <p className="text-gray-400 mb-6">Generate and save your first AI-powered course!</p>
                <button
                  onClick={() => setActiveTab("generate")}
                  className="btn-primary"
                >
                  Create Your First Course
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
 
      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            onSave={handleSaveCourse}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
 
App.css
.App {
  text-align: center;
}
 
.App-logo {
  height: 40vmin;
  pointer-events: none;
}
 
@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}
 
.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}
 
.App-link {
  color: #61dafb;
}
 
@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
 
 
Components
1.CourseCard.js
import React from 'react';
import { motion } from 'framer-motion';
 
const CourseCard = ({ course, onDelete, onSelect }) => {
  const progress = course.progress || 0;
 
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-[#121228] border border-[#2b2b5b] rounded-2xl p-6 hover:border-purple-500 transition-all duration-300 group cursor-pointer"
      onClick={() => onSelect(course)}
    >
      {progress > 0 && (
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
 
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(course.id);
          }}
          className="text-red-400 hover:text-red-300 transition-colors p-1 ml-2"
          title="Delete Course"
        >
          ✕
        </button>
      </div>
     
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`level-badge ${course.level.toLowerCase()}`}>
          {course.level}
        </span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
          {course.duration} weeks
        </span>
        {course.focusAreas.map((area, index) => (
          <span key={index} className={`focus-tag ${area}`}>
            {area}
          </span>
        ))}
      </div>
 
      <div className="flex justify-between items-center">
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors">
          {progress > 0 ? `Continue (${progress}%)` : 'Start Learning'}
        </button>
        <span className="text-gray-500 text-sm">
          {new Date(course.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};
 
export default CourseCard;
 
2.CourseDetailModal.js
 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AICourseService } from '../services/AICourseService';
 
const CourseDetailModal = ({ course, onClose, onSave, onProgressUpdate }) => {
  const [activeWeek, setActiveWeek] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});
  const [isSaved, setIsSaved] = useState(false);
 
  const handleSave = async () => {
    const result = await AICourseService.saveCourse(course);
    if (result.success) {
      setIsSaved(true);
      onSave?.();
      setTimeout(() => setIsSaved(false), 2000);
    }
  };
 
  const toggleLessonComplete = async (weekIndex, lessonIndex) => {
    const weekKey = `week_${weekIndex}`;
    const newCompletedLessons = { ...completedLessons };
   
    if (!newCompletedLessons[weekKey]) {
      newCompletedLessons[weekKey] = [];
    }
   
    const isCompleted = newCompletedLessons[weekKey].includes(lessonIndex);
    if (isCompleted) {
      newCompletedLessons[weekKey] = newCompletedLessons[weekKey].filter(i => i !== lessonIndex);
    } else {
      newCompletedLessons[weekKey] = [...newCompletedLessons[weekKey], lessonIndex];
    }
   
    setCompletedLessons(newCompletedLessons);
   
    const totalLessons = course.outline.reduce((sum, week) => sum + week.lessons.length, 0);
    const completedCount = Object.values(newCompletedLessons).flat().length;
    const progress = Math.round((completedCount / totalLessons) * 100);
   
    onProgressUpdate?.(course.id, progress);
  };
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0f0f24] border border-[#2b2b5b] rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{course.title}</h2>
              <p className="text-gray-400">{course.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors ml-4"
            >
              ✕
            </button>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#121228] p-4 rounded-xl">
              <h4 className="font-semibold text-white mb-2">Course Info</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Level: {course.level}</p>
                <p>Duration: {course.duration} weeks</p>
                <p>Focus Areas: {course.focusAreas.join(", ")}</p>
              </div>
            </div>
           
            <div className="bg-[#121228] p-4 rounded-xl">
              <h4 className="font-semibold text-white mb-2">Prerequisites</h4>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
           
            <div className="bg-[#121228] p-4 rounded-xl">
              <h4 className="font-semibold text-white mb-2">Learning Outcomes</h4>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                {course.outcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            </div>
          </div>
 
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
            {course.outline.map((week, index) => (
              <button
                key={week.week}
                onClick={() => setActiveWeek(index)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeWeek === index
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#121228] text-gray-400 hover:bg-[#1a1a3a]'
                }`}
              >
                Week {week.week}
              </button>
            ))}
          </div>
 
          <div className="space-y-6">
            {course.outline.slice(activeWeek, activeWeek + 1).map((week) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#121228] border border-[#2b2b5b] rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h4 className="text-2xl font-semibold text-white mb-2">{week.title}</h4>
                    <p className="text-gray-400">{week.description}</p>
                  </div>
                  <div className="text-right text-sm text-gray-400 ml-4">
                    <p>{week.duration}</p>
                    <p>{week.difficulty}</p>
                  </div>
                </div>
               
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-semibold text-gray-300 mb-4 text-lg">Lessons & Activities</h5>
                    <ul className="space-y-3">
                      {week.lessons.map((lesson, index) => {
                        const weekKey = `week_${week.week}`;
                        const isCompleted = completedLessons[weekKey]?.includes(index) || false;
                        return (
                          <li key={index} className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => toggleLessonComplete(week.week, index)}
                              className="mt-1 text-purple-500 rounded focus:ring-purple-500"
                            />
                            <span className={`flex-1 ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                              {lesson}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                 
                  <div>
                    <h5 className="font-semibold text-gray-300 mb-4 text-lg">Resources & Materials</h5>
                    <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
                      {week.resources.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
 
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isSaved}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              {isSaved ? '✓ Saved' : '💾 Save Course'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
 
export default CourseDetailModal;
