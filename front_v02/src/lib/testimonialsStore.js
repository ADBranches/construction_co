// src/lib/testimonialsStore.js
// Front-only store for Testimonials.

import localStore from "./localStore";
import testimonialsSeed from "../data/testimonialsData";

const STORAGE_KEY = "brisk_testimonials_v1";

function ensureInit() {
  const safeSeed = Array.isArray(testimonialsSeed) ? testimonialsSeed : [];
  return localStore.initWithSeed(STORAGE_KEY, safeSeed);
}

function listAll() {
  return ensureInit();
}

function listPublic() {
  const items = ensureInit();
  return items.filter((t) => t.isActive !== false);
}

function create(payload) {
  const items = ensureInit();
  const now = new Date().toISOString();
  const id =
    payload.id ||
    `tst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const record = {
    ...payload,
    id,
    createdAt: payload.createdAt || now,
    updatedAt: now,
  };

  const next = [...items, record];
  localStore.save(STORAGE_KEY, next);
  return record;
}

function update(id, changes) {
  const items = ensureInit();
  let updated = null;

  const next = items.map((t) => {
    if (t.id !== id) return t;
    updated = {
      ...t,
      ...changes,
      id: t.id,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  localStore.save(STORAGE_KEY, next);
  return updated;
}

function remove(id) {
  const items = ensureInit();
  const next = items.filter((t) => t.id !== id);
  const changed = next.length !== items.length;
  if (changed) {
    localStore.save(STORAGE_KEY, next);
  }
  return changed;
}

function reset() {
  localStore.clear(STORAGE_KEY);
  return ensureInit();
}

const TestimonialsStore = {
  listAll,
  listPublic,
  create,
  update,
  remove,
  reset,
};

export default TestimonialsStore;
