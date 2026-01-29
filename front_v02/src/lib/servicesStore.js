// src/lib/servicesStore.js
import localStore from "./localStore";
import servicesSeed from "../data/servicesData";

//  bump version so we ignore old empty localStorage data
const STORAGE_KEY = "brisk_services_v3";

function ensureInit() {
  const safeSeed = Array.isArray(servicesSeed) ? servicesSeed : [];

  const items = localStore.initWithSeed(STORAGE_KEY, safeSeed);

  // For this marketing site, we never want a permanently empty list.
  // If something wrote [], reseed from file.
  if (!Array.isArray(items) || items.length === 0) {
    localStore.clear(STORAGE_KEY);
    return localStore.initWithSeed(STORAGE_KEY, safeSeed);
  }

  return items;
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

function getFeatured(limit = 3) {
  const items = ensureInit();
  const featured = items.filter((item) => item.isFeatured || item.is_featured);

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
