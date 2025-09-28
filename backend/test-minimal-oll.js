/**
 * Test with Minimal OLL Case  
 * Use the simplest possible OLL test case
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Testing Minimal OLL Case...\n');

// Let's test the most basic concept: can we create an OLL case and then solve it?
// I'll use a truly simple case: just one or two wrong edges

function detailedOLLTest(name, setupMoves, solveMoves) {
    console.log(`=== ${name} ===`);
    
    // Start with solved cube
    const cube = createSolvedCube('3x3x3');
    console.log('Initial state:');
    console.log('  Pattern:', getOLLPattern(cube));
    console.log('  Complete:', isOLLComplete(cube));
    console.log('  U face:', cube.faces.U);
    
    // Apply setup moves
    console.log(`\nApplying setup: "${setupMoves}"`);
    applyMoveSequence3x3(cube, setupMoves);
    console.log('After setup:');
    console.log('  Pattern:', getOLLPattern(cube));
    console.log('  Complete:', isOLLComplete(cube));
    console.log('  U face:', cube.faces.U);
    
    // Apply solve moves
    console.log(`\nApplying solve: "${solveMoves}"`);
    applyMoveSequence3x3(cube, solveMoves);
    console.log('After solve:');
    console.log('  Pattern:', getOLLPattern(cube));
    console.log('  Complete:', isOLLComplete(cube));
    console.log('  U face:', cube.faces.U);
    
    const success = isOLLComplete(cube);
    console.log(`\nResult: ${success ? '✅ SOLVED' : '❌ NOT SOLVED'}`);
    console.log();
    
    return success;
}

// Test 1: The most basic - apply F2 to mess up edges, then F2 again to fix
detailedOLLTest(
    'F2 Involution Test',
    'F2',    // Setup: mess up bottom edges
    'F2'     // Solve: fix them back
);

// Test 2: Apply a short sequence and its reverse
detailedOLLTest(
    'R U R\' Test', 
    'R U R\'',       // Setup: simple sequence
    'R U\' R\''      // Solve: reverse sequence
);

// Test 3: Check if we can at least detect differences in patterns
console.log('=== Pattern Detection Test ===');
const cube1 = createSolvedCube('3x3x3');
console.log('Solved pattern:', getOLLPattern(cube1));

applyMoveSequence3x3(cube1, 'F');
console.log('After F:', getOLLPattern(cube1));

applyMoveSequence3x3(cube1, 'R');  
console.log('After F R:', getOLLPattern(cube1));

applyMoveSequence3x3(cube1, 'U');
console.log('After F R U:', getOLLPattern(cube1));

console.log('🎯 Minimal OLL Testing Complete!');