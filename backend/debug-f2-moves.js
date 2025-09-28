/**
 * Debug F2 Move Implementation
 * Trace exactly what F2 does step by step
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern
} from './services/solver3x3x3.js';

console.log('🔍 Debugging F2 Move Implementation...\n');

function printCubeState(cube, label) {
    console.log(`=== ${label} ===`);
    console.log('U face:', cube.faces.U);
    console.log('F face:', cube.faces.F);
    console.log('D face:', cube.faces.D);
    console.log('B face:', cube.faces.B);
    console.log('L face:', cube.faces.L);
    console.log('R face:', cube.faces.R);
    console.log('Pattern:', getOLLPattern(cube));
    console.log();
}

const cube = createSolvedCube('3x3x3');
printCubeState(cube, 'Initial Solved Cube');

console.log('Applying first F2...');
applyMoveSequence3x3(cube, 'F2');
printCubeState(cube, 'After First F2');

console.log('Applying second F2...');
applyMoveSequence3x3(cube, 'F2'); 
printCubeState(cube, 'After Second F2 (should be back to solved)');

// Let's also test with individual F moves
console.log('\n=== Testing with individual F moves ===');
const cube2 = createSolvedCube('3x3x3');
printCubeState(cube2, 'Fresh Solved Cube');

console.log('Applying F...');
applyMoveSequence3x3(cube2, 'F');
printCubeState(cube2, 'After F');

console.log('Applying F again...');
applyMoveSequence3x3(cube2, 'F');
printCubeState(cube2, 'After F F (equivalent to F2)');

console.log('Applying F again...');
applyMoveSequence3x3(cube2, 'F');
printCubeState(cube2, 'After F F F');

console.log('Applying F again...');
applyMoveSequence3x3(cube2, 'F');
printCubeState(cube2, 'After F F F F (should be back to solved)');

console.log('🎯 F2 Debug Complete!');