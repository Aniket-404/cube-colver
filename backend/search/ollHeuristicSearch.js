/**
 * Heuristic OLL Orientation Solver Search
 * Breadth-first with orientation score pruning.
 */
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern, isOLLComplete } from '../services/solver3x3x3.js';
import { cloneCubeState } from '../utils/cubeStructures.js';
import { canonicalizePattern, orientationScore } from '../utils/ollCanonical.js';

const DEFAULT_MOVES = ['R','R"','R2','U','U"','U2','F','F"','F2'].map(m=>m.replace('"',"'"));

function applyMove(cube, move){
  applyMoveSequence3x3(cube, parseMoveNotation3x3(move));
}

export function heuristicSearchOLL(startCube, { maxDepth=12, moves=DEFAULT_MOVES, allowRegression=1 } = {}){
  if (isOLLComplete(startCube)) return { success:true, algorithm:'', depth:0 };
  const startPattern = getOLLPattern(startCube);
  const startScore = orientationScore(startPattern);
  const queue = [{ cube: cloneCubeState(startCube), path: [], pattern: startPattern, score: startScore, depth:0 }];
  let bestScore = startScore;
  const visited = new Map(); // canonicalPattern -> depth found
  visited.set(canonicalizePattern(startPattern).canonical, 0);
  const t0 = Date.now();
  while(queue.length){
    const node = queue.shift();
    if(node.depth >= maxDepth) continue;
    for(const mv of moves){
      const nextCube = cloneCubeState(node.cube);
      applyMove(nextCube, mv);
      const pat = getOLLPattern(nextCube);
      const score = orientationScore(pat);
      if(score < bestScore - allowRegression) continue; // prune heavy regressions
      if(score > bestScore) bestScore = score;
      const canon = canonicalizePattern(pat).canonical;
      const newPath = [...node.path, mv];
      if(isOLLComplete(nextCube)){
        return { success:true, algorithm: newPath.join(' '), depth:newPath.length, expanded: visited.size, timeMs: Date.now()-t0 };
      }
      const prevDepth = visited.get(canon);
      if(prevDepth !== undefined && prevDepth <= newPath.length) continue;
      visited.set(canon, newPath.length);
      queue.push({ cube: nextCube, path:newPath, pattern:pat, score, depth: node.depth+1 });
    }
  }
  return { success:false, bestScore, expanded: visited.size, timeMs: Date.now()-t0 };
}

export default { heuristicSearchOLL };
