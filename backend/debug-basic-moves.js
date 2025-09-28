/**
 * Debug R U R' U' sequence on solved cube
 */

import { 
    createSolvedCube 
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern
} from './services/solver3x3x3.js';

console.log('🔍 Debugging R U R\' U\' on solved cube...\n');

const cube = createSolvedCube('3x3x3');

console.log('=== INITIAL SOLVED CUBE ===');
console.log('OLL Pattern:', getOLLPattern(cube));
console.log('U face:', cube.faces.U);

console.log('\n=== After R ===');
applyMoveSequence3x3(cube, 'R');
console.log('OLL Pattern:', getOLLPattern(cube));
console.log('U face:', cube.faces.U);

console.log('\n=== After R U ===');
applyMoveSequence3x3(cube, 'U');
console.log('OLL Pattern:', getOLLPattern(cube));
console.log('U face:', cube.faces.U);

console.log('\n=== After R U R\' ===');
applyMoveSequence3x3(cube, 'R\'');
console.log('OLL Pattern:', getOLLPattern(cube));
console.log('U face:', cube.faces.U);

console.log('\n=== After R U R\' U\' (final) ===');
applyMoveSequence3x3(cube, 'U\'');
console.log('OLL Pattern:', getOLLPattern(cube));
console.log('U face:', cube.faces.U);

// Let's also test if the moves are being applied correctly by checking a simple R move
console.log('\n=== FRESH CUBE - Testing single R move ===');
const cube2 = createSolvedCube('3x3x3');
console.log('Before R:');
console.log('Front face:', cube2.faces.F);
console.log('Right face:', cube2.faces.R);
console.log('Back face:', cube2.faces.B);
console.log('Up face:', cube2.faces.U);
console.log('Down face:', cube2.faces.D);

applyMoveSequence3x3(cube2, 'R');
console.log('\nAfter R:');
console.log('Front face:', cube2.faces.F);
console.log('Right face:', cube2.faces.R);  
console.log('Back face:', cube2.faces.B);
console.log('Up face:', cube2.faces.U);
console.log('Down face:', cube2.faces.D);