import { createSolvedCube } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, isCubeSolved3x3, getOLLPattern } from './services/solver3x3x3.js';

const cube = createSolvedCube('3x3x3');
const suneAlg = parseMoveNotation3x3('R U R\' U R U2 R\'');
applyMoveSequence3x3(cube, suneAlg);
console.log('Sune pattern:', getOLLPattern(cube));
applyMoveSequence3x3(cube, suneAlg);
console.log('After 2nd Sune - solved:', isCubeSolved3x3(cube));