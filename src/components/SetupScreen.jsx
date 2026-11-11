/**
 * components/SetupScreen.jsx
 * Shown on first launch when no user profile exists in localStorage.
 * Collects minimum required information to initialise the application.
 */

import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Button, Input } from './ui';

export function SetupScreen({ onComplete }) {
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
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">Syllabi</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Academic Planner</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Set up your profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          This information is stored locally on your device. Nothing is sent to any server.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Your name"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={e => setName(e.target.value)}
            error={errors.name}
            autoFocus
          />
          <Input
            label="Programme / Degree"
            placeholder="e.g. B.Tech Computer Science"
            value={degree}
            onChange={e => setDegree(e.target.value)}
            error={errors.degree}
          />
          <Input
            label="Current semester"
            placeholder="e.g. Semester 5"
            value={semester}
            onChange={e => setSemester(e.target.value)}
            error={errors.semester}
          />

          <Button type="submit" className="w-full justify-center mt-2">
            Get started
          </Button>
        </form>

        <p className="text-xs text-slate-400 dark:text-slate-600 text-center mt-6">
          You can update this information later from the sidebar.
        </p>
      </div>
    </div>
  );
}

