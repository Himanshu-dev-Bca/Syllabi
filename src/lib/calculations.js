/**
 * lib/calculations.js
 * Pure functions for academic metric derivation.
 * No side effects, no React imports — testable in isolation.
 */

/** Returns completed-topic percentage (0–100) for a single course. */
export function courseCompletion(course) {
  let total = 0;
  let done = 0;
  for (const unit of course.units) {
    for (const topic of unit.topics) {
      total++;
      if (topic.status === 'Completed') done++;
    }
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/** Returns completed-topic percentage (0–100) across all courses. */
export function overallCompletion(courses) {
  let total = 0;
  let done = 0;
  for (const course of courses) {
    for (const unit of course.units) {
      for (const topic of unit.topics) {
        total++;
        if (topic.status === 'Completed') done++;
      }
    }
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/** Returns count of non-completed topics across all courses. */
export function pendingTopicCount(courses) {
  let count = 0;
  for (const course of courses) {
    for (const unit of course.units) {
      for (const topic of unit.topics) {
        if (topic.status !== 'Completed') count++;
      }
    }
  }
  return count;
}

/**
 * Returns aggregated assessment score percentage (0–100) for a course.
 * Returns null when no assessments exist (not 0, to allow UI to distinguish).
 */
export function courseAssessmentScore(course) {
  if (!course.assessments || course.assessments.length === 0) return null;
  let obtained = 0;
  let max = 0;
  for (const a of course.assessments) {
    obtained += Number(a.obtainedMarks);
    max += Number(a.maxMarks);
  }
  return max === 0 ? 0 : Math.round((obtained / max) * 100);
}

/**
 * Calculates SGPA using 10-point grade scale.
 * Returns null when no courses with assessments exist.
 */
export function calculateSgpa(courses) {
  let weightedPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const pct = courseAssessmentScore(course);
    if (pct === null) continue; // skip unassessed courses

    let gp = 0;
    if (pct >= 90) gp = 10;
    else if (pct >= 80) gp = 9;
    else if (pct >= 70) gp = 8;
    else if (pct >= 60) gp = 7;
    else if (pct >= 50) gp = 6;
    else if (pct >= 40) gp = 5;
    else gp = 0;

    weightedPoints += gp * course.credits;
    totalCredits += course.credits;
  }

  if (totalCredits === 0) return null;
  return (weightedPoints / totalCredits).toFixed(2);
}

/**
 * Returns initials from a full name string.
 * "Alex Morgan" → "AM", "John" → "JO"
 */
export function nameInitials(name) {
  if (!name || typeof name !== 'string') return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Returns goals whose deadline falls within the current calendar week.
 * Uses ISO week (Mon–Sun).
 */
export function goalsCompletedThisWeek(goals) {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Mon = 0
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return goals.filter(g => {
    if (!g.completed || !g.completedAt) return false;
    const d = new Date(g.completedAt);
    return d >= weekStart && d < weekEnd;
  }).length;
}

/** Returns goals sorted by deadline ascending, incomplete first. */
export function sortedGoals(goals) {
  return [...goals].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });
}

/** Generates a stable course color class based on course index. */
const COURSE_COLORS = [
  { badge: 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400', bar: 'bg-blue-600' },
  { badge: 'border-violet-500 text-violet-700 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400', bar: 'bg-violet-600' },
  { badge: 'border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400', bar: 'bg-amber-500' },
  { badge: 'border-teal-500 text-teal-700 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400', bar: 'bg-teal-600' },
  { badge: 'border-rose-500 text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400', bar: 'bg-rose-500' },
  { badge: 'border-cyan-500 text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400', bar: 'bg-cyan-600' },
];

export function courseColors(index) {
  return COURSE_COLORS[index % COURSE_COLORS.length];
}

