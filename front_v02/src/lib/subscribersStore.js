// src/lib/subscribersStore.js
// Front-only store for newsletter subscribers.

import localStore from "./localStore";
import subscribersSeed from "../data/subscribersData";

const STORAGE_KEY = "brisk_subscribers_v1";

function ensureInit() {
  const safeSeed = Array.isArray(subscribersSeed) ? subscribersSeed : [];
  return localStore.initWithSeed(STORAGE_KEY, safeSeed);
}

function list() {
  return ensureInit();
}

function add(email, source = "footer_form") {
  const items = ensureInit();
  const now = new Date().toISOString();
  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const record = {
    id,
    email,
    source,
    createdAt: now,
    created_at: now, // for AdminSubscribers formatting
  };

  const next = [...items, record];
  localStore.save(STORAGE_KEY, next);
  return record;
}

function removeById(id) {
  const items = ensureInit();
  const next = items.filter((sub) => sub.id !== id);
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

const SubscribersStore = {
  list,
  add,
  removeById,
  reset,
};

export default SubscribersStore;
