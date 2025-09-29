// Test PLL solver with the working fallback algorithms
import { solvePLL, applyMoveSequence3x3, isCubeSolved3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Testing PLL solver with working fallback algorithms ===\n');

// Test 1: Simple U case (pattern 12301230)
console.log('Test 1: Simple U-turn PLL case');
const cube1 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube1, "U");

console.log('Initial state:');
console.log('Is solved:', isCubeSolved3x3(cube1));

const result1 = solvePLL(cube1);
console.log('PLL solver result:');
console.log('- Success:', result1.success);
console.log('- Total moves:', result1.totalMoves);
console.log('- Is PLL complete:', result1.isPLLComplete);
console.log('- Applied algorithms:', result1.appliedAlgorithms.length);

if (result1.appliedAlgorithms.length > 0) {
    result1.appliedAlgorithms.forEach((alg, i) => {
        console.log(`  ${i + 1}. ${alg.name}: ${alg.algorithm}`);
    });
}

console.log('Final cube solved:', isCubeSolved3x3(result1.finalState));
console.log();

// Test 2: U2 case (pattern 11001100)
console.log('Test 2: U2-turn PLL case');
const cube2 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube2, "U2");

const result2 = solvePLL(cube2);
console.log('PLL solver result:');
console.log('- Success:', result2.success);
console.log('- Total moves:', result2.totalMoves);
console.log('- Final solved:', isCubeSolved3x3(result2.finalState));

if (result2.appliedAlgorithms.length > 0) {
    result2.appliedAlgorithms.forEach((alg, i) => {
        console.log(`  ${i + 1}. ${alg.name}: ${alg.algorithm}`);
    });
}

console.log();

// Test 3: Corner swap case
console.log('Test 3: Corner swap PLL case'); 
const cube3 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube3, "R U R' D R U' R' D'");

const result3 = solvePLL(cube3);
console.log('PLL solver result:');
console.log('- Success:', result3.success);
console.log('- Total moves:', result3.totalMoves);
console.log('- Final solved:', isCubeSolved3x3(result3.finalState));

if (result3.appliedAlgorithms.length > 0) {
    result3.appliedAlgorithms.forEach((alg, i) => {
        console.log(`  ${i + 1}. ${alg.name}: ${alg.algorithm}`);
    });
}