/**
 * Harness to validate / search candidate OLL algorithms for unknown patterns.
 * Steps:
 *  1. Load unknown patterns from logger
 *  2. For each pattern, attempt bounded search OR test provided candidate algorithms (CLI arg)
 *  3. Output JSON report with viable algorithms (orientation complete + F2L integrity preserved)
 */
import { listUnknownPatterns } from './utils/ollUnknownLogger.js';
import { solveOLL, getOLLPattern, isOLLComplete } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3 } from './services/solver3x3x3.js';
import { searchOLL } from './search/ollSearch.js';
import { mineOLLPatterns, deriveAlgorithmForPattern } from './utils/ollPatternMining.js';

function clone(obj){return JSON.parse(JSON.stringify(obj));}

function generateSyntheticStateFromPattern(pattern){
  // Naive synthetic generator: start solved and apply a small scramble then force orientation via targeted twists
  const cube = createSolvedCube('3x3x3');
  // For now just return solved for scaffolding; future: implement orientation injection
  return cube;
}

function testCandidate(pattern, algorithm){
  const cube = generateSyntheticStateFromPattern(pattern);
  const before = JSON.stringify(cube.faces);
  const moves = parseMoveNotation3x3(algorithm);
  applyMoveSequence3x3(cube, moves);
  const afterPattern = getOLLPattern(cube);
  const complete = isOLLComplete(cube);
  return { pattern, algorithm, moves: moves.length, afterPattern, complete, mutated: before!==JSON.stringify(cube.faces) && !complete };
}

function main(){
  const unknown = listUnknownPatterns();
  console.log('Unknown OLL patterns loaded:', Object.keys(unknown));
  const candidateArgIndex = process.argv.indexOf('--alg');
  const patternArgIndex = process.argv.indexOf('--pattern');
  if(candidateArgIndex>0 && patternArgIndex>0){
    const algorithm = process.argv[candidateArgIndex+1];
    const pattern = process.argv[patternArgIndex+1];
    const result = testCandidate(pattern, algorithm);
    console.log('Candidate test result:', result);
    return;
  }
  if(process.argv.includes('--discover')){
    const pattern = process.argv[patternArgIndex+1];
    console.log('🔍 Discovering algorithms for pattern', pattern);
    const res = searchOLL({ targetPattern: pattern, maxDepth: 8 });
    console.log('Search result:', res);
    return;
  }
  if(process.argv.includes('--mine')){
    console.log('⛏  Mining orientation patterns...');
    const mined = mineOLLPatterns(400);
    console.log('Mined patterns:', Object.keys(mined).length);
    const unknownKeys = Object.keys(unknown);
    unknownKeys.forEach(p=>{
      const alg = deriveAlgorithmForPattern(p, mined);
      console.log('Pattern', p, 'derivedAlg:', alg||'NONE');
    });
    return;
  }
  console.log('No candidate specified. Future enhancement: bounded search.');
}

main();
