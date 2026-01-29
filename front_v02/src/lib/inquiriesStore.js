// src/lib/inquiriesStore.js
// Front-only store for contact/quote inquiries.

import localStore from "./localStore";
import inquiriesSeed from "../data/inquiriesData";

const STORAGE_KEY = "brisk_inquiries_v1";

function ensureInit() {
  const safeSeed = Array.isArray(inquiriesSeed) ? inquiriesSeed : [];
  return localStore.initWithSeed(STORAGE_KEY, safeSeed);
}

function list() {
  return ensureInit();
}

function listByStatus(status) {
  const items = ensureInit();
  if (!status) return items;
  return items.filter((q) => q.status === status);
}

function create(payload) {
  const items = ensureInit();
  const now = new Date().toISOString();
  const id =
    payload.id ||
    `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const record = {
    ...payload,
    id,
    status: payload.status || "new",
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

  const next = items.map((q) => {
    if (q.id !== id) return q;
    updated = {
      ...q,
      ...changes,
      id: q.id,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  localStore.save(STORAGE_KEY, next);
  return updated;
}

function updateStatus(id, status) {
  return update(id, { status });
}

function reset() {
  localStore.clear(STORAGE_KEY);
  return ensureInit();
}

const InquiriesStore = {
  list,
  listByStatus,
  create,
  update,
  updateStatus,
  reset,
};

export default InquiriesStore;
