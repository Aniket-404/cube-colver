import { createRequire } from 'module';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const require = createRequire(import.meta.url);

const LOG_PATH = resolve(process.cwd(), 'backend', 'logs', 'oll-unknown.json');

function ensureDir() {
  const dir = dirname(LOG_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function load() {
  try {
    if (existsSync(LOG_PATH)) {
      return JSON.parse(readFileSync(LOG_PATH, 'utf-8'));
    }
  } catch (e) {
    console.warn('OLL Logger load error:', e.message);
  }
  return { patterns: {} };
}

function save(data) {
  try {
    ensureDir();
    writeFileSync(LOG_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('OLL Logger save error:', e.message);
  }
}

export function recordUnknownOLL({ pattern, cubeStateSerialized, orientationScore, attemptIndex }) {
  try {
    const db = load();
    if (!db.patterns[pattern]) {
      db.patterns[pattern] = { occurrences: 0, samples: [] };
    }
    const entry = db.patterns[pattern];
    entry.occurrences += 1;
    if (entry.samples.length < 5) {
      entry.samples.push({
        ts: new Date().toISOString(),
        orientationScore,
        attemptIndex,
        cubeStateSerialized
      });
    }
    save(db);
  } catch (e) {
    console.warn('Failed to record unknown OLL pattern', e.message);
  }
}

export function listUnknownPatterns() {
  return load().patterns;
}

export function clearUnknownPatterns() {
  save({ patterns: {} });
}

export function getLogFilePath() { return LOG_PATH; }
