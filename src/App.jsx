import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  BarChart3,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  ChevronRight,
  ChevronDown,
  Target,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  CheckSquare,
  Square,
  Layers,
  BrainCircuit,
  MessageSquare,
  Send,
  PieChart,
  Moon,
  Sun,
  X,
  FileText,
  UserCheck
} from 'lucide-react';

// Initial Mock Dataset structured directly according to SRS specifications
const INITIAL_DATA = {
  user: {
    name: "Alex Morgan",
    email: "alex.morgan@university.edu",
    degree: "B.Tech Computer Science & Engineering",
    currentSemesterId: "sem-5"
  },
  semesters: [
    { id: "sem-4", name: "Semester 4", status: "Completed", sgpa: 8.4, cgpa: 8.2 },
    { id: "sem-5", name: "Semester 5 (Current)", status: "Active", sgpa: 8.75, cgpa: 8.35 }
  ],
  courses: [
    {
      id: "c-101",
      semId: "sem-5",
      code: "CS501",
      name: "Database Management Systems",
      credits: 4,
      category: "Core",
      color: "border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400",
      accent: "bg-indigo-600",
      units: [
        {
          id: "u-101-1",
          name: "Unit 1: Introduction & Data Models",
          topics: [
            { id: "t-1", name: "ER Diagrams & Relational Model", status: "Completed", plannedDate: "2026-10-10" },
            { id: "t-2", name: "Relational Algebra", status: "Completed", plannedDate: "2026-10-15" }
          ]
        },
        {
          id: "u-101-2",
          name: "Unit 2: SQL & Normalization",
          topics: [
            { id: "t-3", name: "Complex SQL Queries & Joins", status: "Completed", plannedDate: "2026-10-22" },
            { id: "t-4", name: "1NF, 2NF, 3NF & BCNF Normalization", status: "In Progress", plannedDate: "2026-11-12" },
            { id: "t-5", name: "Lossless Join Decomposition", status: "Not Started", plannedDate: "2026-11-18" }
          ]
        },
        {
          id: "u-101-3",
          name: "Unit 3: Transaction Management",
          topics: [
            { id: "t-6", name: "ACID Properties & Concurrency Control", status: "Not Started", plannedDate: "2026-11-25" },
            { id: "t-7", name: "Deadlock Handling & Recovery", status: "Not Started", plannedDate: "2026-12-02" }
          ]
        }
      ],
      assessments: [
        { id: "a-1", name: "Internal Assessment 1", maxMarks: 30, obtainedMarks: 26, weightage: 20 },
        { id: "a-2", name: "Mid-Term Exam", maxMarks: 50, obtainedMarks: 41, weightage: 30 },
        { id: "a-3", name: "End-Semester Practical", maxMarks: 20, obtainedMarks: 18, weightage: 10 }
      ]
    },
    {
      id: "c-102",
      semId: "sem-5",
      code: "CS502",
      name: "Operating Systems & Architecture",
      credits: 4,
      category: "Core",
      color: "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
      accent: "bg-purple-600",
      units: [
        {
          id: "u-102-1",
          name: "Unit 1: Process Synchronization",
          topics: [
            { id: "t-8", name: "Semaphores & Mutex Locks", status: "Completed", plannedDate: "2026-10-12" },
            { id: "t-9", name: "Classical Synchronization Problems", status: "Completed", plannedDate: "2026-10-18" }
          ]
        },
        {
          id: "u-102-2",
          name: "Unit 2: Memory Management",
          topics: [
            { id: "t-10", name: "Paging & Segmentation", status: "In Progress", plannedDate: "2026-11-05" },
            { id: "t-11", name: "Virtual Memory & Page Replacement Algorithms", status: "Not Started", plannedDate: "2026-11-20" }
          ]
        }
      ],
      assessments: [
        { id: "a-4", name: "Internal Assessment 1", maxMarks: 30, obtainedMarks: 22, weightage: 20 },
        { id: "a-5", name: "Mid-Term Exam", maxMarks: 50, obtainedMarks: 35, weightage: 30 }
      ]
    },
    {
      id: "c-103",
      semId: "sem-5",
      code: "CS503",
      name: "Design & Analysis of Algorithms",
      credits: 4,
      category: "Core",
      color: "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
      accent: "bg-amber-500",
      units: [
        {
          id: "u-103-1",
          name: "Unit 1: Dynamic Programming",
          topics: [
            { id: "t-12", name: "0/1 Knapsack Problem", status: "Completed", plannedDate: "2026-10-14" },
            { id: "t-13", name: "Longest Common Subsequence", status: "Completed", plannedDate: "2026-10-20" }
          ]
        },
        {
          id: "u-103-2",
          name: "Unit 2: Graph Algorithms",
          topics: [
            { id: "t-14", name: "Dijkstra & Bellman-Ford Shortest Paths", status: "In Progress", plannedDate: "2026-11-10" },
            { id: "t-15", name: "Minimum Spanning Trees (Kruskal/Prims)", status: "Not Started", plannedDate: "2026-11-24" }
          ]
        }
      ],
      assessments: [
        { id: "a-6", name: "Internal Assessment 1", maxMarks: 30, obtainedMarks: 27, weightage: 20 },
        { id: "a-7", name: "Mid-Term Exam", maxMarks: 50, obtainedMarks: 44, weightage: 30 }
      ]
    },
    {
      id: "c-104",
      semId: "sem-5",
      code: "CS504",
      name: "Computer Networks",
      credits: 3,
      category: "Core",
      color: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
      accent: "bg-emerald-600",
      units: [
        {
          id: "u-104-1",
          name: "Unit 1: Transport & Network Layer Protocols",
          topics: [
            { id: "t-16", name: "TCP Handshake & Flow Control", status: "Completed", plannedDate: "2026-10-25" },
            { id: "t-17", name: "IPv4/IPv6 Addressing & Subnetting", status: "In Progress", plannedDate: "2026-11-14" }
          ]
        }
      ],
      assessments: [
        { id: "a-8", name: "Internal Assessment 1", maxMarks: 30, obtainedMarks: 24, weightage: 20 }
      ]
    }
  ],
  goals: [
    { id: "g-1", title: "Complete Normalization (3NF & BCNF) notes", category: "Daily", deadline: "2026-11-12", completed: false, courseId: "c-101" },
    { id: "g-2", title: "Practice 10 Dynamic Programming Problems", category: "Weekly", deadline: "2026-11-15", completed: true, courseId: "c-103" },
    { id: "g-3", title: "Implement Semaphore Code in C/C++", category: "Weekly", deadline: "2026-11-18", completed: false, courseId: "c-102" },
    { id: "g-4", title: "Revise TCP/IP Subnetting numericals", category: "Monthly", deadline: "2026-11-30", completed: false, courseId: "c-104" }
  ]
};

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Modals state
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddAssessmentOpen, setIsAddAssessmentOpen] = useState(false);
  const [selectedCourseForAssessment, setSelectedCourseForAssessment] = useState(null);
  const [selectedCourseForGoal, setSelectedCourseForGoal] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const [isAddingSubjectForGoal, setIsAddingSubjectForGoal] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Trigger Toast Notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Synchronize Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Derived Calculations according to SRS Rules
  const courses = data.courses;
  
  const getCourseCompletion = (course) => {
    let totalTopics = 0;
    let completedTopics = 0;
    course.units.forEach(unit => {
      unit.topics.forEach(topic => {
        totalTopics++;
        if (topic.status === 'Completed') completedTopics++;
      });
    });
    return totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
  };

  const getGoalProgress = (goal) => {
    if (goal.completed) return 100;
    const course = courses.find(item => item.id === goal.courseId);
    return course ? Math.min(99, getCourseCompletion(course)) : 0;
  };

  const openAddGoal = () => {
    setSelectedCourseForGoal(null);
    setSubjectSearch('');
    setIsSubjectMenuOpen(false);
    setIsAddGoalOpen(true);
  };

  const overallProgress = useMemo(() => {
    let totalTopics = 0;
    let completedTopics = 0;
    courses.forEach(course => {
      course.units.forEach(unit => {
        unit.topics.forEach(topic => {
          totalTopics++;
          if (topic.status === 'Completed') completedTopics++;
        });
      });
    });
    return totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
  }, [courses]);

  const totalPendingTopics = useMemo(() => {
    let count = 0;
    courses.forEach(c => c.units.forEach(u => u.topics.forEach(t => {
      if (t.status !== 'Completed') count++;
    })));
    return count;
  }, [courses]);

  const calculateCourseScore = (course) => {
    if (!course.assessments || course.assessments.length === 0) return 0;
    let totalObtained = 0;
    let totalMax = 0;
    course.assessments.forEach(a => {
      totalObtained += Number(a.obtainedMarks);
      totalMax += Number(a.maxMarks);
    });
    return totalMax === 0 ? 0 : Math.round((totalObtained / totalMax) * 100);
  };

  const calculatedSgpa = useMemo(() => {
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    courses.forEach(c => {
      const percentage = calculateCourseScore(c);
      let gradePoint = 0;
      if (percentage >= 90) gradePoint = 10;
      else if (percentage >= 80) gradePoint = 9;
      else if (percentage >= 70) gradePoint = 8;
      else if (percentage >= 60) gradePoint = 7;
      else if (percentage >= 50) gradePoint = 6;
      else if (percentage >= 40) gradePoint = 5;
      else gradePoint = 0;

      totalWeightedPoints += gradePoint * c.credits;
      totalCredits += c.credits;
    });

    return totalCredits === 0 ? 0 : (totalWeightedPoints / totalCredits).toFixed(2);
  }, [courses]);

  // Topic Status Toggle Action (Dynamic Recalculation)
  const handleUpdateTopicStatus = (courseId, unitId, topicId, newStatus) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(course => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          units: course.units.map(unit => {
            if (unit.id !== unitId) return unit;
            return {
              ...unit,
              topics: unit.topics.map(topic => {
                if (topic.id !== topicId) return topic;
                return { ...topic, status: newStatus };
              })
            };
          })
        };
      })
    }));
    showToast(`Topic updated to "${newStatus}"`);
  };

  // Add Goal Handler
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!selectedCourseForGoal || !courses.some(course => course.id === selectedCourseForGoal)) {
      showToast("Select a subject for this goal.", "error");
      return;
    }

    const formData = new FormData(e.target);
    const newGoal = {
      id: `g-${Date.now()}`,
      title: formData.get('title'),
      category: formData.get('category'),
      deadline: formData.get('deadline'),
      courseId: selectedCourseForGoal,
      completed: false
    };
    setData(prev => ({ ...prev, goals: [newGoal, ...prev.goals] }));
    setIsAddGoalOpen(false);
    setSelectedCourseForGoal(null);
    setSubjectSearch('');
    showToast("Goal created successfully!");
  };

  // Toggle Goal
  const handleToggleGoal = (id) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
    }));
  };

  // Delete Goal
  const handleDeleteGoal = (id) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
    showToast("Goal removed", "info");
  };

  // Add New Course/Subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCourse = {
      id: `c-${Date.now()}`,
      semId: "sem-5",
      code: formData.get('code').toUpperCase(),
      name: formData.get('name'),
      credits: Number(formData.get('credits')),
      category: formData.get('category'),
      color: "border-cyan-500 text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400",
      accent: "bg-cyan-600",
      units: [
        {
          id: `u-${Date.now()}-1`,
          name: "Unit 1: Core Fundamentals",
          topics: [
            { id: `t-${Date.now()}-1`, name: "Introduction to Syllabus Core Concepts", status: "Not Started", plannedDate: formData.get('startDate') || "2026-11-20" }
          ]
        }
      ],
      assessments: []
    };
    setData(prev => ({ ...prev, courses: [...prev.courses, newCourse] }));
    if (isAddingSubjectForGoal) {
      setSelectedCourseForGoal(newCourse.id);
      setSubjectSearch(newCourse.name);
      setIsSubjectMenuOpen(false);
      setIsAddingSubjectForGoal(false);
    }
    setIsAddSubjectOpen(false);
    showToast("Subject & Syllabus framework created!");
  };

  // Add Assessment Entry
  const handleAddAssessment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseId = selectedCourseForAssessment;
    const newAssessment = {
      id: `a-${Date.now()}`,
      name: formData.get('name'),
      maxMarks: Number(formData.get('maxMarks')),
      obtainedMarks: Number(formData.get('obtainedMarks')),
      weightage: Number(formData.get('weightage'))
    };

    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === courseId ? { ...c, assessments: [...c.assessments, newAssessment] } : c)
    }));
    setIsAddAssessmentOpen(false);
    showToast("Assessment score recorded!");
  };

  const completedGoals = data.goals.filter(goal => goal.completed).length;
  const activeGoals = data.goals.length - completedGoals;
  const goalCompletion = data.goals.length === 0
    ? 0
    : Math.round((completedGoals / data.goals.length) * 100);

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200 flex flex-col lg:flex-row`}>
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-700 dark:border-slate-300 animate-bounce">
          <Sparkles className="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-md flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Logo Header */}
          <div className="flex items-center justify-between px-3 py-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none tracking-tight">Syllabi</h1>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Academic Planner v1.0</span>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layers },
              { id: 'syllabus', label: 'Syllabus Planner', icon: BookOpen },
              { id: 'progress', label: 'Academic Progress', icon: TrendingUp },
              { id: 'goals', label: 'Goals & Tasks', icon: Target },
              { id: 'analytics', label: 'Marks & Analytics', icon: BarChart3 },
              { id: 'ai-assistant', label: 'AI Study Assistant', icon: BrainCircuit, badge: 'SRS Appendix B' }
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${active ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                AM
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate leading-snug">{data.user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{data.user.degree}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* TOP TOOLBAR / BREADCRUMB */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Semester 5</span>
              <span>/</span>
              <span className="capitalize">{activeTab.replace('-', ' ')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activeTab === 'dashboard' && 'Personalized Academic Dashboard'}
              {activeTab === 'syllabus' && 'Syllabus Breakdown & Course Planning'}
              {activeTab === 'progress' && 'Academic Progress Tracking'}
              {activeTab === 'goals' && 'Goals & Task Schedule'}
              {activeTab === 'analytics' && 'Marks Entry & Grade Analytics'}
              {activeTab === 'ai-assistant' && 'AI Academic Assistant'}
            </h2>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddSubjectOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-medium text-sm transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
            <button
              onClick={openAddGoal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-500/20"
            >
              <Target className="w-4 h-4" />
              <span>New Goal</span>
            </button>
          </div>
        </header>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Syllabus Complete</span>
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{overallProgress}%</span>
                  <span className="text-xs font-medium text-emerald-500">Live Calculated</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Est. Semester SGPA</span>
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{calculatedSgpa}</span>
                  <span className="text-xs font-medium text-slate-500">/ 10.0</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Target CGPA: 8.5+</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Topics</span>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{totalPendingTopics}</span>
                  <span className="text-xs font-medium text-amber-500">Topics Left</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Across {courses.length} active courses</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-purple-100 dark:border-purple-900/50 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Goals</span>
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{activeGoals}</span>
                  <span className="text-xs font-medium text-purple-500">Unfinished</span>
                </div>
                <div className="flex items-center justify-between mt-3 mb-1.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{completedGoals} of {data.goals.length} goals completed</p>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-300">{goalCompletion}%</span>
                </div>
                <div
                  className="w-full bg-purple-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label="Overall goal completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={goalCompletion}
                >
                  <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-500" style={{ width: `${goalCompletion}%` }} />
                </div>
              </div>
            </div>

            {/* SUBJECT PROGRESS BREAKDOWN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Subject Progress Summary</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Calculated dynamically from syllabus topics</p>
                  </div>
                  <button onClick={() => setActiveTab('syllabus')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    Manage Syllabus <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {courses.map(course => {
                    const comp = getCourseCompletion(course);
                    return (
                      <div key={course.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${course.color}`}>
                              {course.code}
                            </span>
                            <span className="font-semibold text-sm">{course.name}</span>
                          </div>
                          <span className="font-bold text-sm">{comp}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className={`${course.accent} h-full rounded-full transition-all duration-300`} style={{ width: `${comp}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                          <span>{course.units.length} Units</span>
                          <span>{course.units.reduce((acc, u) => acc + u.topics.length, 0)} Topics Total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* UPCOMING DEADLINES & ACTIVE TASKS */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 dark:from-indigo-950/30 dark:via-slate-900 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-900/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Active Goals</h3>
                  <button onClick={() => setActiveTab('goals')} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View All</button>
                </div>

                <div className="space-y-3">
                  {data.goals.filter(goal => !goal.completed).slice(0, 4).map(goal => {
                    const progress = getGoalProgress(goal);
                    const progressColor = progress >= 100
                      ? 'from-emerald-400 to-teal-500'
                      : progress >= 80
                        ? 'from-amber-400 to-orange-500'
                        : 'from-indigo-500 via-violet-500 to-fuchsia-500';
                    const progressLabel = progress >= 100
                      ? 'Completed'
                      : progress >= 80
                        ? 'Nearly completed'
                        : 'In progress';
                    const goalCourse = courses.find(course => course.id === goal.courseId);

                    return (
                      <div key={goal.id} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-white/90 to-indigo-50/80 dark:from-slate-800/70 dark:to-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/50 shadow-sm">
                        <button
                          onClick={() => handleToggleGoal(goal.id)}
                          className="mt-0.5 text-slate-400 hover:text-indigo-600"
                          aria-label={`Mark ${goal.title} complete`}
                        >
                          <Square className="w-4 h-4" />
                        </button>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-tight">{goal.title}</p>
                            <span className={`shrink-0 text-[10px] font-semibold ${progress >= 100 ? 'text-emerald-600 dark:text-emerald-400' : progress >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                              {progressLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-medium">
                              {goal.category}
                            </span>
                            {goalCourse && <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{goalCourse.name}</span>}
                            <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto shrink-0">
                              <Clock className="w-3 h-3" /> {goal.deadline}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div
                              className="w-full bg-slate-200 dark:bg-slate-700/80 h-2.5 rounded-full overflow-hidden shadow-inner"
                              role="progressbar"
                              aria-label={`${goal.title} subject milestones`}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={progress}
                            >
                              <div className={`bg-gradient-to-r ${progressColor} h-full rounded-full transition-all duration-500 shadow-sm`} style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-right text-[10px] font-medium text-slate-500 dark:text-slate-400">{progress}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick AI Suggestion Card */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Priority Recommendation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Based on your low completed topics in <strong className="text-white">Operating Systems</strong>, allocate 45 mins today to <em>Paging & Segmentation</em>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYLLABUS MANAGEMENT */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topics or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter Status:
                </span>
                {['All', 'Not Started', 'In Progress', 'Completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Accordions & Topic Management */}
            <div className="space-y-6">
              {courses.map(course => {
                const comp = getCourseCompletion(course);
                return (
                  <div key={course.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Course Header Bar */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${course.color}`}>
                          {course.code}
                        </span>
                        <div>
                          <h3 className="font-bold text-base">{course.name}</h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{course.credits} Credits • {course.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs font-medium text-slate-500 block">Syllabus Completion</span>
                          <span className="text-sm font-bold">{comp}%</span>
                        </div>
                        <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={`${course.accent} h-full rounded-full transition-all`} style={{ width: `${comp}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Units & Topics List */}
                    <div className="p-5 space-y-6">
                      {course.units.map(unit => (
                        <div key={unit.id} className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                            {unit.name}
                          </h4>

                          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {unit.topics
                              .filter(t => statusFilter === 'All' || t.status === statusFilter)
                              .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                              .map(topic => (
                                <div key={topic.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                                  <div className="flex items-center gap-3">
                                    <span className="text-slate-400 text-xs font-mono">#{topic.id}</span>
                                    <span className={`text-sm font-medium ${topic.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                                      {topic.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" /> {topic.plannedDate}
                                    </span>

                                    {/* Status Selector Dropdown / Buttons */}
                                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                      {['Not Started', 'In Progress', 'Completed'].map(st => (
                                        <button
                                          key={st}
                                          onClick={() => handleUpdateTopicStatus(course.id, unit.id, topic.id, st)}
                                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                            topic.status === st
                                              ? st === 'Completed' ? 'bg-emerald-600 text-white' : st === 'In Progress' ? 'bg-amber-500 text-white' : 'bg-slate-600 text-white'
                                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                          }`}
                                        >
                                          {st}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMIC PROGRESS TRACKING */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Breakdown Card */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-lg">Planned vs. Actual Syllabus Completion</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Comparing real-time topic completion against academic term targets</p>
                </div>

                <div className="space-y-6">
                  {courses.map(course => {
                    const comp = getCourseCompletion(course);
                    return (
                      <div key={course.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold">{course.name} ({course.code})</span>
                          <div className="flex items-center gap-4 text-xs font-semibold">
                            <span className="text-slate-400">Planned Target: 85%</span>
                            <span className="text-indigo-600 dark:text-indigo-400">Actual: {comp}%</span>
                          </div>
                        </div>
                        {/* Dual Progress Trackers */}
                        <div className="space-y-1">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                            <div className="bg-slate-300 dark:bg-slate-700 h-full rounded-full absolute" style={{ width: '85%' }}></div>
                            <div className="bg-indigo-600 h-full rounded-full relative transition-all duration-500 opacity-90" style={{ width: `${comp}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pending Topics Highlight focus box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-lg">Critical Pending Topics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Topics scheduled soon that require immediate study</p>

                <div className="space-y-3">
                  {courses.flatMap(c => c.units.flatMap(u => u.topics.map(t => ({ ...t, courseCode: c.code }))))
                    .filter(t => t.status !== 'Completed')
                    .slice(0, 5)
                    .map(topic => (
                      <div key={topic.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                            {topic.courseCode}
                          </span>
                          <span className="text-xs text-slate-400">{topic.plannedDate}</span>
                        </div>
                        <p className="text-sm font-semibold leading-tight">{topic.name}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GOAL SETTING & TASK MANAGEMENT */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Academic Goals & Action Plan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Organized into Daily, Weekly, and Monthly Milestones</p>
              </div>
              <button
                onClick={openAddGoal}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" /> Add New Goal
              </button>
            </div>

            {/* Goal Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Daily', 'Weekly', 'Monthly'].map(category => (
                <div key={category} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="font-bold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400">{category} Goals</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
                      {data.goals.filter(g => g.category === category).length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {data.goals.filter(g => g.category === category).map(goal => {
                      const progress = getGoalProgress(goal);
                      const progressColor = progress >= 100
                        ? 'from-emerald-400 to-teal-500'
                        : progress >= 80
                          ? 'from-amber-400 to-orange-500'
                          : 'from-indigo-500 via-violet-500 to-fuchsia-500';
                      const progressLabel = progress >= 100
                        ? 'Completed'
                        : progress >= 80
                          ? 'Nearly completed'
                          : 'In progress';
                      const goalCourse = courses.find(course => course.id === goal.courseId);

                      return (
                      <div key={goal.id} className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 dark:from-indigo-950/30 dark:via-slate-800/50 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-900/50 shadow-sm space-y-2 group">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => handleToggleGoal(goal.id)}
                            className="mt-0.5 text-slate-400 hover:text-indigo-600"
                            aria-label={goal.completed ? `Mark ${goal.title} active` : `Mark ${goal.title} complete`}
                          >
                            {goal.completed ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
                          </button>
                          <span className={`text-sm font-medium flex-1 ${goal.completed ? 'line-through text-slate-400' : ''}`}>
                            {goal.title}
                          </span>
                          <button onClick={() => handleDeleteGoal(goal.id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {goal.deadline}</span>
                          <span className={`text-[10px] font-semibold ${progress >= 100 ? 'text-emerald-600 dark:text-emerald-400' : progress >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                            {progressLabel}
                          </span>
                        </div>
                        {goalCourse && <p className="text-[10px] text-slate-500 dark:text-slate-400">{goalCourse.name} milestones</p>}
                        <div
                          className="w-full bg-slate-200 dark:bg-slate-700/80 h-2.5 rounded-full overflow-hidden shadow-inner"
                          role="progressbar"
                          aria-label={`${goal.title} subject milestones`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={progress}
                        >
                          <div className={`bg-gradient-to-r ${progressColor} h-full rounded-full transition-all duration-500 shadow-sm`} style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-right text-[10px] font-medium text-slate-500 dark:text-slate-400">{progress}%</p>
                      </div>
                    );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MARKS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100">Calculated SGPA</span>
                <div className="text-4xl font-black">{calculatedSgpa}</div>
                <p className="text-xs text-indigo-200">Derived using standard Institutional Credit-Grade Point Formula</p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cumulative CGPA</span>
                <div className="text-4xl font-black text-slate-900 dark:text-white">8.35</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Across Semesters 1 through 5</p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recorded Assessments</span>
                <div className="text-4xl font-black text-slate-900 dark:text-white">
                  {courses.reduce((acc, c) => acc + c.assessments.length, 0)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Internal, Mid-term & Practical tests</p>
              </div>
            </div>

            {/* Assessment Entry & Performance Chart Representation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map(course => {
                const scorePct = calculateCourseScore(course);
                return (
                  <div key={course.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${course.color}`}>{course.code}</span>
                        <h4 className="font-bold text-base mt-1">{course.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Course Average</span>
                        <div className="text-lg font-extrabold text-emerald-500">{scorePct}%</div>
                      </div>
                    </div>

                    {/* Recorded Assessments list */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment Scores</span>
                      {course.assessments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No assessment marks logged yet.</p>
                      ) : (
                        course.assessments.map(asm => (
                          <div key={asm.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                            <span className="font-semibold">{asm.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-bold">{asm.obtainedMarks} / {asm.maxMarks}</span>
                              <span className="text-slate-400">({Math.round((asm.obtainedMarks / asm.maxMarks) * 100)}%)</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Score Action */}
                    <button
                      onClick={() => {
                        setSelectedCourseForAssessment(course.id);
                        setIsAddAssessmentOpen(true);
                      }}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log Assessment Score
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: AI ACADEMIC ASSISTANT (SRS Appendix B Specification) */}
        {activeTab === 'ai-assistant' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            {/* Assistant Workspace Chat */}
            <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Syllabi AI Academic Advisor</h3>
                    <span className="text-xs text-slate-400">Contextual recommendation engine based on live student marks & progress</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Context Ready
                </span>
              </div>

              {/* Chat Message Box */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    AI
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm space-y-2 max-w-xl">
                    <p className="font-semibold text-xs text-indigo-500">System Context Analysis</p>
                    <p>
                      Hello Alex! I have analyzed your current Semester 5 progress. Here are your key priorities:
                    </p>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      <li><strong>Database Management Systems:</strong> Unit 2 Normalization is marked <em>In Progress</em>. Finish BCNF notes before mid-term exams.</li>
                      <li><strong>Operating Systems:</strong> Overall syllabus completion is at 50%. Focus on <em>Memory Management & Paging</em>.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask for study recommendations, priority topics, or grade forecasts..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Context Sidebar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base">Student Context Matrix</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block mb-1">Target Semester SGPA</span>
                  <span className="font-bold text-sm text-indigo-500">8.75 / 10.0</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block mb-1">Lowest Progress Subject</span>
                  <span className="font-bold text-sm text-purple-500">Operating Systems & Architecture (50%)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block mb-1">Active Deadlines</span>
                  <span className="font-bold text-sm text-amber-500">{data.goals.filter(g=>!g.completed).length} Pending Tasks</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD SUBJECT */}
      {isAddSubjectOpen && (
        <div className={`fixed inset-0 ${isAddingSubjectForGoal ? 'z-[60]' : 'z-50'} bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4`}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg">{isAddingSubjectForGoal ? 'Add Subject for Goal' : 'Add New Subject / Course'}</h3>
              <button onClick={() => {
                setIsAddSubjectOpen(false);
                setIsAddingSubjectForGoal(false);
              }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Course Code</label>
                <input required name="code" placeholder="e.g. CS505" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Name</label>
                <input required name="name" defaultValue={isAddingSubjectForGoal ? subjectSearch : ''} placeholder="e.g. Software Engineering" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Credits</label>
                  <input required type="number" min="1" max="6" name="credits" defaultValue="4" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                  <select name="category" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Lab">Lab / Practical</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => {
                  setIsAddSubjectOpen(false);
                  setIsAddingSubjectForGoal(false);
                }} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GOAL */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg">Add New Goal / Target</h3>
              <button onClick={() => setIsAddGoalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Goal Title</label>
                <input required name="title" placeholder="e.g. Finish Unit 2 SQL Practice Problems" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div
                className="relative"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setIsSubjectMenuOpen(false);
                }}
              >
                <label htmlFor="goal-subject-search" className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="goal-subject-search"
                    type="text"
                    role="combobox"
                    aria-expanded={isSubjectMenuOpen}
                    aria-controls="goal-subject-options"
                    aria-autocomplete="list"
                    autoComplete="off"
                    required
                    value={subjectSearch}
                    onFocus={() => setIsSubjectMenuOpen(true)}
                    onChange={(e) => {
                      setSubjectSearch(e.target.value);
                      setSelectedCourseForGoal(null);
                      setIsSubjectMenuOpen(true);
                    }}
                    placeholder="Search or select a subject..."
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSubjectMenuOpen(open => !open)}
                    aria-label="Show subjects"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                {isSubjectMenuOpen && (
                  <div
                    id="goal-subject-options"
                    role="listbox"
                    className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-xl"
                  >
                    {courses
                      .filter(course => course.name.toLowerCase().includes(subjectSearch.trim().toLowerCase()) || course.code.toLowerCase().includes(subjectSearch.trim().toLowerCase()))
                      .map(course => (
                        <button
                          key={course.id}
                          type="button"
                          role="option"
                          aria-selected={selectedCourseForGoal === course.id}
                          onClick={() => {
                            setSelectedCourseForGoal(course.id);
                            setSubjectSearch(course.name);
                            setIsSubjectMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <span className="truncate">{course.name}</span>
                          <span className="shrink-0 text-xs text-slate-400">{course.code}</span>
                        </button>
                      ))}
                    {subjectSearch.trim() && !courses.some(course => course.name.trim().toLowerCase() === subjectSearch.trim().toLowerCase()) && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubjectMenuOpen(false);
                          setIsAddingSubjectForGoal(true);
                          setIsAddSubjectOpen(true);
                        }}
                        className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      >
                        <Plus className="w-4 h-4" />
                        Add “{subjectSearch.trim()}” as a new subject
                      </button>
                    )}
                    {courses.length === 0 && !subjectSearch.trim() && (
                      <p className="px-3 py-2 text-xs text-slate-500">No subjects yet. Type a name to add one.</p>
                    )}
                  </div>
                )}
                {selectedCourseForGoal && (
                  <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400">Subject linked to this goal</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Time Horizon</label>
                  <select name="category" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Deadline</label>
                  <input required type="date" name="deadline" defaultValue="2026-11-20" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddGoalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20">Add Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ASSESSMENT */}
      {isAddAssessmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg">Log Assessment Marks</h3>
              <button onClick={() => setIsAddAssessmentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAssessment} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Assessment Name</label>
                <input required name="name" placeholder="e.g. Quiz 2 / Lab Exam" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Obtained Marks</label>
                  <input required type="number" min="0" max="100" name="obtainedMarks" placeholder="25" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Max Marks</label>
                  <input required type="number" min="1" max="100" name="maxMarks" defaultValue="30" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddAssessmentOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20">Save Score</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
