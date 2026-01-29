// src/lib/usersStore.js
// Front-only store for Users / RBAC demo.

import localStore from "./localStore";
import usersSeed from "../data/usersData";

const STORAGE_KEY = "brisk_users_v1";

function ensureInit() {
  const safeSeed = Array.isArray(usersSeed) ? usersSeed : [];
  return localStore.initWithSeed(STORAGE_KEY, safeSeed);
}

function list() {
  return ensureInit();
}

function getById(id) {
  const items = ensureInit();
  return items.find((u) => u.id === id) || null;
}

function updateRole(id, role) {
  const items = ensureInit();
  let updated = null;

  const next = items.map((u) => {
    if (u.id !== id) return u;
    updated = {
      ...u,
      role,
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

const UsersStore = {
  list,
  getById,
  updateRole,
  reset,
};

export default UsersStore;
