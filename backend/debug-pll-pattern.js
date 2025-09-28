/**
 * Debug PLL Pattern Extraction
 * Understand how the pattern extraction works
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getPLLPattern
} from './services/solver3x3x3.js';

console.log('🔍 Debug PLL Pattern Extraction...\n');

// Test 1: Examine solved cube face colors
console.log('=== Solved Cube Face Analysis ===');
const solvedCube = createSolvedCube('3x3x3');
console.log('U face:', solvedCube.faces.U);
console.log('L face:', solvedCube.faces.L);
console.log('F face:', solvedCube.faces.F);
console.log('R face:', solvedCube.faces.R);
console.log('B face:', solvedCube.faces.B);
console.log('D face:', solvedCube.faces.D);
console.log('Pattern (solved):', getPLLPattern(solvedCube));
console.log();

// Test 2: After simple U move
console.log('=== After U Move ===');
const cubeU = createSolvedCube('3x3x3');
applyMoveSequence3x3(cubeU, 'U');
console.log('U face:', cubeU.faces.U);
console.log('Edge positions after U:');
console.log('- UF edge:', cubeU.faces.U[1], cubeU.faces.F[1]);
console.log('- UR edge:', cubeU.faces.U[5], cubeU.faces.R[1]); 
console.log('- UB edge:', cubeU.faces.U[7], cubeU.faces.B[1]);
console.log('- UL edge:', cubeU.faces.U[3], cubeU.faces.L[1]);
console.log('Pattern (U):', getPLLPattern(cubeU));
console.log();

// Test 3: After U2 move  
console.log('=== After U2 Move ===');
const cubeU2 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cubeU2, 'U2');
console.log('Pattern (U2):', getPLLPattern(cubeU2));
console.log();

// Test 4: Check center colors
console.log('=== Center Color Analysis ===');
const centers = {
    U: solvedCube.faces.U[4],
    L: solvedCube.faces.L[4], 
    F: solvedCube.faces.F[4],
    R: solvedCube.faces.R[4],
    B: solvedCube.faces.B[4],
    D: solvedCube.faces.D[4]
};
console.log('Center colors:', centers);

// Test 5: Create known simple case
console.log('=== Simple 2-edge swap test ===');
const cubeSwap = createSolvedCube('3x3x3');
// Try to create UF-UR swap with R U R' U' R U R' 
applyMoveSequence3x3(cubeSwap, 'R U R\' U R\' F R2 U\' R\' U\' R U R\' F\''); // H-Perm
console.log('After H-Perm setup:');
console.log('Pattern:', getPLLPattern(cubeSwap));

console.log('\n🎯 Debug Complete!');