/**
 * Test Simple OLL Algorithms
 * Verify basic algorithms work correctly
 */

import { 
    createSolvedCube,
    cloneCubeState 
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Testing Simple OLL Algorithms...\n');

function testOLLAlgorithm(name, setupMoves, solveMoves) {
    console.log(`=== ${name} ===`);
    
    // Start with solved cube
    const cube = createSolvedCube('3x3x3');
    console.log('Initial OLL complete:', isOLLComplete(cube));
    
    // Apply setup moves to create OLL case
    console.log(`Setup: ${setupMoves}`);
    applyMoveSequence3x3(cube, setupMoves);
    const scrambledPattern = getOLLPattern(cube);
    console.log(`After setup pattern: ${scrambledPattern}`);
    console.log('OLL complete after setup:', isOLLComplete(cube));
    
    // Apply solving moves
    console.log(`Solve: ${solveMoves}`);
    applyMoveSequence3x3(cube, solveMoves);
    const solvedPattern = getOLLPattern(cube);
    console.log(`After solve pattern: ${solvedPattern}`);
    console.log('OLL complete after solve:', isOLLComplete(cube));
    
    const success = isOLLComplete(cube);
    console.log(`Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log();
    
    return success;
}

// Test some simple, known working OLL algorithms

// Test 1: F R U R' U' F' and its inverse
testOLLAlgorithm(
    'F R U R\' U\' F\' test', 
    'F R U R\' U\' F\'',  // Setup: create the case
    'F R U R\' U\' F\''   // Solve: apply same moves (should return to solved if involutory)
);

// Test 2: R U R' U R U2 R' (Sune) - this should be self-inverse in some cases
testOLLAlgorithm(
    'Sune test',
    'R U R\' U R U2 R\'',  // Setup: create sune case  
    'R U R\' U R U2 R\''   // Solve: apply sune again
);

// Test 3: Try a sequence we know should work - empty sequence (identity)
testOLLAlgorithm(
    'Identity test (no moves)',
    '',  // Setup: no moves (stay solved)
    ''   // Solve: no moves  
);

// Test 4: Test that U moves preserve OLL status
testOLLAlgorithm(
    'U move preservation test',
    '',    // Setup: solved cube
    'U'    // Solve: just U move (should stay solved)
);

// Test 5: More complex sequence that should return to solved
testOLLAlgorithm(
    'R U R\' U\' test (should be identity on solved cube)',
    '',               // Setup: solved
    'R U R\' U\''     // Solve: this basic sequence
);

console.log('🎯 Simple OLL Algorithm Testing Complete!');