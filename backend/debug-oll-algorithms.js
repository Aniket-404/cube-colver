/**
 * Debug OLL Algorithm Execution
 * Test specific OLL cases to verify algorithm correctness
 */

import { 
    createSolvedCube,
    cloneCubeState 
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    matchOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Debugging OLL Algorithm Execution...\n');

// Test Case 1: Start with solved cube and apply a known OLL scramble
const testCube1 = createSolvedCube('3x3x3');
console.log('=== Test Case 1: L-Shape Pattern ===');
console.log('Starting with solved cube (OLL complete):', isOLLComplete(testCube1));

// Apply F R U R' U' F' to create an OLL case
applyMoveSequence3x3(testCube1, "F R U R' U' F'");
console.log('After F R U R\' U\' F\':');
console.log('  Pattern:', getOLLPattern(testCube1));
console.log('  OLL complete:', isOLLComplete(testCube1));

const match1 = matchOLLPattern(getOLLPattern(testCube1));
if (match1) {
    console.log(`  Matched: OLL Case ${match1.id} - ${match1.name}`);
    console.log(`  Algorithm: ${match1.rotatedAlgorithm}`);
    
    // Test if applying the algorithm solves it
    const beforeSolve = getOLLPattern(testCube1);
    console.log('  Before applying solution:', beforeSolve);
    
    const solveResult = applyMoveSequence3x3(testCube1, match1.rotatedAlgorithm);
    console.log('  Apply algorithm success:', solveResult.success);
    
    const afterSolve = getOLLPattern(testCube1);
    console.log('  After applying solution:', afterSolve);
    console.log('  OLL solved:', isOLLComplete(testCube1));
    console.log('  Expected: 11111111, Got:', afterSolve);
} else {
    console.log('  No matching OLL case found!');
}

console.log('\n=== Test Case 2: Manual OLL Case 45 ===');
// Test OLL case 45 specifically (L-Shape)
const testCube2 = createSolvedCube('3x3x3');

// Create the exact pattern for case 45: "01010000"
// This might require a specific sequence to generate this exact pattern
console.log('Creating specific pattern for OLL Case 45...');

// Try a different approach - let's manually verify a known simple case
// OLL Case 27 has algorithm "R U R' U R U2 R'" and should be easier to test
console.log('\n=== Test Case 3: OLL Case 27 (Sune) ===');
const testCube3 = createSolvedCube('3x3x3');

// Apply the reverse of Sune to create the Sune case
applyMoveSequence3x3(testCube3, "R U2 R' U' R U' R'"); // Reverse of Sune
const pattern3 = getOLLPattern(testCube3);
console.log('After reverse Sune:');
console.log('  Pattern:', pattern3);

const match3 = matchOLLPattern(pattern3);
if (match3) {
    console.log(`  Matched: OLL Case ${match3.id} - ${match3.name}`);
    console.log(`  Algorithm: ${match3.rotatedAlgorithm}`);
    
    // Apply the algorithm
    applyMoveSequence3x3(testCube3, match3.rotatedAlgorithm);
    const finalPattern3 = getOLLPattern(testCube3);
    console.log('  Final pattern:', finalPattern3);
    console.log('  OLL solved:', isOLLComplete(testCube3));
}

console.log('\n=== Test Case 4: Simple Known OLL ===');
// Test the simplest case - if cube is already solved, applying OLL skip should keep it solved
const testCube4 = createSolvedCube('3x3x3');
console.log('Testing OLL skip (already solved):');
console.log('  Initial OLL complete:', isOLLComplete(testCube4));
console.log('  Pattern:', getOLLPattern(testCube4));

const match4 = matchOLLPattern(getOLLPattern(testCube4));
if (match4) {
    console.log(`  Matched: OLL Case ${match4.id} - ${match4.name}`);
    console.log(`  Algorithm: "${match4.rotatedAlgorithm}" (should be empty)`);
    
    if (match4.rotatedAlgorithm) {
        applyMoveSequence3x3(testCube4, match4.rotatedAlgorithm);
    }
    
    console.log('  Final OLL complete:', isOLLComplete(testCube4));
}

console.log('\n🎯 OLL Algorithm Debug Complete!');