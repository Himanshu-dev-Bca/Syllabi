/**
 * components/ProfileModal.jsx
 * Edit student profile, manage application data, and reset options.
 */

import { useState } from 'react';
import { Button, Modal, Input } from './ui';
import { Trash2, Download } from 'lucide-react';

export function ProfileModal({ user, onClose, onUpdate, onLoadSample, onReset }) {
  const [fields, setFields] = useState({
    name: user?.name || '',
    degree: user?.degree || '',
    semester: user?.semester || '',
  });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!fields.name.trim()) {
      setError('Name is required.');
      return;
    }
    onUpdate({
      name: fields.name.trim(),
      degree: fields.degree.trim(),
      semester: fields.semester.trim(),
    });
    onClose();
  }

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title="Student Profile & Settings" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Alex Morgan"
          value={fields.name}
          onChange={set('name')}
          error={error}
        />
        <Input
          label="Degree / Major"
          placeholder="e.g. B.Tech Computer Science & Engineering"
          value={fields.degree}
          onChange={set('degree')}
        />
        <Input
          label="Current Academic Semester"
          placeholder="e.g. Semester 5"
          value={fields.semester}
          onChange={set('semester')}
        />

        <div className="flex gap-2 justify-end pt-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Save Profile</Button>
        </div>
      </form>

      {/* Data Management Tools */}
      <div className="pt-4 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Data Management
        </span>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              if (window.confirm('Load sample computer science curriculum and demo data?')) {
                onLoadSample();
                onClose();
              }
            }}
            className="flex-1 justify-center"
          >
            <Download className="w-3.5 h-3.5" /> Load Sample Data
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all courses, topics, marks, and goals? This cannot be undone.')) {
                onReset();
                onClose();
              }
            }}
            className="flex-1 justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset All Data
          </Button>
        </div>
      </div>
    </Modal>
  );
}
