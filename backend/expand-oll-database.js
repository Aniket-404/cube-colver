/**
 * Systematic OLL Database Expansion
 * Find more working OLL cases using different approaches
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Systematic OLL Database Expansion...\n');

const newVerifiedCases = [];

function testAndAddCase(caseId, name, setupMoves, algorithm, expectedToWork = true) {
    console.log(`=== Testing Case ${caseId}: ${name} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Apply setup
    console.log(`Setup: ${setupMoves}`);
    applyMoveSequence3x3(cube, setupMoves);
    const pattern = getOLLPattern(cube);
    console.log(`Pattern: ${pattern}`);
    
    // Apply algorithm
    console.log(`Algorithm: ${algorithm}`);
    applyMoveSequence3x3(cube, algorithm);
    const solved = isOLLComplete(cube);
    
    const result = solved ? '✅ WORKS' : '❌ FAILED';
    console.log(`Result: ${result}`);
    
    if (solved) {
        newVerifiedCases.push({
            id: caseId,
            name,
            pattern,
            algorithm,
            setup: setupMoves
        });
        console.log(`✅ Added to verified database!`);
    } else if (expectedToWork) {
        console.log(`⚠️ Expected to work but failed`);
    }
    
    console.log();
    return solved;
}

// Strategy 1: Test more simple face moves (should be involutory)
console.log('=== STRATEGY 1: Simple Face Moves ===');

testAndAddCase('face_U2', 'U2 case', 'U2', 'U2');
testAndAddCase('face_D2', 'D2 case', 'D2', 'D2'); 
testAndAddCase('face_L2', 'L2 case', 'L2', 'L2');
testAndAddCase('face_B2', 'B2 case', 'B2', 'B2');

// Strategy 2: Test double moves (X2 patterns)
console.log('=== STRATEGY 2: Double Move Combinations ===');

testAndAddCase('RL', 'R2 L2 case', 'R2 L2', 'R2 L2');
testAndAddCase('UD', 'U2 D2 case', 'U2 D2', 'U2 D2');
testAndAddCase('FB', 'F2 B2 case', 'F2 B2', 'F2 B2');

// Strategy 3: Test known working sequences from speedcubing
console.log('=== STRATEGY 3: Known Speedcubing Sequences ===');

// T-OLL case (should be involutory)
testAndAddCase('t_oll', 'T-OLL case', 'f R U R\' U\' f\'', 'f R U R\' U\' f\'');

// Pi case 
testAndAddCase('pi_case', 'Pi case', 'R U2 R2 U\' R2 U\' R2 U2 R', 'R U2 R2 U\' R2 U\' R2 U2 R');

// Antisune alternative setup
testAndAddCase('antisune_alt', 'Anti-Sune Alt', 'L\' U\' L U\' L\' U2 L', 'L\' U\' L U\' L\' U2 L');

// Strategy 4: Test inverses of working algorithms
console.log('=== STRATEGY 4: Algorithm Inverses ===');

// If Sune works, try creating different patterns with it
testAndAddCase('sune_inv1', 'Sune Inverse Pattern', 'R U R\' U R U2 R\'', 'R U2 R\' U\' R U\' R\'');

// Strategy 5: Test sequences that should create edge-only cases  
console.log('=== STRATEGY 5: Edge-Only Cases ===');

// M moves affect only edges
testAndAddCase('m_move', 'M move case', 'M2', 'M2');
testAndAddCase('e_move', 'E move case', 'E2', 'E2');
testAndAddCase('s_move', 'S move case', 'S2', 'S2');

// Strategy 6: Test corner-only cases
console.log('=== STRATEGY 6: Corner-Only Cases ===');

// Try sequences that primarily affect corners
testAndAddCase('corner1', 'Corner sequence 1', 'R U2 R\' D R U2 R\' D\'', 'R U2 R\' D R U2 R\' D\'');

// Summary
console.log('=== EXPANSION SUMMARY ===');
console.log(`Found ${newVerifiedCases.length} new working cases:`);

newVerifiedCases.forEach((ollCase, index) => {
    console.log(`${index + 1}. Case ${ollCase.id}: ${ollCase.name}`);
    console.log(`   Pattern: ${ollCase.pattern}`);
    console.log(`   Algorithm: ${ollCase.algorithm}`);
});

if (newVerifiedCases.length > 0) {
    console.log('\n=== CODE TO ADD TO OLL_CASES ===');
    newVerifiedCases.forEach(ollCase => {
        console.log(`    {`);
        console.log(`        id: "${ollCase.id}",`);
        console.log(`        pattern: "${ollCase.pattern}",`);
        console.log(`        algorithm: "${ollCase.algorithm}",`);
        console.log(`        name: "${ollCase.name}"`);
        console.log(`    },`);
    });
}

console.log('\n🎯 Database Expansion Complete!');