/**
 * Derive & Promote Missing OLL Algorithms
 * 1. Mine patterns via reverse application of safe OLL algs.
 * 2. Compare mined patterns (and their rotations) with logged unknown & placeholder patterns.
 * 3. Validate candidate algorithms.
 * 4. Persist provenance to backend/data/oll-derived.json and register live in solver.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { mineOLLPatterns } from './utils/ollPatternMining.js';
import { discoverProducerForPattern } from './search/ollPatternDiscovery.js';
import { listUnknownPatterns } from './utils/ollUnknownLogger.js';
import { registerOLLCase } from './services/solver3x3x3.js';
import { validateOLLCandidate } from './utils/ollCandidateValidator.js';
import { generatePatternRotations, canonicalizePattern, adaptAlgorithmForRotation } from './utils/ollCanonical.js';

const DERIVED_PATH = resolve(process.cwd(), 'backend', 'data', 'oll-derived.json');

function loadDerived(){
  if(!existsSync(DERIVED_PATH)) return { derived: [] };
  try { return JSON.parse(readFileSync(DERIVED_PATH,'utf-8')); } catch { return { derived: [] }; }
}
function saveDerived(data){
  const dir = dirname(DERIVED_PATH); if(!existsSync(dir)) mkdirSync(dir,{recursive:true});
  writeFileSync(DERIVED_PATH, JSON.stringify(data,null,2),'utf-8');
}

// Placeholder patterns to prioritize
const PLACEHOLDERS = ["01110010","11011000","00011000","11101011"]; 

function main(){
  const iterations = parseInt(process.argv.includes('--mine') ? (process.argv[process.argv.indexOf('--mine')+1]||'400') : '400',10);
  console.log(`🔍 Mining OLL patterns (iterations=${iterations}) ...`);
  const mined = mineOLLPatterns(iterations);
  console.log(`Mined ${Object.keys(mined).length} distinct patterns.`);
  const unknownLog = listUnknownPatterns();
  const targets = new Set([...PLACEHOLDERS, ...Object.keys(unknownLog)]);
  const derivedDb = loadDerived();
  const already = new Set(derivedDb.derived.map(d=>d.pattern));
  let registered = 0;

  for(const target of targets){
    if(already.has(target)) continue; // already derived
    // Direct match
    if(mined[target]){
      const algorithm = mined[target].algorithms[0];
      const validation = validateOLLCandidate({ algorithm, expectedPattern: target });
      if(validation.ok){
        const entry = {
          id: 8000 + derivedDb.derived.length,
            pattern: target,
            algorithm,
            canonical: validation.canonical,
            rotationApplied: 0,
            source: 'reverse-mining-direct',
            iterations,
            timestamp: new Date().toISOString()
        };
        derivedDb.derived.push(entry);
        registerOLLCase({ id: entry.id, pattern: entry.pattern, algorithm: entry.algorithm, name: `Auto-Derived ${entry.pattern}`, verified: false, notes: entry.source });
        console.log(`✅ Derived direct pattern ${target} -> ${algorithm}`);
        registered++;
        continue;
      } else {
        console.log(`⚠️ Validation failed for direct ${target}`);
      }
    }
    // Rotational equivalence search
    let matched = false;
    for(const rot of generatePatternRotations(target)){
      if(mined[rot.pattern]){
        const baseAlg = mined[rot.pattern].algorithms[0];
        // Need to adapt algorithm to solve original orientation (reverse rotation pre-move count)
        // rot.rotation is number of rotations applied to target to reach mined pattern.
        // To go from target state to canonical/mined orientation we apply U^rot.rotation before algorithm.
        const adapted = adaptAlgorithmForRotation(baseAlg, rot.rotation, 'pre');
        const validation = validateOLLCandidate({ algorithm: adapted });
        if(validation.afterSolved){
          const entry = {
            id: 8000 + derivedDb.derived.length,
            pattern: target,
            algorithm: adapted,
            canonical: validation.canonical,
            rotationApplied: rot.rotation,
            source: 'reverse-mining-rotational',
            minedBase: baseAlg,
            iterations,
            timestamp: new Date().toISOString()
          };
          derivedDb.derived.push(entry);
          registerOLLCase({ id: entry.id, pattern: entry.pattern, algorithm: entry.algorithm, name: `Auto-Derived ${entry.pattern}`, verified: false, notes: entry.source });
          console.log(`✅ Derived rotational pattern ${target} via rotation ${rot.rotation*90}° using base ${baseAlg}`);
          registered++;
          matched = true;
          break;
        }
      }
    }
    if(!matched){
      console.log(`❌ No mined match (direct or rotational) for target ${target} — trying forward discovery BFS`);
      const discovery = discoverProducerForPattern(target, 8);
      if(discovery.success){
        const entry = {
          id: 8000 + derivedDb.derived.length,
          pattern: target,
          algorithm: discovery.solvingAlgorithm,
          canonical: canonicalizePattern(target).canonical,
          rotationApplied: 0,
            source: 'forward-discovery',
            discoveredProducing: discovery.producingAlgorithm,
            iterations,
            timestamp: new Date().toISOString()
        };
        derivedDb.derived.push(entry);
        registerOLLCase({ id: entry.id, pattern: entry.pattern, algorithm: entry.algorithm, name: `Auto-Discovered ${entry.pattern}`, verified: false, notes: entry.source });
        console.log(`✅ Forward discovery produced solving algorithm for ${target}: ${entry.algorithm}`);
        registered++;
      }
    }
  }

  if(registered>0){ saveDerived(derivedDb); }
  console.log(`\nSummary: Registered ${registered} new derived OLL cases.`);
}

main();
