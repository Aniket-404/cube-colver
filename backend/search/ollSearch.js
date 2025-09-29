/**
 * Bounded search for unknown OLL pattern solutions.
 * Strategy: iterative deepening DFS over restricted move set.
 */
import { createSolvedCube } from '../utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern, isOLLComplete } from '../services/solver3x3x3.js';

const MOVE_SET = [ 'R', "R'", 'R2', 'U', "U'", 'U2', 'F', "F'", 'F2' ];

function cloneState(state){ return { faces: Object.fromEntries(Object.entries(state.faces).map(([k,v])=>[k,[...v]])) }; }

function applySequenceRaw(state, seq){
  applyMoveSequence3x3(state, parseMoveNotation3x3(seq.join(' ')));
}

function canonical(sequence){
  // Remove immediate inverses or same-move duplicates (basic pruning normalization)
  const out=[];
  for(const mv of sequence){
    if(out.length){
      const last=out[out.length-1];
      if(isInverse(last,mv)){ out.pop(); continue; }
      if(last===mv){
        // collapse triple duplicates etc not implemented; keep simple
      }
    }
    out.push(mv);
  }
  return out;
}

function isInverse(a,b){
  if(a[0]!==b[0]) return false;
  const mod = (m)=> m.includes("2")?2 : m.endsWith("'")? -1 : 1;
  return (mod(a)+mod(b))===0;
}

export function searchOLL({targetPattern, maxDepth=10, maxSolutions=3}){
  const solutions=[];
  const visitedPatterns=new Set();

  function dfs(state, depth, path){
    if(solutions.length>=maxSolutions) return;
    const pattern = getOLLPattern(state);
    if(pattern===targetPattern){
      // Already at target orientation pattern (rare) – treat path
      if(isOLLComplete(state)){
        solutions.push({ algorithm: path.join(' '), moves: path.length, complete:true });
      }
    }
    if(isOLLComplete(state)){
      solutions.push({ algorithm: path.join(' '), moves: path.length, complete:true });
      return;
    }
    if(depth===0) return;

    for(const mv of MOVE_SET){
      const nextPath=[...path,mv];
      const norm=canonical(nextPath);
      if(norm.length!==nextPath.length) continue; // pruned
      const nextState=cloneState(state);
      applySequenceRaw(nextState,[mv]);
      const newPattern=getOLLPattern(nextState);
      const key=newPattern+"|"+norm.join(' ');
      if(visitedPatterns.has(key)) continue;
      visitedPatterns.add(key);
      dfs(nextState, depth-1, norm);
      if(solutions.length>=maxSolutions) return;
    }
  }

  const base = createSolvedCube('3x3x3'); // Future: build synthetic start states; placeholder for now
  for(let depth=1; depth<=maxDepth && solutions.length<maxSolutions; depth++){
    dfs(cloneState(base), depth, []);
  }
  return { solutions };
}
