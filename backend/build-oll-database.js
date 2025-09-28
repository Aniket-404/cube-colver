/**
 * Build Correct OLL Algorithm Database
 * Test real OLL cases with verified algorithms
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Building Correct OLL Algorithm Database...\n');

function testOLLAlgorithm(caseId, caseName, setupMoves, solveAlgorithm, expectedPattern) {
    console.log(`=== OLL Case ${caseId}: ${caseName} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Step 1: Apply setup moves to create the case
    console.log(`Setup: ${setupMoves}`);
    applyMoveSequence3x3(cube, setupMoves);
    const actualPattern = getOLLPattern(cube);
    console.log(`Pattern created: ${actualPattern}`);
    
    if (expectedPattern && actualPattern !== expectedPattern) {
        console.log(`⚠️ Expected: ${expectedPattern}`);
    }
    
    // Step 2: Apply solving algorithm
    console.log(`Algorithm: ${solveAlgorithm}`);
    applyMoveSequence3x3(cube, solveAlgorithm);
    const finalPattern = getOLLPattern(cube);
    const solved = isOLLComplete(cube);
    
    console.log(`Final pattern: ${finalPattern}`);
    console.log(`Solved: ${solved ? '✅' : '❌'}`);
    console.log();
    
    return { pattern: actualPattern, solved };
}

// Test known OLL cases with verified algorithms from speedcubing resources

// Case 1: Already solved (dot case)
testOLLAlgorithm(1, "Already solved", "", "", "11111111");

// Case 2: Sune (3 corners oriented, 1 not oriented)
// This is a standard, well-known algorithm
const result2 = testOLLAlgorithm(
    2, 
    "Sune", 
    "R U2 R' U' R U' R'",  // Anti-Sune creates Sune case
    "R U R' U R U2 R'",    // Sune algorithm
    null
);

// Case 21: "H" case - 4 edges need flipping, opposite corners swapped
// Algorithm: F R U R' U' R U R' U' R U R' U' F'
testOLLAlgorithm(
    21,
    "H shape",
    "R U R' U' M' U R U' r'",  // Create H case
    "F R U R' U' R U R' U' R U R' U' F'",  // H algorithm
    null
);

// Case 27: "Cross" - all edges correct, only corners need orienting  
testOLLAlgorithm(
    27,
    "Cross",
    "R U2 R2 U' R2 U' R2 U2 R",  // Create cross case
    "R U R' U R U2 R'",           // Simple algorithm
    null
);

// Test a simple edge-only case
testOLLAlgorithm(
    "Simple",
    "Single edge flip",
    "F U R U' R' F'",  // Create single wrong edge
    "F U R U' R' F'",  // Same algorithm (if involutory)
    null
);

// Test T-OLL case
testOLLAlgorithm(
    33,
    "T-OLL",
    "f R U R' U' f'",          // Create T case
    "f R U R' U' f' F R U R' U' F'",  // T-OLL algorithm
    null
);

console.log('🎯 OLL Algorithm Database Testing Complete!');