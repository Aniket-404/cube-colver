import { createSolvedCube } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, isCubeSolved3x3, getOLLPattern } from './services/solver3x3x3.js';

console.log('=== Testing both Sune variants ===');

// Test what pattern the standard Sune creates
const cube1 = createSolvedCube('3x3x3');
const suneStandard = parseMoveNotation3x3('R U R\' U R U2 R\'');
applyMoveSequence3x3(cube1, suneStandard);
console.log('Standard Sune creates pattern:', getOLLPattern(cube1));

// Test what pattern Anti-Sune creates  
const cube2 = createSolvedCube('3x3x3');
const antiSune = parseMoveNotation3x3('R U2 R\' U\' R U\' R\'');
applyMoveSequence3x3(cube2, antiSune);
console.log('Anti-Sune creates pattern:', getOLLPattern(cube2));

// Test if Anti-Sune solves Sune pattern
const testCube = createSolvedCube('3x3x3');
applyMoveSequence3x3(testCube, suneStandard); // Create Sune pattern
console.log('Created pattern:', getOLLPattern(testCube));
applyMoveSequence3x3(testCube, antiSune); // Apply Anti-Sune
console.log('After Anti-Sune - solved:', isCubeSolved3x3(testCube));