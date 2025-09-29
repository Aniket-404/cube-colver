// Check if the cube state is valid and use a simpler approach
import { applyMoveSequence3x3, isCubeSolved3x3, getPLLPattern } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Starting with simplest PLL case ===\n');

// Start with the absolute simplest case: just one U move on solved cube
const cube1 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube1, "U");

console.log('Simple U move case:');
console.log('Pattern:', getPLLPattern(cube1));
console.log('Is solved:', isCubeSolved3x3(cube1));

// Try to solve with U'
applyMoveSequence3x3(cube1, "U'");
console.log('After U\':');
console.log('Pattern:', getPLLPattern(cube1));
console.log('Is solved:', isCubeSolved3x3(cube1));
console.log();

// Try U2 case
const cube2 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube2, "U2");

console.log('Simple U2 case:');
console.log('Pattern:', getPLLPattern(cube2));
console.log('Is solved:', isCubeSolved3x3(cube2));

// Try to solve with U2
applyMoveSequence3x3(cube2, "U2");
console.log('After U2:');
console.log('Pattern:', getPLLPattern(cube2));
console.log('Is solved:', isCubeSolved3x3(cube2));
console.log();

// The issue might be that when all pieces move together (like U move),
// the pattern doesn't change because they maintain relative positions.
// Let me create a true PLL case by swapping only 2 corners manually

// Apply a sequence that only swaps corners without affecting OLL
console.log('Testing corner swap case:');
const cube3 = createSolvedCube('3x3x3');
// Use a sequence that should only swap corners: R U R' D R U' R' D'
applyMoveSequence3x3(cube3, "R U R' D R U' R' D'");

console.log('Corner swap case:');
console.log('Pattern:', getPLLPattern(cube3));
console.log('Is solved:', isCubeSolved3x3(cube3));

// Try to solve by reversing
applyMoveSequence3x3(cube3, "D R U R' D' R U' R'");
console.log('After reverse:');
console.log('Pattern:', getPLLPattern(cube3));
console.log('Is solved:', isCubeSolved3x3(cube3));