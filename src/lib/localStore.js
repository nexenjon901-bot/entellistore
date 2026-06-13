import { DEFAULT_DATA } from '../../shared/defaults.js';

const DATA_KEY = 'entelli_cloud_data';
const DEFAULT = { ...DEFAULT_DATA };

export function readLocalData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

export function writeLocalData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function applyLocalPatch(patch) {
  const current = readLocalData();
  const next = { ...current, ...patch };
  writeLocalData(next);
  return next;
}
