// src/lib/donationsStore.js
// Front-only store for Donations (AdminDonations + widgets).

import localStore from "./localStore";
import donationsSeed from "../data/donationsData";

const STORAGE_KEY = "brisk_donations_v1";

function ensureInit() {
  const safeSeed = Array.isArray(donationsSeed) ? donationsSeed : [];
  return localStore.initWithSeed(STORAGE_KEY, safeSeed);
}

function list() {
  return ensureInit();
}

function listByCampaign(campaignId) {
  const items = ensureInit();
  if (!campaignId) return items;
  return items.filter((d) => d.campaignId === campaignId || d.campaign_id === campaignId);
}

function listByStatus(status) {
  const items = ensureInit();
  if (!status) return items;
  return items.filter((d) => d.status === status);
}

/**
 * Filter donations using an object shaped like:
 * {
 *   campaignId,
 *   status,
 *   dateFrom, dateTo,   // ISO strings or Date
 *   minAmount, maxAmount
 * }
 */
function filterDonations(filters = {}) {
  const {
    campaignId,
    status,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
  } = filters;

  const items = ensureInit();

  return items.filter((d) => {
    if (campaignId && d.campaignId !== campaignId && d.campaign_id !== campaignId) {
      return false;
    }

    if (status && d.status !== status) {
      return false;
    }

    const amt = typeof d.amount === "number" ? d.amount : Number(d.amount ?? 0);
    if (minAmount != null && amt < minAmount) return false;
    if (maxAmount != null && amt > maxAmount) return false;

    if (dateFrom || dateTo) {
      const created = d.createdAt || d.created_at;
      if (created) {
        const createdDate = new Date(created);
        if (dateFrom && createdDate < new Date(dateFrom)) return false;
        if (dateTo && createdDate > new Date(dateTo)) return false;
      }
    }

    return true;
  });
}

function create(payload) {
  const items = ensureInit();
  const now = new Date().toISOString();
  const id =
    payload.id ||
    `don_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

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

  const next = items.map((d) => {
    if (d.id !== id) return d;
    updated = {
      ...d,
      ...changes,
      id: d.id,
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

const DonationsStore = {
  list,
  listByCampaign,
  listByStatus,
  filterDonations,
  create,
  update,
  reset,
};

export default DonationsStore;
