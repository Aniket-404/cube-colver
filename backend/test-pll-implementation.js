/**
 * Test PLL Implementation
 * Basic functionality test for PLL pattern recognition and solving
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getPLLPattern,
    isPLLComplete,
    analyzePLLState,
    solvePLL,
    getPLLAlgorithms
} from './services/solver3x3x3.js';

console.log('🧪 Testing PLL Implementation...\n');

// Test 1: Already solved (PLL Skip)
console.log('=== Test 1: PLL Skip (Already Solved) ===');
const cube1 = createSolvedCube('3x3x3');
console.log('Pattern:', getPLLPattern(cube1));
console.log('Complete:', isPLLComplete(cube1));
console.log('Analysis:', analyzePLLState(cube1));
console.log();

// Test 2: Simple case - try to create known pattern
console.log('=== Test 2: Create Simple PLL Case ===');
const cube2 = createSolvedCube('3x3x3');

// Try T-Perm setup (should create T-Perm pattern)
const tPermSetup = "R U R' F' R U R' U' R' F R2 U' R'"; // Apply T-Perm to solved cube
applyMoveSequence3x3(cube2, tPermSetup);

console.log('After T-Perm setup:');
console.log('Pattern:', getPLLPattern(cube2));
console.log('Complete:', isPLLComplete(cube2));

const analysis2 = analyzePLLState(cube2);
console.log('Analysis:', analysis2);

if (analysis2.algorithm) {
    console.log('Trying to solve with found algorithm...');
    const solution2 = solvePLL(cube2);
    console.log('Solution:', solution2);
} else {
    console.log('No algorithm found for this pattern');
}
console.log();

// Test 3: Algorithm database
console.log('=== Test 3: Available PLL Algorithms ===');
const algorithms = getPLLAlgorithms();
console.log(`Total algorithms: ${algorithms.length}`);
algorithms.forEach(alg => {
    console.log(`- ${alg.name}: ${alg.algorithm || 'No algorithm'} (${alg.moveCount} moves)`);
});
console.log();

// Test 4: Test pattern extraction with manual setup
console.log('=== Test 4: Manual Pattern Testing ==='); 
const cube4 = createSolvedCube('3x3x3');

// Apply a simple U move to create edge cycle
applyMoveSequence3x3(cube4, 'U');
console.log('After U move:');
console.log('Pattern:', getPLLPattern(cube4));
console.log('Complete:', isPLLComplete(cube4));
console.log();

// Test 5: Check if basic face moves create expected patterns
console.log('=== Test 5: Basic Move Pattern Testing ===');
const testMoves = ['U', 'U2', 'U\'', 'R U R\'', 'F R U R\' U\' F\''];

testMoves.forEach(moves => {
    const testCube = createSolvedCube('3x3x3');
    applyMoveSequence3x3(testCube, moves);
    const pattern = getPLLPattern(testCube);
    const complete = isPLLComplete(testCube);
    console.log(`${moves.padEnd(15)}: ${pattern} (Complete: ${complete})`);
});

console.log('\n🎯 PLL Testing Complete!');