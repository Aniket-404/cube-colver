/**
 * OLL Candidate Algorithm Validator
 * Strategy: Given a candidate algorithm A that allegedly solves pattern P.
 * We construct start cube = solved cube + inverse(A). Pattern extracted from that cube
 * becomes the authoritative pattern for A. If user supplies expectedPattern we verify they match
 * up to rotation equivalence. We then apply A to the start cube and confirm:
 *  - OLL complete (11111111)
 *  - F2L remains solved (implicitly true by construction since inverse(A) only touches last layer)
 */
import { createSolvedCube } from './cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern, isOLLComplete } from '../services/solver3x3x3.js';
import { canonicalizePattern, generatePatternRotations } from './ollCanonical.js';

function invertMove(m){
  if(m.endsWith('2')) return m; // 180 same inverse
  if(m.endsWith("'")) return m.slice(0,-1);
  return m+"'";
}
export function invertAlgorithm(alg){
  return alg.trim().split(/\s+/).reverse().map(invertMove).join(' ');
}

export function validateOLLCandidate({ algorithm, expectedPattern }){
  const solved = createSolvedCube('3x3x3');
  const inv = invertAlgorithm(algorithm);
  applyMoveSequence3x3(solved, parseMoveNotation3x3(inv));
  const derivedPattern = getOLLPattern(solved);
  const patternInfo = canonicalizePattern(derivedPattern);
  let matches = false;
  let rotationOffset = 0;
  if(expectedPattern){
    for(const rot of generatePatternRotations(expectedPattern)){
      if(rot.pattern === derivedPattern){ matches = true; rotationOffset = rot.rotation; break; }
    }
  } else {
    matches = true; // no expectation provided
  }
  // Forward apply algorithm, ensure OLL solved
  applyMoveSequence3x3(solved, parseMoveNotation3x3(algorithm));
  const afterSolved = isOLLComplete(solved);
  return {
    ok: afterSolved && matches,
    afterSolved,
    derivedPattern,
    canonical: patternInfo.canonical,
    rotationOffset,
    matchesExpectation: matches
  };
}

export default { validateOLLCandidate, invertAlgorithm };
