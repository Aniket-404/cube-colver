/**
 * Verify OLL Pattern Definitions
 * Check if our pattern extraction matches standard OLL patterns
 */

import { 
    createSolvedCube,
    cloneCubeState 
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern
} from './services/solver3x3x3.js';

console.log('🔍 Verifying OLL Pattern Definitions...\n');

function testSequence(name, sequence, expectedDescription) {
    const cube = createSolvedCube('3x3x3');
    console.log(`=== ${name} ===`);
    console.log(`Sequence: ${sequence}`);
    
    applyMoveSequence3x3(cube, sequence);
    const pattern = getOLLPattern(cube);
    console.log(`Pattern: ${pattern}`);
    console.log(`Description: ${expectedDescription}`);
    
    // Show which positions are oriented (1) vs not (0)
    console.log('Position analysis:');
    const positions = ['ULB corner', 'UB edge', 'URB corner', 'UL edge', 'UR edge', 'ULF corner', 'UF edge', 'URF corner'];
    for (let i = 0; i < 8; i++) {
        const oriented = pattern[i] === '1' ? '✅' : '❌';
        console.log(`  ${positions[i]}: ${oriented}`);
    }
    console.log();
    return pattern;
}

// Test known OLL-creating sequences
testSequence('F R U R\' U\' F\' (should be L-Shape)', 'F R U R\' U\' F\'', 'L-shaped pattern on U face');

testSequence('R U R\' U R U2 R\' (Sune)', 'R U R\' U R U2 R\'', 'Sune case - should orient some pieces');

testSequence('R U2 R\' U\' R U\' R\' (Anti-Sune)', 'R U2 R\' U\' R U\' R\'', 'Anti-Sune case');

testSequence('F R U R\' U\' R U R\' U\' F\' (OLL 51)', 'F R U R\' U\' R U R\' U\' F\'', 'Line case - opposite edges oriented');

testSequence('R U R\' U\' R\' F R F\' (T-Shape)', 'R U R\' U\' R\' F R F\'', 'T-shaped pattern');

// Test what creates the classic dot case (no edges oriented)
testSequence('R U2 R2 F R F\' U2 R\' F R F\'', 'R U2 R2 F R F\' U2 R\' F R F\'', 'Should create dot pattern');

console.log('🎯 Pattern verification completed!');