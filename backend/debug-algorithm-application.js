/**
 * Debug Algorithm Application Results
 * Check what happens when we apply algorithms to different setups
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Debugging Algorithm Application Results...\n');

function testAlgorithmResult(setupName, setupSeq, algName, algorithm) {
    console.log(`=== ${setupName} + ${algName} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Apply setup
    console.log(`Setup: ${setupSeq}`);
    applyMoveSequence3x3(cube, setupSeq);
    const initialPattern = getOLLPattern(cube);
    console.log(`Initial pattern: ${initialPattern}`);
    
    // Apply algorithm  
    console.log(`Algorithm: ${algorithm}`);
    applyMoveSequence3x3(cube, algorithm);
    const finalPattern = getOLLPattern(cube);
    const solved = isOLLComplete(cube);
    
    console.log(`Final pattern: ${finalPattern}`);
    console.log(`OLL solved: ${solved ? '✅' : '❌'}`);
    console.log();
    
    return { initialPattern, finalPattern, solved };
}

// Test both setups with both algorithms
const results = [];

results.push(testAlgorithmResult(
    'Sune setup', 'R U2 R\' U\' R U\' R\'',
    'Sune alg', 'R U R\' U R U2 R\''
));

results.push(testAlgorithmResult(
    'Sune setup', 'R U2 R\' U\' R U\' R\'', 
    'Anti-Sune alg', 'R U2 R\' U\' R U\' R\''
));

results.push(testAlgorithmResult(
    'Anti-Sune setup', 'R U R\' U R U2 R\'',
    'Sune alg', 'R U R\' U R U2 R\''
));

results.push(testAlgorithmResult(
    'Anti-Sune setup', 'R U R\' U R U2 R\'',
    'Anti-Sune alg', 'R U2 R\' U\' R U\' R\''
));

// Check if any combinations work
console.log('=== ANALYSIS ===');
const workingCombos = results.filter(r => r.solved);
console.log(`Working combinations: ${workingCombos.length}/4`);

// Also test what happens if we apply the algorithms twice (should return to original)
console.log('\\n=== DOUBLE APPLICATION TEST ===');

function testDoubleApplication(name, setup, algorithm) {
    console.log(`=== ${name} (Double Application) ===`);
    
    const cube = createSolvedCube('3x3x3');
    applyMoveSequence3x3(cube, setup);
    const original = getOLLPattern(cube);
    
    console.log(`Original: ${original}`);
    
    // Apply algorithm once
    applyMoveSequence3x3(cube, algorithm);
    const after1 = getOLLPattern(cube);
    console.log(`After 1x: ${after1}`);
    
    // Apply algorithm again  
    applyMoveSequence3x3(cube, algorithm);
    const after2 = getOLLPattern(cube);
    console.log(`After 2x: ${after2}`);
    
    const backToOriginal = original === after2;
    console.log(`Back to original: ${backToOriginal ? '✅' : '❌'}`);
    console.log();
    
    return backToOriginal;
}

testDoubleApplication('Sune', 'R U2 R\' U\' R U\' R\'', 'R U R\' U R U2 R\'');
testDoubleApplication('Anti-Sune', 'R U R\' U R U2 R\'', 'R U2 R\' U\' R U\' R\'');

console.log('🎯 Algorithm Application Debug Complete!');