/**
 * Test Known Correct OLL Algorithms
 * Use verified OLL cases with their correct inverse algorithms
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Testing Known Correct OLL Algorithms...\n');

function testOLLCase(name, setupAlg, solveAlg) {
    console.log(`=== ${name} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Apply setup to create the OLL case
    console.log(`Setup: ${setupAlg}`);
    applyMoveSequence3x3(cube, setupAlg);
    const pattern = getOLLPattern(cube);
    console.log(`Pattern created: ${pattern}`);
    console.log('OLL complete after setup:', isOLLComplete(cube));
    
    // Apply solve algorithm
    console.log(`Solve: ${solveAlg}`);
    applyMoveSequence3x3(cube, solveAlg);
    const finalPattern = getOLLPattern(cube);
    console.log(`Final pattern: ${finalPattern}`);
    const success = isOLLComplete(cube);
    console.log(`Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log();
    
    return success;
}

// Test Case 1: Create an OLL case and solve with inverse
// Setup: F (R U R' U') F' - creates a specific pattern
// Solve: F (R U R' U') F' - should solve it back
testOLLCase(
    'Case 1: F (R U R\' U\') F\' pattern',
    'F R U R\' U\' F\'',  // Setup
    'F R U R\' U\' F\''   // Solve with same alg (if it's involutory)
);

// Test Case 2: Try the inverse approach
// Setup: F (R U R' U') F' 
// Solve: F (U R U' R') F' (reverse the middle part)
testOLLCase(
    'Case 2: F (R U R\' U\') F\' with reversed solve',
    'F R U R\' U\' F\'',      // Setup
    'F U R U\' R\' F\''       // Solve with reversed middle
);

// Test Case 3: Known Sune case
// Setup with inverse of Sune
// Solve with Sune
testOLLCase(
    'Case 3: Anti-Sune setup → Sune solve',
    'R U2 R\' U\' R U\' R\'',  // Anti-Sune (inverse of Sune)
    'R U R\' U R U2 R\''       // Sune
);

// Test Case 4: T-OLL case
// Setup with inverse of T-OLL  
// Solve with T-OLL
testOLLCase(
    'Case 4: T-OLL case',
    'F R U R\' U\' F\' f R U R\' U\' f\'',  // Setup (inverse T-OLL)
    'f R U R\' U\' f\' F R U R\' U\' F\''   // T-OLL solve
);

// Test Case 5: Simple edge orientation case
// Use moves that only affect edges
testOLLCase(
    'Case 5: Edge-only case',
    'F U R U\' R\' F\'',      // Create edge pattern
    'F U R U\' R\' F\''       // Solve (if involutory)
);

console.log('🎯 Known Correct OLL Algorithm Testing Complete!');