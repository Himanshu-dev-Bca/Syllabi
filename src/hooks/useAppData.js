/**
 * hooks/useAppData.js
 * Central data hook — owns all state, persistence and mutations.
 * Components receive data and handlers; they never mutate state directly.
 */

import { useState, useMemo, useCallback } from 'react';
import { loadData, saveData } from '../lib/storage';
import {
  overallCompletion,
  pendingTopicCount,
  calculateSgpa,
  sortedGoals,
  goalsCompletedThisWeek,
  courseColors,
} from '../lib/calculations';

/** Returns a new empty application data structure — no demo records. */
function emptyState() {
  return { courses: [], goals: [], user: null };
}

function withPersist(setter) {
  return (updater) => {
    setter(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveData(next);
      return next;
    });
  };
}

export function useAppData() {
  const [data, rawSetData] = useState(() => loadData() ?? emptyState());
  const setData = useCallback(withPersist(rawSetData), [rawSetData]);

  // ── Derived values (memoized) ────────────────────────────────────────────
  const { courses, goals, user } = data;

  const stats = useMemo(() => ({
    overallProgress: overallCompletion(courses),
    pendingTopics: pendingTopicCount(courses),
    sgpa: calculateSgpa(courses),
    activeGoals: goals.filter(g => !g.completed).length,
    completedThisWeek: goalsCompletedThisWeek(goals),
    totalAssessments: courses.reduce((s, c) => s + (c.assessments?.length ?? 0), 0),
  }), [courses, goals]);

  const priorityGoals = useMemo(() => sortedGoals(goals), [goals]);

  // ── User setup ───────────────────────────────────────────────────────────
  const setupUser = useCallback((userInfo) => {
    setData(prev => ({ ...prev, user: userInfo }));
  }, [setData]);

  const updateUser = useCallback((patch) => {
    setData(prev => ({ ...prev, user: { ...prev.user, ...patch } }));
  }, [setData]);

  // ── Course mutations ─────────────────────────────────────────────────────
  const addCourse = useCallback((fields) => {
    const index = data.courses.length;
    const colors = courseColors(index);
    const course = {
      id: `c-${Date.now()}`,
      code: fields.code.trim().toUpperCase(),
      name: fields.name.trim(),
      credits: Number(fields.credits),
      category: fields.category,
      color: colors.badge,
      accent: colors.bar,
      units: [],
      assessments: [],
    };
    setData(prev => ({ ...prev, courses: [...prev.courses, course] }));
    return course.id;
  }, [data.courses.length, setData]);

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
    if (obtained > max) return { error: 'Obtained marks cannot exceed maximum marks.' };

    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          assessments: [...c.assessments, {
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
        return { ...c, assessments: c.assessments.filter(a => a.id !== assessmentId) };
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
        category: fields.category,
        deadline: fields.deadline,
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
        const nowCompleted = !g.completed;
        return {
          ...g,
          completed: nowCompleted,
          completedAt: nowCompleted ? new Date().toISOString() : null,
        };
      }),
    }));
  }, [setData]);

  const deleteGoal = useCallback((id) => {
    setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  }, [setData]);

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
    addTopic,
    updateTopicStatus,
    addAssessment,
    deleteAssessment,
    addGoal,
    toggleGoal,
    deleteGoal,
  };
}

