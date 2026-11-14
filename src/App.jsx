import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Layers,
  BookOpen,
  Target,
  BarChart3,
  Sun,
  Moon,
  Plus,
  Settings,
} from 'lucide-react';

import { useAppData } from './hooks/useAppData';
import { nameInitials } from './lib/calculations';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import { SyllabusPlanner, AddCourseModal } from './components/SyllabusPlanner';
import { GoalsPlanner, AddGoalModal } from './components/GoalsPlanner';
import { Analytics } from './components/Analytics';
import { ProfileModal } from './components/ProfileModal';
import { Toast } from './components/ui';

export default function App() {
  const {
    courses,
    goals,
    user,
    stats,
    setupUser,
    updateUser,
    addCourse,
    deleteCourse,
    addUnit,
    deleteUnit,
    addTopic,
    deleteTopic,
    updateTopicStatus,
    addAssessment,
    deleteAssessment,
    addGoal,
    toggleGoal,
    deleteGoal,
    loadSample,
    resetAll,
  } = useAppData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  });
  const [toast, setToast] = useState(null);

  // Modals
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // First launch / no profile
  if (!user) {
    return (
      <SetupScreen
        onComplete={(info) => {
          setupUser(info);
          showToast(`Welcome to Syllabi, ${info.name}!`);
        }}
        onLoadSample={() => {
          loadSample();
          showToast('Sample curriculum loaded successfully.');
        }}
      />
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'syllabus', label: 'Syllabus Planner', icon: BookOpen },
    { id: 'goals', label: 'Goals & Tasks', icon: Target },
    { id: 'analytics', label: 'Marks & Analytics', icon: BarChart3 },
  ];

  return (
    <div className="app-shell min-h-screen font-sans flex flex-col lg:flex-row">
      {/* Toast notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Sidebar Navigation */}
      <aside className="app-sidebar w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Logo & Theme Toggle */}
          <div className="flex items-center justify-between px-2 py-2 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/25">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  Syllabi
                </h1>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Academic Planner
                </p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div
            onClick={() => setIsProfileOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsProfileOpen(true); }}
            className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
            title="Profile & Settings"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {nameInitials(user.name)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.semester || user.degree || 'Academic Profile'}
                </p>
              </div>
            </div>
            <Settings className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>{user.semester || 'Current Semester'}</span>
              <span>/</span>
              <span className="capitalize">{activeTab.replace('-', ' ')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {activeTab === 'dashboard' && 'Academic Overview'}
              {activeTab === 'syllabus' && 'Syllabus Planner'}
              {activeTab === 'goals' && 'Goals & Milestones'}
              {activeTab === 'analytics' && 'Marks & Estimated SGPA'}
            </h2>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddCourseOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-indigo-500/20"
            >
              <Target className="w-4 h-4" />
              <span>New Goal</span>
            </button>
          </div>
        </header>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <Dashboard
            courses={courses}
            goals={goals}
            stats={stats}
            onNavigate={setActiveTab}
            onToggleGoal={toggleGoal}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusPlanner
            courses={courses}
            onAddCourse={(course) => {
              addCourse(course);
              showToast(`Added course: ${course.name}`);
            }}
            onDeleteCourse={(id) => {
              deleteCourse(id);
              showToast('Course removed');
            }}
            onAddUnit={addUnit}
            onDeleteUnit={deleteUnit}
            onAddTopic={addTopic}
            onDeleteTopic={deleteTopic}
            onUpdateTopicStatus={updateTopicStatus}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsPlanner
            goals={goals}
            courses={courses}
            onAddGoal={(g) => {
              const res = addGoal(g);
              if (!res?.error) showToast('Goal created');
              return res;
            }}
            onToggleGoal={toggleGoal}
            onDeleteGoal={(id) => {
              deleteGoal(id);
              showToast('Goal removed');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            courses={courses}
            stats={stats}
            onAddAssessment={(courseId, assessment) => {
              const res = addAssessment(courseId, assessment);
              if (!res?.error) showToast('Assessment recorded');
              return res;
            }}
            onDeleteAssessment={(courseId, assessmentId) => {
              deleteAssessment(courseId, assessmentId);
              showToast('Assessment deleted');
            }}
          />
        )}
      </main>

      {/* Global Quick Action Modals */}
      {isAddCourseOpen && (
        <AddCourseModal
          onClose={() => setIsAddCourseOpen(false)}
          onAdd={(course) => {
            addCourse(course);
            showToast(`Added course: ${course.name}`);
          }}
        />
      )}

      {isAddGoalOpen && (
        <AddGoalModal
          courses={courses}
          onClose={() => setIsAddGoalOpen(false)}
          onAdd={(g) => {
            const res = addGoal(g);
            if (!res?.error) showToast('Goal created');
            return res;
          }}
        />
      )}

      {isProfileOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileOpen(false)}
          onUpdate={(patch) => {
            updateUser(patch);
            showToast('Profile updated');
          }}
          onLoadSample={() => {
            loadSample();
            showToast('Sample computer science syllabus loaded');
          }}
          onReset={() => {
            resetAll();
            showToast('All data has been reset');
          }}
        />
      )}
    </div>
  );
}
