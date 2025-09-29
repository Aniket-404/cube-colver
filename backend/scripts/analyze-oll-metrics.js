#!/usr/bin/env node
/**
 * OLL Metrics Aggregation Script
 * Reads backend/data/oll-alg-metrics.jsonl and produces summary stats to stdout.
 * Usage: node backend/scripts/analyze-oll-metrics.js [--limit=N] [--json]
 */
import { createReadStream, existsSync } from 'fs';
import { resolve } from 'path';
import readline from 'readline';

const file = resolve(process.cwd(), 'backend', 'data', 'oll-alg-metrics.jsonl');
if(!existsSync(file)){
  console.error('No metrics file found at', file);
  process.exit(1);
}

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const limitArg = args.find(a=>a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1],10) : Infinity;

const stats = {}; // key: caseId -> { attempts, completes, improvements, algorithms:Set }
let total = 0;

const rl = readline.createInterface({ input: createReadStream(file), crlfDelay: Infinity });
for await (const line of rl){
  if(!line.trim()) continue;
  try {
    const e = JSON.parse(line);
    const k = e.caseId || 'unknown';
    stats[k] = stats[k] || { attempts:0, completes:0, improvements:0, algorithms:new Set(), names:new Set(), classifications:new Set() };
    const s = stats[k];
    s.attempts++;
    if(e.complete) s.completes++;
    if(e.improved) s.improvements++;
    if(e.algorithm) s.algorithms.add(e.algorithm);
    if(e.caseName) s.names.add(e.caseName);
    if(e.classification) s.classifications.add(e.classification);
    total++;
    if(total >= limit) break;
  } catch(err){ /* ignore parse errors */ }
}

const rows = Object.entries(stats).map(([caseId, d]) => {
  const impRate = d.attempts ? (d.improvements/d.attempts*100).toFixed(1) : '0.0';
  const compRate = d.attempts ? (d.completes/d.attempts*100).toFixed(1) : '0.0';
  return {
    caseId,
    attempts: d.attempts,
    improvements: d.improvements,
    improvementRate: impRate + '%',
    completes: d.completes,
    completionRate: compRate + '%',
    algVariants: d.algorithms.size,
    names: Array.from(d.names).slice(0,2),
    classifications: Array.from(d.classifications)
  };
});

rows.sort((a,b)=> b.completes - a.completes || b.improvements - a.improvements);

if(asJson){
  console.log(JSON.stringify({ totalRecords: total, cases: rows }, null, 2));
} else {
  console.log(`Processed ${total} metric records. Unique cases: ${rows.length}`);
  console.log('caseId | attempts | improves(%) | completes(%) | algVariants | classifications | exampleName');
  for(const r of rows){
    console.log(`${r.caseId} | ${r.attempts} | ${r.improvementRate} | ${r.completionRate} | ${r.algVariants} | ${r.classifications.join(',')} | ${r.names[0]||''}`);
  }
  console.log('\nRecommendation: Downgrade any finisher with 0% completion & <20% improvement after >=3 attempts.');
}
