/**
 * components/SyllabusPlanner.jsx
 * Full syllabus management: courses, units, topics, and real-time completion tracking.
 */

import { useState } from 'react';
import { BookOpen, Plus, ChevronDown, ChevronRight, Calendar, Trash2, Search, X } from 'lucide-react';
import { Button, Modal, Input, Select, EmptyState, Badge, ProgressBar } from './ui';
import { courseCompletion } from '../lib/calculations';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];

function statusColor(status) {
  if (status === 'Completed') {
    return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700';
  }
  if (status === 'In Progress') {
    return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700';
  }
  return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
}

// ── Add Course Modal ─────────────────────────────────────────────────────────

export function AddCourseModal({ onClose, onAdd }) {
  const [fields, setFields] = useState({ code: '', name: '', credits: '4', category: 'Core' });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!fields.code.trim()) e.code = 'Course code is required (e.g. CS501).';
    if (!fields.name.trim()) e.name = 'Subject name is required.';
    const cr = Number(fields.credits);
    if (!cr || cr < 1 || cr > 12) e.credits = 'Credits must be between 1 and 12.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onAdd(fields);
    onClose();
  }

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title="Add New Course" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Course Code"
          placeholder="e.g. CS501"
          value={fields.code}
          onChange={set('code')}
          error={errors.code}
          autoFocus
        />
        <Input
          label="Course / Subject Name"
          placeholder="e.g. Database Management Systems"
          value={fields.name}
          onChange={set('name')}
          error={errors.name}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Credits"
            type="number"
            min="1"
            max="12"
            value={fields.credits}
            onChange={set('credits')}
            error={errors.credits}
          />
          <Select label="Category" value={fields.category} onChange={set('category')}>
            <option>Core</option>
            <option>Elective</option>
            <option>Lab</option>
            <option>Seminar / Project</option>
          </Select>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Save Course</Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Add Unit Modal ───────────────────────────────────────────────────────────

function AddUnitModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Unit name is required.'); return; }
    onAdd(name);
    onClose();
  }

  return (
    <Modal title="Add Unit / Module" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Unit Title"
          placeholder="e.g. Unit 1: Relational Algebra & Calculus"
          value={name}
          onChange={e => setName(e.target.value)}
          error={error}
          autoFocus
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Add Unit</Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Add Topic Modal ──────────────────────────────────────────────────────────

function AddTopicModal({ onClose, onAdd }) {
  const [fields, setFields] = useState({ name: '', plannedDate: '' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!fields.name.trim()) { setError('Topic name is required.'); return; }
    onAdd(fields);
    onClose();
  }

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title="Add Topic" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Topic Description"
          placeholder="e.g. BCNF Normalization & Lossless Decomposition"
          value={fields.name}
          onChange={set('name')}
          error={error}
          autoFocus
        />
        <Input
          label="Planned Study Date (optional)"
          type="date"
          value={fields.plannedDate}
          onChange={set('plannedDate')}
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Add Topic</Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({
  course,
  onUpdateTopicStatus,
  onAddUnit,
  onDeleteUnit,
  onAddTopic,
  onDeleteTopic,
  onDeleteCourse,
  searchQuery,
  statusFilter,
}) {
  const [expanded, setExpanded] = useState(true);
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [addTopicTarget, setAddTopicTarget] = useState(null); // unitId
  const pct = courseCompletion(course);

  const filteredUnits = course.units.map(unit => ({
    ...unit,
    topics: unit.topics
      .filter(t => statusFilter === 'All' || t.status === statusFilter)
      .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase())),
  })).filter(u => u.topics.length > 0 || !searchQuery);

  return (
    <>
      {addUnitOpen && (
        <AddUnitModal onClose={() => setAddUnitOpen(false)} onAdd={(name) => onAddUnit(course.id, name)} />
      )}
      {addTopicTarget && (
        <AddTopicModal
          onClose={() => setAddTopicTarget(null)}
          onAdd={(fields) => onAddTopic(course.id, addTopicTarget, fields)}
        />
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Course Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={expanded ? 'Collapse course' : 'Expand course'}
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <Badge className={course.color}>{course.code}</Badge>

          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{course.name}</span>
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{course.credits} Credits · {course.category}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">Completion</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{pct}%</p>
            </div>
            <div className="w-20">
              <ProgressBar value={pct} colorClass={course.accent} />
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm(`Delete course "${course.name}" and all associated topics?`)) {
                onDeleteCourse(course.id);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded"
            title="Delete course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Units and Topics */}
        {expanded && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {course.units.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-xs text-slate-400 mb-3">No units added yet. Add a unit to start structuring this syllabus.</p>
                <Button size="sm" variant="secondary" onClick={() => setAddUnitOpen(true)}>
                  <Plus className="w-3.5 h-3.5" /> Add First Unit
                </Button>
              </div>
            ) : (
              filteredUnits.map(unit => (
                <div key={unit.id} className="px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      {unit.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAddTopicTarget(unit.id)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Topic
                      </button>
                      {onDeleteUnit && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${unit.name}"?`)) onDeleteUnit(course.id, unit.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete unit"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {unit.topics.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No topics in this unit yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {unit.topics.map(topic => (
                        <div key={topic.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5">
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className={`text-sm ${topic.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                              {topic.name}
                            </span>
                            {topic.plannedDate && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 inline-flex items-center gap-1 shrink-0">
                                <Calendar className="w-3 h-3" /> {topic.plannedDate}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex gap-1">
                              {STATUS_OPTIONS.map(st => (
                                <button
                                  key={st}
                                  onClick={() => onUpdateTopicStatus(course.id, unit.id, topic.id, st)}
                                  className={`px-2 py-1 rounded text-[10px] font-semibold border transition-colors ${
                                    topic.status === st
                                      ? statusColor(st)
                                      : 'text-slate-400 dark:text-slate-500 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                            {onDeleteTopic && (
                              <button
                                onClick={() => onDeleteTopic(course.id, unit.id, topic.id)}
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                title="Delete topic"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

            {course.units.length > 0 && (
              <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/30 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setAddUnitOpen(true)}>
                  <Plus className="w-3.5 h-3.5" /> Add Unit
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ── SyllabusPlanner Component ────────────────────────────────────────────────

export function SyllabusPlanner({
  courses,
  onAddCourse,
  onDeleteCourse,
  onAddUnit,
  onDeleteUnit,
  onAddTopic,
  onDeleteTopic,
  onUpdateTopicStatus,
}) {
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  return (
    <>
      {addCourseOpen && (
        <AddCourseModal onClose={() => setAddCourseOpen(false)} onAdd={onAddCourse} />
      )}

      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Not Started', 'In Progress', 'Completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    statusFilter === f
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Button size="sm" onClick={() => setAddCourseOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </div>

        {/* Course List */}
        {courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Add your first course to begin building your academic syllabus."
            action={
              <Button size="sm" onClick={() => setAddCourseOpen(true)}>
                <Plus className="w-4 h-4" /> Add Course
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onUpdateTopicStatus={onUpdateTopicStatus}
                onAddUnit={onAddUnit}
                onDeleteUnit={onDeleteUnit}
                onAddTopic={onAddTopic}
                onDeleteTopic={onDeleteTopic}
                onDeleteCourse={onDeleteCourse}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
