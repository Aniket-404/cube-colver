/**
 * Debug Pattern Collision Issue
 * Check why Sune and Anti-Sune create same pattern
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern
} from './services/solver3x3x3.js';

console.log('🔍 Debugging Pattern Collision Issue...\n');

function checkSetupPattern(name, setupSequence) {
    console.log(`=== ${name} ===`);
    const cube = createSolvedCube('3x3x3');
    
    console.log(`Setup: ${setupSequence}`);
    applyMoveSequence3x3(cube, setupSequence);
    const pattern = getOLLPattern(cube);
    console.log(`Pattern: ${pattern}`);
    console.log(`U face:`, cube.faces.U);
    console.log();
    
    return pattern;
}

// Check our verified setups
const sunePattern = checkSetupPattern('Sune setup', 'R U2 R\' U\' R U\' R\'');
const antiSunePattern = checkSetupPattern('Anti-Sune setup', 'R U R\' U R U2 R\'');

console.log(`Patterns identical: ${sunePattern === antiSunePattern}`);

if (sunePattern === antiSunePattern) {
    console.log('\\n=== INVESTIGATING WHY THEY\'RE THE SAME ===');
    
    // Maybe these setups don't actually create proper Sune/Anti-Sune cases?
    // Let's try other known Sune setups
    
    checkSetupPattern('Alternative Sune setup 1', 'F R U R\' U\' F\' U2 R U R\' U R U2 R\'');
    checkSetupPattern('Alternative Anti-Sune setup 1', 'R U R\' U\' R\' F R F\' R U2 R\' U\' R U\' R\'');
    
    // Try creating them with the inverse of their solve algorithms
    console.log('=== TRYING INVERSE APPROACH ===');
    
    // If Sune algorithm is "R U R' U R U2 R'", then its inverse should create Sune case
    checkSetupPattern('Sune via inverse', 'R U2 R\' U\' R U\' R\'');
    
    // If Anti-Sune is "R U2 R' U' R U' R'", then its inverse creates Anti-Sune case  
    checkSetupPattern('Anti-Sune via inverse', 'R U R\' U R U2 R\'');
    
    // Maybe I need to create the patterns differently
    console.log('=== TRYING DIFFERENT APPROACH ===');
    
    // Create a Sune case by applying scramble + specific moves
    checkSetupPattern('Method 1 - Sune case', 'R U R\' F\' R U R\' U\' R\' F');
    checkSetupPattern('Method 1 - Anti-Sune case', 'F R U\' R\' U\' R U R\' F\'');
}

console.log('🎯 Pattern Collision Debug Complete!');