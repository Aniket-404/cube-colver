/**
 * Reverse mining for OLL algorithms: generate known safe orientation algs, apply them to solved cube,
 * then take inverse to obtain candidate start states / algorithms for patterns we lack.
 */
import { createSolvedCube } from './cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern, isOLLComplete } from '../services/solver3x3x3.js';

const SAFE_BASE_ALGS = [
  "R U2 R' U' R U' R'",           // Sune
  "L' U2 L U L' U L",            // Anti-Sune
  "F R U R' U' F'",              // T
  "r U R' U' r' F R F'"          // L-shape
];

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
