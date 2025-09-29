import { createSolvedCube } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern } from './services/solver3x3x3.js';

console.log('=== Finding what creates pattern 10111101 ===');

// Try different algorithms to see what creates 10111101
const algorithms = [
    'R U R\' U R U2 R\'',      // Sune
    'R U2 R\' U\' R U\' R\'',  // Anti-Sune  
    'L\' U\' L U\' L\' U2 L',  // Left-hand Sune
    'L U L\' U L U2 L\'',     // Left-hand Anti-Sune
    'F R U R\' U\' F\'',      // F-Sune
];

algorithms.forEach((alg, i) => {
    const cube = createSolvedCube('3x3x3');
    const moves = parseMoveNotation3x3(alg);
    applyMoveSequence3x3(cube, moves);
    const pattern = getOLLPattern(cube);
    console.log(`${i+1}. ${alg} → ${pattern}`);
});

// Test cube rotations to see if pattern represents a rotated version
console.log('\n=== Testing if 10111101 is a rotation of 01111010 ===');
// Pattern bits: [ULB, UB, URB, UL, UR, ULF, UF, URF]
// 01111010 = [0,1,1,1,1,0,1,0] 
// 10111101 = [1,0,1,1,1,1,0,1] - rotated?