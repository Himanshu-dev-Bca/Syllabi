/**
 * hooks/useAppData.js
 * Central data hook — owns all state, persistence, and mutations.
 * Components receive data and handlers; they never mutate state directly.
 */

import { useState, useMemo, useCallback } from 'react';
import { loadData, saveData, clearData } from '../lib/storage';
import { getSampleData } from '../lib/sampleData';
import {
  overallCompletion,
  pendingTopicCount,
  calculateSgpa,
  sortedGoals,
  goalsCompletedThisWeek,
  courseColors,
} from '../lib/calculations';

function emptyState() {
  return { courses: [], goals: [], user: null };
}

export function useAppData() {
  const [data, rawSetData] = useState(() => loadData() ?? emptyState());

  const setData = useCallback((updater) => {
    rawSetData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveData(next);
      return next;
    });
  }, []);

  // ── Derived values (memoized) ────────────────────────────────────────────
  const { courses, goals, user } = data;

  const stats = useMemo(() => ({
    overallProgress: overallCompletion(courses),
    pendingTopics: pendingTopicCount(courses),
    sgpa: calculateSgpa(courses),
    activeGoals: goals.filter(g => !g.completed).length,
    completedThisWeek: goalsCompletedThisWeek(goals),
    totalAssessments: courses.reduce((s, c) => s + (c.assessments?.length ?? 0), 0),
    totalCredits: courses.reduce((s, c) => s + (Number(c.credits) || 0), 0),
  }), [courses, goals]);

  const priorityGoals = useMemo(() => sortedGoals(goals), [goals]);

  // ── User profile mutations ───────────────────────────────────────────────
  const setupUser = useCallback((userInfo) => {
    setData(prev => ({ ...prev, user: userInfo }));
  }, [setData]);

  const updateUser = useCallback((patch) => {
    setData(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...patch } : patch,
    }));
  }, [setData]);

  // ── Course mutations ─────────────────────────────────────────────────────
  const addCourse = useCallback((fields) => {
    setData(prev => {
      const colors = courseColors(prev.courses.length);
      const newCourse = {
        id: `c-${Date.now()}`,
        code: fields.code.trim().toUpperCase(),
        name: fields.name.trim(),
        credits: Number(fields.credits) || 4,
        category: fields.category || 'Core',
        color: colors.badge,
        accent: colors.bar,
        units: [],
        assessments: [],
      };
      return { ...prev, courses: [...prev.courses, newCourse] };
    });
  }, [setData]);

  const deleteCourse = useCallback((courseId) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== courseId),
      goals: prev.goals.filter(g => g.courseId !== courseId),
    }));
  }, [setData]);

  // ── Unit mutations ───────────────────────────────────────────────────────
  const addUnit = useCallback((courseId, unitName) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          units: [...c.units, {
            id: `u-${Date.now()}`,
            name: unitName.trim(),
            topics: [],
          }],
        };
      }),
    }));
  }, [setData]);

  const deleteUnit = useCallback((courseId, unitId) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          units: c.units.filter(u => u.id !== unitId),
        };
      }),
    }));
  }, [setData]);

  // ── Topic mutations ──────────────────────────────────────────────────────
  const addTopic = useCallback((courseId, unitId, fields) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          units: c.units.map(u => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: [...u.topics, {
                id: `t-${Date.now()}`,
                name: fields.name.trim(),
                status: 'Not Started',
                plannedDate: fields.plannedDate || null,
              }],
            };
          }),
        };
      }),
    }));
  }, [setData]);

  const deleteTopic = useCallback((courseId, unitId, topicId) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          units: c.units.map(u => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: u.topics.filter(t => t.id !== topicId),
            };
          }),
        };
      }),
    }));
  }, [setData]);

  const updateTopicStatus = useCallback((courseId, unitId, topicId, status) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          units: c.units.map(u => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: u.topics.map(t => {
                if (t.id !== topicId) return t;
                return { ...t, status };
              }),
            };
          }),
        };
      }),
    }));
  }, [setData]);

  // ── Assessment mutations ─────────────────────────────────────────────────
  const addAssessment = useCallback((courseId, fields) => {
    const obtained = Number(fields.obtainedMarks);
    const max = Number(fields.maxMarks);
    if (isNaN(obtained) || isNaN(max) || max <= 0) {
      return { error: 'Please provide valid mark numbers.' };
    }
    if (obtained > max) {
      return { error: 'Obtained marks cannot exceed maximum marks.' };
    }

    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          assessments: [...(c.assessments || []), {
            id: `a-${Date.now()}`,
            name: fields.name.trim(),
            obtainedMarks: obtained,
            maxMarks: max,
          }],
        };
      }),
    }));
    return { error: null };
  }, [setData]);

  const deleteAssessment = useCallback((courseId, assessmentId) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          assessments: (c.assessments || []).filter(a => a.id !== assessmentId),
        };
      }),
    }));
  }, [setData]);

  // ── Goal mutations ───────────────────────────────────────────────────────
  const addGoal = useCallback((fields) => {
    const title = fields.title?.trim();
    if (!title) return { error: 'Goal title cannot be empty.' };

    setData(prev => ({
      ...prev,
      goals: [{
        id: `g-${Date.now()}`,
        title,
        category: fields.category || 'Weekly',
        deadline: fields.deadline || '',
        courseId: fields.courseId || null,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
      }, ...prev.goals],
    }));
    return { error: null };
  }, [setData]);

  const toggleGoal = useCallback((id) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== id) return g;
        const nextCompleted = !g.completed;
        return {
          ...g,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null,
        };
      }),
    }));
  }, [setData]);

  const deleteGoal = useCallback((id) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
    }));
  }, [setData]);

  // ── Utility Actions ──────────────────────────────────────────────────────
  const loadSample = useCallback(() => {
    const sample = getSampleData();
    setData(sample);
  }, [setData]);

  const resetAll = useCallback(() => {
    clearData();
    rawSetData(emptyState());
  }, []);

  return {
    data,
    courses,
    goals,
    user,
    stats,
    priorityGoals,
    // mutations
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
  };
}
