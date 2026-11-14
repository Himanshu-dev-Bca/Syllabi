/**
 * components/Analytics.jsx
 * Real academic grading, assessment records, and semester SGPA estimation.
 */

import { useState } from 'react';
import { Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { Button, Modal, Input, EmptyState, ProgressBar } from './ui';
import { courseAssessmentScore } from '../lib/calculations';

function AddAssessmentModal({ course, onClose, onAdd }) {
  const [fields, setFields] = useState({ name: '', obtainedMarks: '', maxMarks: '50' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!fields.name.trim()) {
      setError('Assessment name is required (e.g. Mid-Term Exam).');
      return;
    }
    const res = onAdd(course.id, fields);
    if (res?.error) {
      setError(res.error);
      return;
    }
    onClose();
  }

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title={`Record Assessment — ${course.code}`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Assessment Title"
          placeholder="e.g. Internal Assessment 1 / Midterm"
          value={fields.name}
          onChange={set('name')}
          error={error}
          autoFocus
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Marks Obtained"
            type="number"
            step="0.5"
            min="0"
            placeholder="e.g. 42"
            value={fields.obtainedMarks}
            onChange={set('obtainedMarks')}
          />
          <Input
            label="Maximum Marks"
            type="number"
            step="1"
            min="1"
            placeholder="e.g. 50"
            value={fields.maxMarks}
            onChange={set('maxMarks')}
          />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Save Marks</Button>
        </div>
      </form>
    </Modal>
  );
}

function getGradeLetter(scorePct) {
  if (scorePct === null) return { letter: '—', points: '—', label: 'Unassessed' };
  if (scorePct >= 90) return { letter: 'O', points: 10, label: 'Outstanding' };
  if (scorePct >= 80) return { letter: 'A+', points: 9, label: 'Excellent' };
  if (scorePct >= 70) return { letter: 'A', points: 8, label: 'Very Good' };
  if (scorePct >= 60) return { letter: 'B+', points: 7, label: 'Good' };
  if (scorePct >= 50) return { letter: 'B', points: 6, label: 'Above Average' };
  if (scorePct >= 40) return { letter: 'C', points: 5, label: 'Pass' };
  return { letter: 'F', points: 0, label: 'Fail' };
}

export function Analytics({ courses = [], stats, onAddAssessment, onDeleteAssessment }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <>
      {selectedCourse && (
        <AddAssessmentModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onAdd={onAddAssessment}
        />
      )}

      <div className="space-y-6">
        {/* Metric Cards Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Estimated SGPA
            </span>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {stats.sgpa !== null ? stats.sgpa : '—'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stats.sgpa !== null ? '10-point credit-weighted scale' : 'Add marks to estimate'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Credits
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.totalCredits}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Across {courses.length} enrolled {courses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recorded Assessments
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.totalAssessments}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tests, practicals, and assignments
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overall Syllabus
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {stats.overallProgress}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stats.pendingTopics} topics remaining
            </p>
          </div>
        </div>

        {/* Course Assessment Details */}
        <div>
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Course Grade Points & Assessments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record assessment scores to calculate course percentages and grade points.
            </p>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses registered"
              description="Add courses in Syllabus Planner before recording test scores and marks."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {courses.map(course => {
                const scorePct = courseAssessmentScore(course);
                const grade = getGradeLetter(scorePct);
                const assessments = course.assessments || [];

                return (
                  <div
                    key={course.id}
                    className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${course.color}`}>
                            {course.code}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {course.credits} Credits · {course.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                          {course.name}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 block">Grade Point</span>
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {grade.points !== '—' ? `${grade.points} / 10` : '—'}
                          </span>
                          {grade.letter !== '—' && (
                            <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {grade.letter}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                        <span>Average Assessment Score</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {scorePct !== null ? `${scorePct}%` : 'No marks yet'}
                        </span>
                      </div>
                      <ProgressBar value={scorePct ?? 0} colorClass={course.accent} />
                    </div>

                    {/* Assessments List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Recorded Marks ({assessments.length})
                        </span>
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Assessment
                        </button>
                      </div>

                      {assessments.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center italic bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                          No assessment marks recorded for this course.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {assessments.map(a => {
                            const pct = Math.round((Number(a.obtainedMarks) / Number(a.maxMarks)) * 100);
                            return (
                              <div
                                key={a.id}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs"
                              >
                                <div>
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {a.name}
                                  </span>
                                  <span className="text-slate-400 ml-2">
                                    {a.obtainedMarks} / {a.maxMarks} marks
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {pct}%
                                  </span>
                                  <button
                                    onClick={() => onDeleteAssessment(course.id, a.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    title="Delete assessment"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Grading Scale Info */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p>
            <strong>Standard 10-Point Grading:</strong> Scores ≥ 90% receive 10 (O), ≥ 80% receive 9 (A+), ≥ 70% receive 8 (A), ≥ 60% receive 7 (B+), ≥ 50% receive 6 (B), ≥ 40% receive 5 (C), and &lt; 40% receive 0 (F). SGPA is the credit-weighted sum of earned grade points divided by total registered credits.
          </p>
        </div>
      </div>
    </>
  );
}
