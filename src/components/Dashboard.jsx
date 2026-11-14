/**
 * components/Dashboard.jsx
 * Overview tab — metrics and summaries derived purely from live state.
 */

import { BookOpen, Target, Calendar, CheckCircle2 } from 'lucide-react';
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
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Course progress</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Completion across all syllabus units</p>
            </div>
            {courses.length > 0 && (
              <button
                onClick={() => onNavigate('syllabus')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Manage syllabus →
              </button>
            )}
          </div>

          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses added"
              description="Add your first course in Syllabus Planner to start tracking progress."
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
                const totalTopics = course.units.reduce((s, u) => s + u.topics.length, 0);
                const doneTopics = course.units.reduce(
                  (s, u) => s + u.topics.filter(t => t.status === 'Completed').length,
                  0
                );
                return (
                  <div key={course.id} className="px-5 py-4 space-y-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border ${course.color}`}>
                          {course.code}
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {course.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-3 shrink-0">
                        {pct}%
                      </span>
                    </div>
                    <ProgressBar value={pct} colorClass={course.accent} />
                    <div className="flex justify-between text-xs text-slate-400 pt-0.5">
                      <span>{course.units.length} unit{course.units.length !== 1 ? 's' : ''}</span>
                      <span>{doneTopics} / {totalTopics} topics completed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming goals */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Upcoming goals</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">High priority academic tasks</p>
            </div>
            {goals.length > 0 && (
              <button
                onClick={() => onNavigate('goals')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                View all →
              </button>
            )}
          </div>

          {pendingGoals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={Target}
                title="No pending goals"
                description={goals.length === 0 ? 'Create goals to organize your study schedule.' : 'All current goals are marked complete!'}
                action={
                  <Button size="sm" onClick={() => onNavigate('goals')}>
                    {goals.length === 0 ? 'Add a goal' : 'Manage goals'}
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
              {pendingGoals.map(goal => (
                <li key={goal.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <button
                    onClick={() => onToggleGoal(goal.id)}
                    className="mt-0.5 shrink-0 w-4 h-4 rounded border border-slate-300 dark:border-slate-600 hover:border-indigo-500 flex items-center justify-center transition-colors"
                    aria-label="Mark complete"
                  >
                    {goal.completed && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug truncate">
                      {goal.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {goal.category}
                      </span>
                      {goal.deadline && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due {goal.deadline}
                        </span>
                      )}
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
