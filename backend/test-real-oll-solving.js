/**
 * Test Real OLL Solving Process
 * Create known OLL cases and solve with verified algorithms
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Testing Real OLL Solving Process...\n');

function testRealOLL(name, setupSequence, solveAlgorithm, expectedPattern) {
    console.log(`=== ${name} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Step 1: Create the OLL case with setup moves
    console.log(`Setup moves: ${setupSequence}`);
    applyMoveSequence3x3(cube, setupSequence);
    const createdPattern = getOLLPattern(cube);
    console.log(`Pattern created: ${createdPattern}`);
    
    if (expectedPattern && createdPattern !== expectedPattern) {
        console.log(`⚠️  Expected pattern: ${expectedPattern}`);
    }
    
    console.log('OLL complete after setup:', isOLLComplete(cube));
    console.log('U face after setup:', cube.faces.U);
    
    // Step 2: Apply the solving algorithm
    console.log(`Solve algorithm: ${solveAlgorithm}`);
    applyMoveSequence3x3(cube, solveAlgorithm);
    const finalPattern = getOLLPattern(cube);
    console.log(`Final pattern: ${finalPattern}`);
    
    const solved = isOLLComplete(cube);
    console.log('OLL complete after solve:', solved);
    console.log('U face after solve:', cube.faces.U);
    
    console.log(`Result: ${solved ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log();
    
    return solved;
}

// Test with known OLL cases from speedcubing community

// OLL Case 2: "Sune" case (corner orientation)
// Setup: Create a Sune case by doing the inverse of Sune 
// Solve: Apply Sune algorithm
testRealOLL(
    'OLL Case 2 - Sune',
    'R U2 R\' U\' R U\' R\'',  // Anti-Sune to create Sune case
    'R U R\' U R U2 R\'',      // Sune algorithm to solve
    null // Don't know expected pattern yet
);

// OLL Case 44: "Bowtie" case  
// Let's create this case and solve it
testRealOLL(
    'OLL Case 44 - Bowtie',
    'f R U R\' U\' f\'',       // Create bowtie case
    'f R U R\' U\' f\'',       // Try same algorithm (if involutory)
    null
);

// OLL Case 21: "H" case (4 adjacent edges need flipping)
// Setup: Create H case
// Solve: Apply H algorithm
testRealOLL(
    'OLL Case 21 - H shape', 
    'F R U R\' U\' R U R\' U\' R U R\' U\' F\'', // Create H case
    'F R U R\' U\' R U R\' U\' R U R\' U\' F\'', // H algorithm
    null
);

// Simple test: Create a single wrong edge and try to fix it
testRealOLL(
    'Single Edge Flip Test',
    'F R U R\' U\' F\' U2 F U R U\' R\' F\'', // Create single wrong edge
    'F U R U\' R\' F\'',                      // Try simple algorithm
    null
);

console.log('🎯 Real OLL Solving Process Testing Complete!');