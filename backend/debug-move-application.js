// Debug: Test if move application is working correctly
import { applyMoveSequence3x3, isCubeSolved3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Testing move application ===\n');

const cube = createSolvedCube('3x3x3');

console.log('Initial state (solved):');
console.log('U face:', cube.faces.U.join(' '));
console.log('L face:', cube.faces.L.join(' '));
console.log('F face:', cube.faces.F.join(' '));
console.log('R face:', cube.faces.R.join(' '));
console.log('B face:', cube.faces.B.join(' '));
console.log('D face:', cube.faces.D.join(' '));
console.log('Is solved:', isCubeSolved3x3(cube));
console.log();

// Apply a single R move
console.log('Applying R move...');
const moveResult = applyMoveSequence3x3(cube, "R");
console.log('Move application result:', moveResult);

console.log('After R move:');
console.log('U face:', cube.faces.U.join(' '));
console.log('L face:', cube.faces.L.join(' '));
console.log('F face:', cube.faces.F.join(' '));
console.log('R face:', cube.faces.R.join(' '));
console.log('B face:', cube.faces.B.join(' '));
console.log('D face:', cube.faces.D.join(' '));
console.log('Is solved:', isCubeSolved3x3(cube));
console.log();

// Apply R' to undo
console.log('Applying R\' to undo...');
applyMoveSequence3x3(cube, "R'");

console.log('After R\' move:');
console.log('U face:', cube.faces.U.join(' '));
console.log('L face:', cube.faces.L.join(' '));
console.log('F face:', cube.faces.F.join(' '));
console.log('R face:', cube.faces.R.join(' '));
console.log('B face:', cube.faces.B.join(' '));
console.log('D face:', cube.faces.D.join(' '));
console.log('Is solved:', isCubeSolved3x3(cube));