/**
 * components/SetupScreen.jsx
 * Shown on first launch when no user profile exists in localStorage.
 * Collects required profile information or allows loading sample data.
 */

import { useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { Button, Input } from './ui';

export function SetupScreen({ onComplete, onLoadSample }) {
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [semester, setSemester] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Your name is required.';
    if (!degree.trim()) e.degree = 'Programme / degree name is required.';
    if (!semester.trim()) e.semester = 'Current semester is required.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onComplete({ name: name.trim(), degree: degree.trim(), semester: semester.trim() });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">Syllabi</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Academic & Syllabus Planner</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">Set up your profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Everything is saved locally on your device in your browser's storage.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Your Name"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={e => setName(e.target.value)}
              error={errors.name}
              autoFocus
            />
            <Input
              label="Programme / Degree"
              placeholder="e.g. B.Tech Computer Science & Engineering"
              value={degree}
              onChange={e => setDegree(e.target.value)}
              error={errors.degree}
            />
            <Input
              label="Current Semester"
              placeholder="e.g. Semester 5"
              value={semester}
              onChange={e => setSemester(e.target.value)}
              error={errors.semester}
            />

            <Button type="submit" className="w-full justify-center mt-2">
              Get Started
            </Button>
          </form>

          {onLoadSample && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={onLoadSample}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> Or load sample Computer Science syllabus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
