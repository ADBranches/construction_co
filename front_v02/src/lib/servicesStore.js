// src/lib/servicesStore.js
// Front-only “fake backend” for Services domain.

import localStore from "./localStore";
import servicesSeed from "../data/servicesData";

const STORAGE_KEY = "brisk_services_v1";

function ensureInit() {
  // Always treat seed as an array
  const safeSeed = Array.isArray(servicesSeed) ? servicesSeed : [];
  return localStore.initWithSeed(STORAGE_KEY, safeSeed);
}

function list() {
  return ensureInit();
}

function getById(id) {
  const items = ensureInit();
  return items.find((item) => item.id === id) || null;
}

function getBySlug(slug) {
  const items = ensureInit();
  return items.find((item) => item.slug === slug) || null;
}

/**
 * Return a small set of “featured” services.
 * - If items have `isFeatured` flag → use that.
 * - Otherwise just take the first N.
 */
function getFeatured(limit = 3) {
  const items = ensureInit();
  const featured = items.filter((item) => item.isFeatured);
  if (featured.length >= limit) return featured.slice(0, limit);
  return items.slice(0, limit);
}

function create(payload) {
  const items = ensureInit();
  const now = new Date().toISOString();

  const id =
    payload.id ||
    `svc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

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

  const next = items.map((item) => {
    if (item.id !== id) return item;
    updated = {
      ...item,
      ...changes,
      id: item.id,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  localStore.save(STORAGE_KEY, next);
  return updated;
}

function remove(id) {
  const items = ensureInit();
  const next = items.filter((item) => item.id !== id);
  const changed = next.length !== items.length;
  if (changed) {
    localStore.save(STORAGE_KEY, next);
  }
  return changed;
}

/**
 * Reset Services back to seed. Good for tests / “Reset demo data”.
 */
function reset() {
  localStore.clear(STORAGE_KEY);
  return ensureInit();
}

const ServicesStore = {
  list,
  getById,
  getBySlug,
  getFeatured,
  create,
  update,
  remove,
  reset,
};

export default ServicesStore;
