/**
 * Reverse mining for OLL algorithms: generate known safe orientation algs, apply them to solved cube,
 * then take inverse to obtain candidate start states / algorithms for patterns we lack.
 */
import { createSolvedCube } from './cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern, isOLLComplete } from '../services/solver3x3x3.js';

// Core seed algorithms (orientation-preserving / well-known OLL cases)
const BASE = [
  "R U2 R' U' R U' R'",           // Sune
  "L' U2 L U L' U L",            // Anti-Sune
  "F R U R' U' F'",              // T
  "r U R' U' r' F R F'",         // L-shape
  "R U R' U R U2 R'",            // Anti-Sune (alt)
  "R2 D R' U2 R D' R' U2 R'",     // Small lightning (longer, diversity)
];

// Generate simple U-conjugations (U^k A U^-k) for k in 1..3 to diversify orientation starting states
function uConjugates(alg){
  const variants = new Set([alg]);
  const u = ['U','U2',"U'"];
  for(const pre of u){
    let post;
    if(pre === 'U') post = "U'"; else if(pre === "U'") post = 'U'; else post = 'U2';
    variants.add(`${pre} ${alg} ${post}`);
  }
  return [...variants];
}

function mirrorAlg(alg){
  // Quick and dirty mirror across M-slice: swap R<->L', r<->l', F stays, U stays. Accept approximation.
  return alg.replace(/R2/g,'@R2@').replace(/L2/g,'@L2@')
    .replace(/R'/g,'@Rp@').replace(/R /g,'@R @')
    .replace(/L'/g,'@Lp@').replace(/L /g,'@L @')
    .replace(/R/g,'L').replace(/L/g,'R')
    .replace(/@R2@/g,'R2').replace(/@L2@/g,'L2')
    .replace(/@Rp@/g,'R').replace(/@R @/g,"R' ")
    .replace(/@Lp@/g,'L').replace(/@L @/g,"L' ");
}

const SAFE_BASE_ALGS = (()=>{
  const set = new Set();
  for(const base of BASE){
    for(const variant of uConjugates(base)){
      set.add(variant);
      // Include mirror to broaden coverage
      set.add(mirrorAlg(variant));
    }
  }
  return [...set];
})();

function invertAlgorithm(alg){
  return alg.trim().split(/\s+/).reverse().map(m=>{
    if(m.endsWith("2")) return m; // 180 inverse is itself
    if(m.endsWith("'")) return m.slice(0,-1);
    return m+"'";
  }).join(' ');
}

function cloneState(state){
  return { faces: Object.fromEntries(Object.entries(state.faces).map(([k,v])=>[k,[...v]])) };
}

export function mineOLLPatterns(iterations=200){
  const map = {}; // pattern -> { algorithms: Set }
  for(let i=0;i<iterations;i++){
    for(const base of SAFE_BASE_ALGS){
      const cube = createSolvedCube('3x3x3');
      // pre-scramble with random U rotations to diversify
      const uTwists = ['','U','U2',"U'"][Math.floor(Math.random()*4)];
      if(uTwists){
        applyMoveSequence3x3(cube, parseMoveNotation3x3(uTwists));
      }
      applyMoveSequence3x3(cube, parseMoveNotation3x3(base));
      // Now cube is oriented (OLL solved). Invert base to get starting state algorithm
      const inverse = invertAlgorithm(base);
      const startCube = createSolvedCube('3x3x3');
      if(uTwists){
        applyMoveSequence3x3(startCube, parseMoveNotation3x3(uTwists));
      }
      applyMoveSequence3x3(startCube, parseMoveNotation3x3(inverse));
      const pattern = getOLLPattern(startCube);
      if(!map[pattern]) map[pattern] = { candidates: new Set() };
      map[pattern].candidates.add(base); // base solves that pattern after applied
    }
  }
  // Serialize sets
  const result = Object.fromEntries(Object.entries(map).map(([p,obj])=>[p,{ algorithms:[...obj.candidates] }]));
  return result;
}

export function deriveAlgorithmForPattern(pattern, mined){
  if(mined[pattern]){
    // Choose shortest algorithm (all base are similar length here)
    return mined[pattern].algorithms[0];
  }
  return null;
}
