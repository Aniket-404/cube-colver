import { createSolvedCube } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, getOLLPattern } from './services/solver3x3x3.js';

// Test what pattern Anti-Sune creates (should be 10111101)
const cube = createSolvedCube('3x3x3');
const antiSune = parseMoveNotation3x3('R U2 R\' U\' R U\' R\'');
applyMoveSequence3x3(cube, antiSune);
console.log('Anti-Sune creates pattern:', getOLLPattern(cube));