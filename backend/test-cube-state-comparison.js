// Compare cube states between isolation and solver
import { analyzeOLLState, applyMoveSequence3x3 } from './services/solver3x3x3.js';
import { createSolvedCube, cloneCubeState } from './utils/cubeStructures.js';

console.log('🔍 Comparing Cube States: Isolation vs Solver...\n');

// Create identical starting states
let isolationCube = createSolvedCube('3x3x3');
let solverCube = createSolvedCube('3x3x3');

// Apply same setup to both
const suneSetup = "R U R' U R U2 R'";
applyMoveSequence3x3(isolationCube, suneSetup);
applyMoveSequence3x3(solverCube, suneSetup);

console.log('1. After identical Sune setup:');
console.log('   Isolation cube pattern:', analyzeOLLState(isolationCube).pattern);
console.log('   Solver cube pattern:', analyzeOLLState(solverCube).pattern);

// Clone the solver cube (like in solver)
const clonedCube = cloneCubeState(solverCube);
console.log('   Cloned cube pattern:', analyzeOLLState(clonedCube).pattern);

// Apply Sune algorithm to isolation cube
const suneAlgorithm = "R U2 R' U' R U' R'";
applyMoveSequence3x3(isolationCube, suneAlgorithm);

console.log('\n2. After applying Sune algorithm to isolation cube:');
console.log('   Isolation cube pattern:', analyzeOLLState(isolationCube).pattern);
console.log('   Isolation cube complete:', analyzeOLLState(isolationCube).isComplete);

// Apply same algorithm to cloned cube
applyMoveSequence3x3(clonedCube, suneAlgorithm);

console.log('\n3. After applying same algorithm to cloned cube:');
console.log('   Cloned cube pattern:', analyzeOLLState(clonedCube).pattern);
console.log('   Cloned cube complete:', analyzeOLLState(clonedCube).isComplete);

// Compare final patterns
console.log('\n🔍 Final comparison:');
console.log('   Isolation cube:', analyzeOLLState(isolationCube).pattern, analyzeOLLState(isolationCube).isComplete);
console.log('   Cloned cube:', analyzeOLLState(clonedCube).pattern, analyzeOLLState(clonedCube).isComplete);
console.log('   Same result?', analyzeOLLState(isolationCube).pattern === analyzeOLLState(clonedCube).pattern ? '✅' : '❌');