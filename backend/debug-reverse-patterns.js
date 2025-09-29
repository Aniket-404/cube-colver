// Check the reverse patterns for the working cases
import { applyMoveSequence3x3, getPLLPattern } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Finding reverse patterns for complete PLL fallback ===\n');

// Test U' to see what pattern it creates
const cube1 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube1, "U'");
console.log('U\' creates pattern:', getPLLPattern(cube1));
console.log('Should be solved by: U');
console.log();

// Test what pattern needs U to solve (opposite of U')
const cube2 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube2, "U");
console.log('U creates pattern:', getPLLPattern(cube2));
console.log('Should be solved by: U\'');
console.log();

// Also check what U2 creates to make sure I have the right pattern
const cube3 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube3, "U2");
console.log('U2 creates pattern:', getPLLPattern(cube3));
console.log('Should be solved by: U2');
console.log();

// Check the corner swap reverse
const cube4 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube4, "D R U R' D' R U' R'");
console.log('Reverse corner swap creates pattern:', getPLLPattern(cube4));
console.log('Should be solved by: R U R\' D R U\' R\' D\'');