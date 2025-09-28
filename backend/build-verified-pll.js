/**
 * Build Verified PLL Database
 * Test algorithms and record their actual patterns
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getPLLPattern,
    isPLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Building Verified PLL Database...\n');

const verifiedCases = [];

function testAndAddPLLCase(caseId, name, algorithm, expectedToWork = true) {
    console.log(`=== Testing PLL Case ${caseId}: ${name} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Apply algorithm
    console.log(`Algorithm: ${algorithm}`);
    applyMoveSequence3x3(cube, algorithm);
    const pattern = getPLLPattern(cube);
    console.log(`Pattern: ${pattern}`);
    
    // Test if it's involutory (applying again returns to solved)
    const cube2 = createSolvedCube('3x3x3'); 
    applyMoveSequence3x3(cube2, algorithm);
    applyMoveSequence3x3(cube2, algorithm);
    const backToSolved = isPLLComplete(cube2);
    
    const result = backToSolved ? '✅ INVOLUTORY' : '❌ NOT INVOLUTORY';
    console.log(`Involutory test: ${result}`);
    
    if (backToSolved) {
        verifiedCases.push({
            id: caseId,
            name,
            pattern,
            algorithm
        });
        console.log(`✅ Added to verified database!`);
    } else if (expectedToWork) {
        console.log(`⚠️ Expected to be involutory but failed`);
    }
    
    console.log();
    return backToSolved;
}

// Strategy 1: Test simple face moves (should be involutory at PLL level)
console.log('=== STRATEGY 1: Simple Face Moves ===');

testAndAddPLLCase('skip', 'PLL Skip', '');
testAndAddPLLCase('u', 'U move case', 'U');
testAndAddPLLCase('u2', 'U2 move case', 'U2');
testAndAddPLLCase('u_prime', "U' move case", "U'");

// Strategy 2: Test double moves
console.log('=== STRATEGY 2: Double Move Combinations ===');

testAndAddPLLCase('r2', 'R2 case', 'R2');
testAndAddPLLCase('f2', 'F2 case', 'F2');
testAndAddPLLCase('l2', 'L2 case', 'L2');
testAndAddPLLCase('b2', 'B2 case', 'B2');

// Strategy 3: Test slice moves (should be involutory)
console.log('=== STRATEGY 3: Slice Move Cases ===');

testAndAddPLLCase('m2', 'M2 case', 'M2');
testAndAddPLLCase('e2', 'E2 case', 'E2'); 
testAndAddPLLCase('s2', 'S2 case', 'S2');

// Strategy 4: Test known PLL algorithms (some might not be involutory)
console.log('=== STRATEGY 4: Known PLL Algorithms ===');

// H-Perm (should be involutory)
testAndAddPLLCase('h_perm', 'H-Perm', 'M2 U M2 U2 M2 U M2');

// Z-Perm (should be involutory)  
testAndAddPLLCase('z_perm', 'Z-Perm', "M' U M2 U M2 U M' U2 M2");

// T-Perm (not involutory, but try it)
testAndAddPLLCase('t_perm', 'T-Perm', "R U R' F' R U R' U' R' F R2 U' R'", false);

// Strategy 5: Test simple combinations
console.log('=== STRATEGY 5: Simple Combinations ===');

testAndAddPLLCase('ru', 'R U case', 'R U');
testAndAddPLLCase('r2u2', 'R2 U2 case', 'R2 U2');

// Summary
console.log('=== VERIFIED PLL DATABASE ===');
console.log(`Found ${verifiedCases.length} working cases:`);

verifiedCases.forEach((pllCase, index) => {
    console.log(`${index + 1}. Case ${pllCase.id}: ${pllCase.name}`);
    console.log(`   Pattern: ${pllCase.pattern}`);
    console.log(`   Algorithm: ${pllCase.algorithm || '(no moves)'}`);
});

if (verifiedCases.length > 0) {
    console.log('\n=== CODE TO ADD TO PLL_CASES ===');
    verifiedCases.forEach(pllCase => {
        console.log(`    {`);
        console.log(`        id: "${pllCase.id}",`);
        console.log(`        name: "${pllCase.name}",`);
        console.log(`        pattern: "${pllCase.pattern}",`);
        console.log(`        algorithm: "${pllCase.algorithm}"`);
        console.log(`    },`);
    });
}

console.log('\n🎯 PLL Database Building Complete!');