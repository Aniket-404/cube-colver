/**
 * Test Truly Involutory OLL Algorithms
 * Use algorithms that are known to be self-inverse
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Testing Truly Involutory OLL Algorithms...\n');

// Pattern 00010000 means: position 3 (UL edge) is NOT oriented correctly
// In binary: 00010000 = positions 7,6,5,4,3,2,1,0 where 3=1 (incorrectly oriented)
console.log('Pattern 00010000 analysis:');
console.log('Binary: 00010000');
console.log('Positions (7,6,5,4,3,2,1,0): (0,0,0,1,0,0,0,0)');
console.log('This means position 3 (UL edge) is incorrectly oriented');
console.log('U face layout: 0 1 2');
console.log('               7 U 3'); 
console.log('               6 5 4');
console.log('So position 3 = right edge of U face\n');

function testInvolutoryAlg(name, algorithm) {
    console.log(`=== ${name} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Apply algorithm once
    console.log(`First application: ${algorithm}`);
    applyMoveSequence3x3(cube, algorithm);
    const pattern1 = getOLLPattern(cube);
    console.log(`After first: ${pattern1}`);
    console.log('OLL complete after first:', isOLLComplete(cube));
    
    // Apply algorithm again (should return to solved if involutory)
    console.log(`Second application: ${algorithm}`);
    applyMoveSequence3x3(cube, algorithm);
    const pattern2 = getOLLPattern(cube);
    console.log(`After second: ${pattern2}`);
    const success = isOLLComplete(cube);
    console.log(`Result: ${success ? '✅ INVOLUTORY' : '❌ NOT INVOLUTORY'}`);
    console.log();
    
    return success;
}

// Test known involutory algorithms
// These should return cube to solved state when applied twice

testInvolutoryAlg(
    'M\' U M\' U M\' U M\' U\' M U M U M U (4-edge cycle x2)',
    'M\' U M\' U M\' U M\' U\' M U M U M U'
);

testInvolutoryAlg(
    'R U R\' F\' R U R\' U\' R\' F R2 U\' R\' (T-Perm variation)',
    'R U R\' F\' R U R\' U\' R\' F R2 U\' R\''
);

testInvolutoryAlg(
    'M2 U M2 U2 M2 U M2 (H-Perm)',
    'M2 U M2 U2 M2 U M2'
);

// Try some simpler cases
testInvolutoryAlg(
    'F2 (180-degree face turn)',
    'F2'
);

testInvolutoryAlg(
    'R2 U2 R2 (should be involutory)', 
    'R2 U2 R2'
);

testInvolutoryAlg(
    'Empty algorithm (identity)',
    ''
);

console.log('🎯 Involutory Algorithm Testing Complete!');