// src/lib/campaignsStore.js
// Front-only store for donation campaigns (for Donate page + AdminCampaigns).

import localStore from "./localStore";
import campaignsSeed from "../data/campaignsData";

const STORAGE_KEY = "brisk_campaigns_v1";

function ensureInit() {
  const safeSeed = Array.isArray(campaignsSeed) ? campaignsSeed : [];
  return localStore.initWithSeed(STORAGE_KEY, safeSeed);
}

function list() {
  return ensureInit();
}

function getById(id) {
  const items = ensureInit();
  return items.find((c) => c.id === id) || null;
}

function getActive() {
  const items = ensureInit();
  return items.filter((c) => c.isActive !== false);
}

function create(payload) {
  const items = ensureInit();
  const now = new Date().toISOString();
  const id =
    payload.id ||
    `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const record = {
    ...payload,
    id,
    isActive: payload.isActive !== false,
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

  const next = items.map((c) => {
    if (c.id !== id) return c;
    updated = {
      ...c,
      ...changes,
      id: c.id,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  localStore.save(STORAGE_KEY, next);
  return updated;
}

function toggleActive(id) {
  const items = ensureInit();
  let updated = null;

  const next = items.map((c) => {
    if (c.id !== id) return c;
    updated = {
      ...c,
      isActive: !c.isActive,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  localStore.save(STORAGE_KEY, next);
  return updated;
}

function reset() {
  localStore.clear(STORAGE_KEY);
  return ensureInit();
}

const CampaignsStore = {
  list,
  getById,
  getActive,
  create,
  update,
  toggleActive,
  reset,
};

export default CampaignsStore;
