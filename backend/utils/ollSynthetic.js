/**
 * Synthetic OLL State Generator
 * Build orientation-only scrambles by composing inverses of known OLL algs while preserving F2L.
 */
import { createSolvedCube } from './cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern } from '../services/solver3x3x3.js';
import { invertAlgorithm } from './ollCandidateValidator.js';

// Source pool (must remain orientation-preserving with solved F2L assumption)
const SOURCE_ALGS = [
  "R U2 R' U' R U' R'", // Sune
  "R U R' U R U2 R'",  // Anti-Sune alt
  "F R U R' U' F'",    // T
  "r U R' U' r' F R F'" // L-shape
];

export function generateSyntheticOLLState(depth=2){
  const cube = createSolvedCube('3x3x3');
  let scramble = [];
  for(let i=0;i<depth;i++){
    const alg = SOURCE_ALGS[Math.floor(Math.random()*SOURCE_ALGS.length)];
    const inv = invertAlgorithm(alg);
    scramble.push(inv);
    applyMoveSequence3x3(cube, parseMoveNotation3x3(inv));
  }
  const pattern = getOLLPattern(cube);
  return { cube, pattern, scramble: scramble.join(' ') };
}

export function batchSyntheticStates(count=20, depth=2){
  const out = [];
  for(let i=0;i<count;i++) out.push(generateSyntheticOLLState(depth));
  return out;
}

export default { generateSyntheticOLLState, batchSyntheticStates };
