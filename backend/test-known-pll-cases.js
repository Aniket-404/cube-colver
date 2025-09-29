// Work backwards: create known PLL cases and find their patterns
import { applyMoveSequence3x3, isCubeSolved3x3, getPLLPattern } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Finding patterns for known PLL algorithms ===\n');

// Test T-Perm: Apply inverse T-Perm to create a T-Perm case
console.log('Creating T-Perm case...');
const tpermCube = createSolvedCube('3x3x3');
// Apply inverse T-Perm to create the case
applyMoveSequence3x3(tpermCube, "R U R2 F' R F R U' R' F' R U' R'");

console.log('T-Perm case created:');
console.log('Pattern:', getPLLPattern(tpermCube));

// Now apply T-Perm to solve it
console.log('Applying T-Perm to solve...');
applyMoveSequence3x3(tpermCube, "R U R' F' R U R' U' R' F R2 U' R'");
console.log('After T-Perm:');
console.log('Pattern:', getPLLPattern(tpermCube));
console.log('Is solved:', isCubeSolved3x3(tpermCube));
console.log();

// Test a simple case: just swap two adjacent edges (U-Perm case)
console.log('Creating U-Perm case...');
const upermCube = createSolvedCube('3x3x3');
// Create U-Perm by swapping two adjacent edges
applyMoveSequence3x3(upermCube, "R2 U R' U R' U' R U' R2");

console.log('U-Perm case created:');
console.log('Pattern:', getPLLPattern(upermCube));

// Apply U-Perm to solve
console.log('Applying U-Perm to solve...');
applyMoveSequence3x3(upermCube, "R2 U' R' U' R U R U R2");
console.log('After U-Perm:');
console.log('Pattern:', getPLLPattern(upermCube));
console.log('Is solved:', isCubeSolved3x3(upermCube));