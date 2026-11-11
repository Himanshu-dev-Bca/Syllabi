/**
 * lib/storage.js
 * Thin localStorage wrapper with structured error handling.
 * All app data is persisted here so user work survives page refresh.
 */

const KEY = 'syllabi_v1';

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded or private browsing restriction — silent fail.
    // The app still works in-memory for the session.
  }
}

export function clearData() {
  localStorage.removeItem(KEY);
}

