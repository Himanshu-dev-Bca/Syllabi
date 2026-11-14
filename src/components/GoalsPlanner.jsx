/**
 * components/GoalsPlanner.jsx
 * Goal and task schedule categorized by Daily, Weekly, and Monthly milestones.
 */

import { useState } from 'react';
import { Target, Plus, CheckCircle2, Calendar, Trash2 } from 'lucide-react';
import { Button, Modal, Input, Select, EmptyState } from './ui';

export function AddGoalModal({ courses = [], onClose, onAdd }) {
  const [fields, setFields] = useState({
    title: '',
    category: 'Weekly',
    deadline: '',
    courseId: courses[0]?.id || '',
  });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!fields.title.trim()) {
      setError('Goal title is required.');
      return;
    }
    const res = onAdd(fields);
    if (res?.error) {
      setError(res.error);
      return;
    }
    onClose();
  }

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title="Create Academic Goal" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Goal / Task Description"
          placeholder="e.g. Complete 5 practice questions on BCNF decomposition"
          value={fields.title}
          onChange={set('title')}
          error={error}
          autoFocus
        />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Milestone Horizon" value={fields.category} onChange={set('category')}>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </Select>
          <Input
            label="Target Date"
            type="date"
            value={fields.deadline}
            onChange={set('deadline')}
          />
        </div>
        {courses.length > 0 && (
          <Select label="Associated Course (Optional)" value={fields.courseId} onChange={set('courseId')}>
            <option value="">None / General</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </Select>
        )}
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Save Goal</Button>
        </div>
      </form>
    </Modal>
  );
}

export function GoalsPlanner({ goals = [], courses = [], onAddGoal, onToggleGoal, onDeleteGoal }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const courseMap = new Map(courses.map(c => [c.id, c]));

  const filteredGoals = goals
    .filter(g => categoryFilter === 'All' || g.category === categoryFilter)
    .filter(g => {
      if (statusFilter === 'Active') return !g.completed;
      if (statusFilter === 'Completed') return g.completed;
      return true;
    });

  const categories = ['Daily', 'Weekly', 'Monthly'];

  return (
    <>
      {addModalOpen && (
        <AddGoalModal
          courses={courses}
          onClose={() => setAddModalOpen(false)}
          onAdd={onAddGoal}
        />
      )}

      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
              {['All', 'Daily', 'Weekly', 'Monthly'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
              {['All', 'Active', 'Completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Goal
          </Button>
        </div>

        {/* Goals content */}
        {goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No study goals yet"
            description="Set targeted daily, weekly, or monthly milestones to stay on schedule."
            action={
              <Button size="sm" onClick={() => setAddModalOpen(true)}>
                <Plus className="w-4 h-4" /> Add Your First Goal
              </Button>
            }
          />
        ) : categoryFilter === 'All' && statusFilter === 'All' ? (
          /* Grouped column view */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => {
              const catGoals = goals.filter(g => g.category === cat);
              return (
                <div
                  key={cat}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {cat} Goals
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {catGoals.filter(g => g.completed).length} / {catGoals.length}
                    </span>
                  </div>

                  <div className="p-3 space-y-2 flex-1">
                    {catGoals.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center italic">No {cat.toLowerCase()} goals</p>
                    ) : (
                      catGoals.map(goal => {
                        const course = goal.courseId ? courseMap.get(goal.courseId) : null;
                        return (
                          <div
                            key={goal.id}
                            className={`p-3 rounded-lg border transition-all ${
                              goal.completed
                                ? 'bg-slate-50/80 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 text-slate-400'
                                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={() => onToggleGoal(goal.id)}
                                className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  goal.completed
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                                }`}
                                aria-label="Toggle completed"
                              >
                                {goal.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-snug font-medium ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                                  {goal.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {course && (
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${course.color}`}>
                                      {course.code}
                                    </span>
                                  )}
                                  {goal.deadline && (
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" /> {goal.deadline}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => onDeleteGoal(goal.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="Delete goal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Filtered list view */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredGoals.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No goals match your selected filters.
              </div>
            ) : (
              filteredGoals.map(goal => {
                const course = goal.courseId ? courseMap.get(goal.courseId) : null;
                return (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => onToggleGoal(goal.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          goal.completed
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                        }`}
                      >
                        {goal.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <span className={`text-sm font-medium ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                          {goal.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            {goal.category}
                          </span>
                          {course && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${course.color}`}>
                              {course.code}
                            </span>
                          )}
                          {goal.deadline && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Due {goal.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}

