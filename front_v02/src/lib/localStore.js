// src/lib/localStore.js
// Tiny wrapper around localStorage with a safe in-memory fallback (for tests / SSR)

const isBrowser = typeof window !== "undefined" && !!window.localStorage;
const memoryStore = new Map();

/**
 * Low-level read helpers
 */
function readRaw(key) {
  if (isBrowser) {
    return window.localStorage.getItem(key);
  }
  return memoryStore.get(key) ?? null;
}

function writeRaw(key, value) {
  if (isBrowser) {
    window.localStorage.setItem(key, value);
  } else {
    memoryStore.set(key, value);
  }
}

function removeRaw(key) {
  if (isBrowser) {
    window.localStorage.removeItem(key);
  } else {
    memoryStore.delete(key);
  }
}

/**
 * Load a JSON value from storage.
 * - If nothing stored -> returns `fallback`
 * - If parsing fails -> logs & returns `fallback`
 */
function load(key, fallback) {
  try {
    const raw = readRaw(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    // Don’t throw in UI, just fall back.
    console.warn("[localStore] Failed to load key:", key, err);
    return fallback;
  }
}

/**
 * Save a JSON-serialisable value under the given key.
 */
function save(key, value) {
  try {
    const raw = JSON.stringify(value);
    writeRaw(key, raw);
  } catch (err) {
    console.warn("[localStore] Failed to save key:", key, err);
  }
}

/**
 * Initialise a key with a seed value once.
 * - If key already has a value -> return existing.
 * - If not -> save(seed) and return seed.
 */
function initWithSeed(key, seedValue) {
  const existing = load(key, null);
  if (existing == null) {
    save(key, seedValue);
    return seedValue;
  }
  return existing;
}

/**
 * Clear a given key (handy for tests / “reset demo data” button).
 */
function clear(key) {
  try {
    removeRaw(key);
  } catch (err) {
    console.warn("[localStore] Failed to clear key:", key, err);
  }
}

const localStore = {
  load,
  save,
  initWithSeed,
  clear,
};

export default localStore;
