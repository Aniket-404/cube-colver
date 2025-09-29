// Test specific PLL algorithm to verify it works
import { applyMoveSequence3x3, isCubeSolved3x3, getPLLPattern } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Testing T-Perm algorithm specifically ===\n');

// Create the final PLL state from our test (pattern 01021000)
const cube = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube, "R U R' F' R U R' U' R' F R2 U' R' U");

console.log('Initial scrambled state:');
console.log('Pattern:', getPLLPattern(cube));
console.log('Is solved:', isCubeSolved3x3(cube));
console.log();

// Apply T-Perm algorithm 
console.log('Applying T-Perm: R U R\' F\' R U R\' U\' R\' F R2 U\' R\'');
applyMoveSequence3x3(cube, "R U R' F' R U R' U' R' F R2 U' R'");

console.log('After T-Perm:');
console.log('Pattern:', getPLLPattern(cube));
console.log('Is solved:', isCubeSolved3x3(cube));
console.log();

// If not solved, try the inverse
if (!isCubeSolved3x3(cube)) {
    console.log('Trying inverse T-Perm: R U R2 F\' R F R U\' R\' F\' R U\' R\'');
    applyMoveSequence3x3(cube, "R U R2 F' R F R U' R' F' R U' R'");
    
    console.log('After inverse T-Perm:');
    console.log('Pattern:', getPLLPattern(cube));
    console.log('Is solved:', isCubeSolved3x3(cube));
}