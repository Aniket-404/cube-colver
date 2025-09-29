/**
 * Discover algorithms that PRODUCE a target OLL pattern from solved cube.
 * Once we find A such that solved + A => targetPattern, then inverse(A) solves that pattern.
 */
import { createSolvedCube } from '../utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern } from '../services/solver3x3x3.js';
import { cloneCubeState } from '../utils/cubeStructures.js';
import { invertAlgorithm } from '../utils/ollCandidateValidator.js';

const MOVE_SET = ['R','R"','R2','U','U"','U2','F','F"','F2'].map(m=>m.replace('"',"'"));

export function discoverProducerForPattern(targetPattern, maxDepth=8){
  const solved = createSolvedCube('3x3x3');
  if(getOLLPattern(solved) === targetPattern){
    return { success:true, producingAlgorithm:'', solvingAlgorithm:'', depth:0 };
  }
  const queue = [{ cube: solved, path: [] }];
  const visited = new Set([getOLLPattern(solved)]);
  while(queue.length){
    const node = queue.shift();
    if(node.path.length >= maxDepth) continue;
    for(const mv of MOVE_SET){
      const next = cloneCubeState(node.cube);
      applyMoveSequence3x3(next, parseMoveNotation3x3(mv));
      const pat = getOLLPattern(next);
      if(pat === targetPattern){
        const producing = [...node.path, mv].join(' ');
        return { success:true, producingAlgorithm: producing, solvingAlgorithm: invertAlgorithm(producing), depth: producing.split(/\s+/).filter(Boolean).length };
      }
      if(!visited.has(pat)){
        visited.add(pat);
        queue.push({ cube: next, path: [...node.path, mv] });
      }
    }
  }
  return { success:false };
}

export default { discoverProducerForPattern };
