/**
 * Simple OLL Debug - test with moves that definitely affect U face
 */

import { 
    createSolvedCube,
    cloneCubeState 
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3
} from './services/solver3x3x3.js';

console.log('🔍 Simple OLL Debug - U face affecting moves...\n');

const cube = createSolvedCube('3x3x3');

// Test U move (should just rotate U face but not change colors)
console.log('Before U move:');
console.log('U face:', cube.faces.U);
console.log('F face:', cube.faces.F);

applyMoveSequence3x3(cube, "U");

console.log('\nAfter U move:');
console.log('U face:', cube.faces.U);
console.log('F face:', cube.faces.F);

// Test F move (should bring F face color to U face)
const cube2 = createSolvedCube('3x3x3');
console.log('\nBefore F move:');
console.log('U face:', cube2.faces.U);
console.log('F face (top edge):', cube2.faces.F[0], cube2.faces.F[1], cube2.faces.F[2]);

applyMoveSequence3x3(cube2, "F");

console.log('\nAfter F move:');
console.log('U face:', cube2.faces.U);
console.log('F face (top edge):', cube2.faces.F[0], cube2.faces.F[1], cube2.faces.F[2]);

// Test more complex sequence that should definitely affect OLL
const cube3 = createSolvedCube('3x3x3');
console.log('\n=== Testing R U R\' sequence ===');
console.log('Before:');
console.log('U face:', cube3.faces.U);

applyMoveSequence3x3(cube3, "R U R'");

console.log('After R U R\':');
console.log('U face:', cube3.faces.U);