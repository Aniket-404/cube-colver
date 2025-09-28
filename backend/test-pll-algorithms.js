/**
 * Test Basic PLL Algorithm Functionality
 * Verify that PLL algorithms work with involutory property
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getPLLPattern,
    isPLLComplete,
    analyzePLLState,
    solvePLL
} from './services/solver3x3x3.js';

console.log('🧪 Testing Basic PLL Algorithm Functionality...\n');

// Test involutory PLL cases (algorithms that return to solved when applied twice)
const testCases = [
    {
        name: "H-Perm Test",
        algorithm: "M2 U M2 U2 M2 U M2",
        expectedPattern: "20130213" // Should create some swap pattern
    },
    {
        name: "T-Perm Test", 
        algorithm: "R U R' F' R U R' U' R' F R2 U' R'",
        expectedPattern: "01230000" // UF-UR swap + corner cycle
    },
    {
        name: "U-Perm Test",
        algorithm: "R U' R U R U R U' R' U' R2",
        expectedPattern: "12300000" // Edge 3-cycle
    }
];

testCases.forEach(testCase => {
    console.log(`=== ${testCase.name} ===`);
    
    // Step 1: Apply algorithm to solved cube
    const cube1 = createSolvedCube('3x3x3');
    console.log(`Applying: ${testCase.algorithm}`);
    applyMoveSequence3x3(cube1, testCase.algorithm);
    
    const pattern1 = getPLLPattern(cube1);
    const complete1 = isPLLComplete(cube1);
    console.log(`Pattern after algorithm: ${pattern1}`);
    console.log(`Complete: ${complete1}`);
    
    // Step 2: Try to solve it
    const analysis = analyzePLLState(cube1);
    console.log(`Matched case: ${analysis.caseName}`);
    
    if (analysis.algorithm) {
        console.log(`Solving with: ${analysis.algorithm}`);
        const solution = solvePLL(cube1);
        console.log(`Solution success: ${solution.success}`);
        console.log(`Final pattern: ${solution.finalPattern}`);
        console.log(`Is solved: ${solution.isPLLComplete}`);
        
        if (solution.success) {
            console.log('✅ Algorithm works correctly!');
        } else {
            console.log('❌ Algorithm failed to solve');
        }
    } else {
        console.log(`⚠️ Pattern ${pattern1} not found in database`);
        
        // Step 3: Test if applying the same algorithm again returns to solved
        console.log('Testing involutory property...');
        applyMoveSequence3x3(cube1, testCase.algorithm);
        const finalPattern = getPLLPattern(cube1);
        const finalComplete = isPLLComplete(cube1);
        console.log(`After applying algorithm again: ${finalPattern}`);
        console.log(`Back to solved: ${finalComplete}`);
        
        if (finalComplete) {
            console.log('✅ Algorithm is involutory - pattern should be added to database!');
        }
    }
    
    console.log();
});

// Test simple cases that should definitely work
console.log('=== Testing Simple Cases ===');

// Test 1: U move (should create edge cycle)
const cubeU = createSolvedCube('3x3x3');
applyMoveSequence3x3(cubeU, 'U');
const analysisU = analyzePLLState(cubeU);
console.log(`U move pattern: ${analysisU.pattern} -> ${analysisU.caseName}`);

// Test 2: U2 move (should create edge swaps) 
const cubeU2 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cubeU2, 'U2');
const analysisU2 = analyzePLLState(cubeU2);
console.log(`U2 move pattern: ${analysisU2.pattern} -> ${analysisU2.caseName}`);

console.log('\n🎯 PLL Algorithm Testing Complete!');