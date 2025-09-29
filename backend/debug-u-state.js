#!/usr/bin/env node
/**
 * Debug exact cube state changes
 */

import { createSolvedCube, cloneCubeState } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, isCubeSolved3x3 } from './services/solver3x3x3.js';

console.log('=== Detailed Cube State Analysis ===\n');

// Create solved cube
const solvedCube = createSolvedCube('3x3x3');
console.log('✅ Reference solved cube:');
console.log('F face top row:', solvedCube.faces.F.slice(0, 3));
console.log('R face top row:', solvedCube.faces.R.slice(0, 3));
console.log('B face top row:', solvedCube.faces.B.slice(0, 3)); 
console.log('L face top row:', solvedCube.faces.L.slice(0, 3));

// Apply U move
const testCube = cloneCubeState(solvedCube);
const uMove = parseMoveNotation3x3('U');
console.log('\n🔄 Applying U move...');
applyMoveSequence3x3(testCube, uMove);

console.log('After U move:');
console.log('F face top row:', testCube.faces.F.slice(0, 3));
console.log('R face top row:', testCube.faces.R.slice(0, 3));
console.log('B face top row:', testCube.faces.B.slice(0, 3));
console.log('L face top row:', testCube.faces.L.slice(0, 3));
console.log('Is solved?', isCubeSolved3x3(testCube));

// Apply U' to reverse
const reverseCube = cloneCubeState(testCube);
const uPrimeMove = parseMoveNotation3x3("U'");
console.log('\n🔄 Applying U\' to reverse...');
applyMoveSequence3x3(reverseCube, uPrimeMove);

console.log('After U\' (should be back to solved):');
console.log('F face top row:', reverseCube.faces.F.slice(0, 3));
console.log('R face top row:', reverseCube.faces.R.slice(0, 3));
console.log('B face top row:', reverseCube.faces.B.slice(0, 3));
console.log('L face top row:', reverseCube.faces.L.slice(0, 3));
console.log('Is solved?', isCubeSolved3x3(reverseCube));

// Compare each face 
console.log('\n🔍 Face-by-face comparison (reversed vs solved):');
Object.keys(reverseCube.faces).forEach(face => {
    const reversedFace = reverseCube.faces[face];
    const solvedFace = solvedCube.faces[face];
    const matches = reversedFace.every((sticker, i) => sticker === solvedFace[i]);
    console.log(`${face}: ${matches ? '✅' : '❌'} ${matches ? 'MATCH' : 'DIFFERENT'}`);
    if (!matches) {
        console.log(`  Reversed: [${reversedFace.slice(0, 9).join(', ')}]`);
        console.log(`  Solved:   [${solvedFace.slice(0, 9).join(', ')}]`);
    }
});