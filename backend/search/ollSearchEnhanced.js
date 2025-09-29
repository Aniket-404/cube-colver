/**
 * Enhanced OLL search starting from provided cube states (not always solved root).
 * IDDFS over restricted move set with simple pruning.
 */
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern, isOLLComplete } from '../services/solver3x3x3.js';
import { cloneCubeState } from '../utils/cubeStructures.js';

const MOVE_STRINGS = [ 'R','R"','R2','U','U"','U2','F','F"','F2' ].map(m=>m.replace('"',"'"));

function applyMoves(state, moves){
  applyMoveSequence3x3(state, parseMoveNotation3x3(moves.join(' ')));
}

function inverseMove(m){
  if(m.endsWith('2')) return m; if(m.endsWith("'")) return m.slice(0,-1); return m+"'";
}

function isRedundant(prev, cur){
  if(!prev) return false;
  // Avoid immediate inverses & triple U turns (simplistic)
  if(inverseMove(prev) === cur) return true;
  return false;
}

export function searchOLLFromState(startCube, maxDepth=7){
  if(isOLLComplete(startCube)) return { success:true, algorithm:'', depth:0 };
  let solution = null;
  function dfs(path, depth, cube){
    if(solution) return;
    if(depth === 0){
      if(isOLLComplete(cube)) solution = path.slice();
      return;
    }
    const last = path[path.length-1];
    for(const mv of MOVE_STRINGS){
      if(isRedundant(last, mv)) continue;
      const next = cloneCubeState(cube);
      applyMoves(next, [mv]);
      dfs([...path, mv], depth-1, next);
      if(solution) return;
    }
  }
  for(let d=1; d<=maxDepth && !solution; d++) dfs([], d, cloneCubeState(startCube));
  return solution ? { success:true, algorithm: solution.join(' '), depth:solution.length } : { success:false };
}

export default { searchOLLFromState };
