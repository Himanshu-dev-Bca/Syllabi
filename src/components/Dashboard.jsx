/**
 * components/Dashboard.jsx
 * Overview tab — all values derived from actual state, no hardcoded metrics.
 */

import { BookOpen, Clock, Award, Target } from 'lucide-react';
import { StatCard, ProgressBar, EmptyState, Button } from './ui';
import { courseCompletion } from '../lib/calculations';

export function Dashboard({ courses, goals, stats, onNavigate, onToggleGoal }) {
  const pendingGoals = goals.filter(g => !g.completed).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Syllabus complete"
          value={courses.length === 0 ? '—' : `${stats.overallProgress}%`}
          sub={courses.length === 0 ? 'No courses added' : `${stats.pendingTopics} topics remaining`}
        >
          {courses.length > 0 && (
            <ProgressBar value={stats.overallProgress} className="mt-3" />
          )}
        </StatCard>

        <StatCard
          label="Estimated SGPA"
          value={stats.sgpa !== null ? stats.sgpa : '—'}
          sub={stats.sgpa !== null ? 'From recorded assessments' : 'No assessments recorded'}
        />

        <StatCard
          label="Pending topics"
          value={stats.pendingTopics}
          sub={`Across ${courses.length} course${courses.length !== 1 ? 's' : ''}`}
        />

        <StatCard
          label="Open goals"
          value={stats.activeGoals}
          sub={`${stats.completedThisWeek} completed this week`}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Course progress */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Course progress</h3>
            {courses.length > 0 && (
              <button
                onClick={() => onNavigate('syllabus')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Manage syllabus
              </button>
            )}
          </div>

          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses added"
              description="Add your first course to start tracking syllabus progress."
              action={
                <Button size="sm" onClick={() => onNavigate('syllabus')}>
                  Add a course
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map(course => {
                const pct = courseCompletion(course);
                return (
                  <div key={course.id} className="px-5 py-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${course.color}`}>
                          {course.code}
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{course.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-3 shrink-0">{pct}%</span>
                    </div>
                    <ProgressBar value={pct} colorClass={course.accent} />
                    <div className="flex gap-3 text-xs text-slate-400">
                      <span>{course.units.length} unit{course.units.length !== 1 ? 's' : ''}</span>
                      <span>{course.units.reduce((s, u) => s + u.topics.length, 0)} topics</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming goals */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Upcoming goals</h3>
            {goals.length > 0 && (
              <button
                onClick={() => onNavigate('goals')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                View all
              </button>
            )}
          </div>

          {pendingGoals.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No open goals"
              description={goals.length === 0 ? 'Create goals to track your study tasks.' : 'All goals are completed.'}
              action={
                <Button size="sm" onClick={() => onNavigate('goals')}>
                  {goals.length === 0 ? 'Add a goal' : 'View completed'}
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingGoals.map(goal => (
                <li key={goal.id} className="flex items-start gap-3 px-5 py-3">
                  <button
                    onClick={() => onToggleGoal(goal.id)}
                    className="mt-0.5 shrink-0 w-4 h-4 rounded border border-slate-300 dark:border-slate-600 hover:border-indigo-500 transition-colors"
                    aria-label="Mark complete"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug truncate">{goal.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{goal.category}</span>
                      <span className="text-[10px] text-slate-400">·</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Due {goal.deadline}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

