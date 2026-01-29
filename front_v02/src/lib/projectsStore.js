// src/lib/projectsStore.js
// Front-only store for Projects domain.

import localStore from "./localStore";
import projectsSeed from "../data/projectsData";

const STORAGE_KEY = "brisk_projects_v1";

function ensureInit() {
  const safeSeed = Array.isArray(projectsSeed) ? projectsSeed : [];
  return localStore.initWithSeed(STORAGE_KEY, safeSeed);
}

function list() {
  return ensureInit();
}

function getById(id) {
  const items = ensureInit();
  return items.find((p) => p.id === id) || null;
}

function getBySlug(slug) {
  const items = ensureInit();
  return items.find((p) => p.slug === slug) || null;
}

function getFeatured(limit = 3) {
  const items = ensureInit();
  const featured = items.filter((p) => p.isFeatured);
  if (featured.length >= limit) return featured.slice(0, limit);
  return items.slice(0, limit);
}

function create(payload) {
  const items = ensureInit();
  const now = new Date().toISOString();
  const id =
    payload.id ||
    `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

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

  const next = items.map((p) => {
    if (p.id !== id) return p;
    updated = {
      ...p,
      ...changes,
      id: p.id,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  localStore.save(STORAGE_KEY, next);
  return updated;
}

function remove(id) {
  const items = ensureInit();
  const next = items.filter((p) => p.id !== id);
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

const ProjectsStore = {
  list,
  getById,
  getBySlug,
  getFeatured,
  create,
  update,
  remove,
  reset,
};

export default ProjectsStore;
