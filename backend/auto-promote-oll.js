/**
 * Auto-Promotion Pipeline for Unknown OLL Patterns
 * Steps per target pattern (ordered by frequency):
 *  1. Attempt mining derivation (reuse derive-oll-missing.js by import).
 *  2. For each logged sample state, run bounded search (IDDFS) to find short orientation fix.
 *  3. Validate candidate; if valid, register & persist to derived file.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { listUnknownPatterns } from './utils/ollUnknownLogger.js';
import { registerOLLCase } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';
import { validateOLLCandidate } from './utils/ollCandidateValidator.js';
import { searchOLLFromState } from './search/ollSearchEnhanced.js';
import { heuristicSearchOLL } from './search/ollHeuristicSearch.js';

const DERIVED = resolve(process.cwd(), 'backend', 'data', 'oll-derived.json');

function loadDerived(){
  if(!existsSync(DERIVED)) return { derived: [] };
  try { return JSON.parse(readFileSync(DERIVED,'utf-8')); } catch { return { derived: [] }; }
}
function saveDerived(db){ writeFileSync(DERIVED, JSON.stringify(db,null,2),'utf-8'); }

function reconstructCube(facesObj){
  // Minimal reconstruction using createSolvedCube then overwrite faces
  const solved = createSolvedCube('3x3x3');
  Object.keys(facesObj).forEach(face => solved.faces[face] = [...facesObj[face]]);
  return solved;
}

function main(){
  const unknown = listUnknownPatterns();
  const derived = loadDerived();
  const already = new Set(derived.derived.map(d=>d.pattern));
  const ordered = Object.entries(unknown).sort((a,b)=>b[1].occurrences - a[1].occurrences);
  let promotions = 0;
  for(const [pattern, info] of ordered){
    if(already.has(pattern)) continue;
    console.log(`\n🔎 Attempting promotion for pattern ${pattern} (occurrences=${info.occurrences})`);
    if(!info.samples || info.samples.length === 0){
      console.log(' No sample states recorded; skipping for now');
      continue;
    }
    let found = null;
    for(const sample of info.samples){
      try {
        const faces = JSON.parse(sample.cubeStateSerialized);
        const cube = reconstructCube(faces);
        const res = searchOLLFromState(cube, 7);
        if(res.success){
          console.log(`  ✅ Found candidate algorithm: ${res.algorithm}`);
          const validation = validateOLLCandidate({ algorithm: res.algorithm, expectedPattern: pattern });
            if(validation.ok){
              found = { algorithm: res.algorithm, validation };
              break;
            } else {
              console.log('  ❌ Validation failed after search candidate');
            }
        }
        if(!found){
          const hRes = heuristicSearchOLL(cube, { maxDepth: 12 });
          if(hRes.success){
            console.log(`  ✅ Heuristic search found candidate: ${hRes.algorithm} (depth ${hRes.depth})`);
            const v2 = validateOLLCandidate({ algorithm: hRes.algorithm, expectedPattern: pattern });
            if(v2.ok){
              found = { algorithm: hRes.algorithm, validation: v2 };
              break;
            } else {
              console.log('  ❌ Heuristic candidate failed validation');
            }
          }
        }
      } catch(e){ console.log('  Sample parse error:', e.message); }
    }
    if(found){
      const entry = {
        id: 9000 + derived.derived.length,
        pattern,
        algorithm: found.algorithm,
        canonical: found.validation.canonical,
        rotationApplied: found.validation.rotationOffset,
        source: 'search-sample',
        timestamp: new Date().toISOString()
      };
      derived.derived.push(entry);
      registerOLLCase({ id: entry.id, pattern: entry.pattern, algorithm: entry.algorithm, name: `Promoted ${pattern}`, verified: false, notes: entry.source });
      promotions++;
      console.log(`  🚀 Promoted new OLL case for pattern ${pattern}`);
    } else {
      console.log('  ⚠️ No candidate algorithm discovered within depth bound');
    }
  }
  if(promotions>0) saveDerived(derived);
  console.log(`\nSummary: Promoted ${promotions} pattern(s).`);
}

main();
