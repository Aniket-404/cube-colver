/**
 * Debug OLL Pattern Interpretation
 * Check what different patterns actually mean
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Debugging OLL Pattern Interpretation...\n');

function analyzePattern(name, algorithm) {
    console.log(`=== ${name} ===`);
    
    const cube = createSolvedCube('3x3x3');
    if (algorithm) {
        applyMoveSequence3x3(cube, algorithm);
    }
    
    const pattern = getOLLPattern(cube);
    const complete = isOLLComplete(cube);
    
    console.log(`Algorithm: ${algorithm || 'none'}`);
    console.log(`Pattern: ${pattern}`);
    console.log(`OLL Complete: ${complete}`);
    console.log('U face:', cube.faces.U);
    
    // Analyze each position in the pattern
    console.log('Pattern breakdown:');
    for (let i = 0; i < 8; i++) {
        const bit = pattern[7-i]; // Pattern is in reverse order
        const pos = i;
        const oriented = bit === '1';
        console.log(`  Position ${pos}: ${oriented ? 'oriented' : 'not oriented'} (${bit})`);
    }
    console.log();
}

// Test different cases
analyzePattern('Solved cube', '');
analyzePattern('After F2', 'F2');
analyzePattern('After M\' U M\' U M\' U M\' U\' M U M U M U', 'M\' U M\' U M\' U M\' U\' M U M U M U');
analyzePattern('After R U R\' U\'', 'R U R\' U\'');

// Let me also check what isOLLComplete actually does
console.log('=== Checking isOLLComplete logic ===');
const solvedCube = createSolvedCube('3x3x3');
console.log('Solved cube U face:', solvedCube.faces.U);
console.log('All should be W:', solvedCube.faces.U.every(color => color === 'W'));

const scrambledCube = createSolvedCube('3x3x3');
applyMoveSequence3x3(scrambledCube, 'R U R\' U\'');
console.log('Scrambled cube U face:', scrambledCube.faces.U);
console.log('All W?', scrambledCube.faces.U.every(color => color === 'W'));
console.log('Colors present:', [...new Set(scrambledCube.faces.U)]);

console.log('🎯 Pattern Analysis Complete!');