/**
 * OLL Pattern Canonicalization Utilities
 * We normalize (canonicalize) an 8-bit OLL orientation pattern by choosing the lexicographically
 * smallest rotation among the 4 U-face rotations. This lets us cluster equivalent patterns and
 * reduce mining / search duplication. We also expose helpers to rotate algorithms correspondingly.
 */

import { parseMoveNotation3x3 } from '../services/solver3x3x3.js';

/**
 * Rotate an 8-bit OLL pattern n times (90° clockwise each time)
 * Pattern order: [ULB, UB, URB, UL, UR, ULF, UF, URF]
 */
export function rotatePatternBits(pattern, rotations=1){
  if(!pattern || pattern.length !== 8) return pattern;
  let res = pattern;
  for(let r=0;r<rotations;r++){
    const o = res;
    res = o[5] + o[3] + o[0] + o[6] + o[1] + o[7] + o[4] + o[2];
  }
  return res;
}

/**
 * Generate all 4 rotations with rotation index meta
 */
export function generatePatternRotations(pattern){
  const list = [];
  let cur = pattern;
  for(let i=0;i<4;i++){
    list.push({ pattern: cur, rotation: i });
    cur = rotatePatternBits(cur,1);
  }
  return list;
}

/**
 * Canonicalize pattern -> { canonical, rotation }
 */
export function canonicalizePattern(pattern){
  const rots = generatePatternRotations(pattern);
  let best = rots[0];
  for(const r of rots){
    if(r.pattern < best.pattern) best = r;
  }
  return { canonical: best.pattern, rotation: best.rotation };
}

/**
 * Adjust an algorithm that solves a canonical pattern so that it solves a rotated variant.
 * If an algorithm A solves pattern P (canonical). For a target variant requiring k clockwise U rotations
 * to become canonical, we can: (1) pre-apply k U moves to align to canonical orientation, run A, then
 * undo k U moves to restore cube orientation relative to original reference frame. In practice for OLL
 * we only need to pre-rotate and then not undo (because orientation solved ROI), but leaving both for clarity.
 * We provide two strategies; default returns pre-rotation only which is typical in human algorithms.
 */
export function adaptAlgorithmForRotation(algorithm, rotation, strategy='pre'){ // rotation: number of clockwise 90° turns needed to reach canonical
  if(rotation === 0) return algorithm;
  const prefix = Array(rotation).fill('U').join(' ');
  if(strategy === 'pre'){ return `${prefix} ${algorithm}`.trim(); }
  // full sandwich variant (pre + inverse post) if needed elsewhere
  const suffix = Array(rotation).fill("U'").join(' ');
  return `${prefix} ${algorithm} ${suffix}`.trim();
}

/**
 * Quick utility to count oriented stickers (1s) for heuristic usage
 */
export function orientationScore(pattern){
  return (pattern.match(/1/g)||[]).length;
}

export default {
  rotatePatternBits,
  generatePatternRotations,
  canonicalizePattern,
  adaptAlgorithmForRotation,
  orientationScore
};
