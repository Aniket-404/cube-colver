#!/usr/bin/env node
/**
 * Debug PLL pattern recognition
 */

import { createSolvedCube, cloneCubeState } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, analyzePLLState } from './services/solver3x3x3.js';

console.log('=== PLL Pattern Analysis for U Move ===');

// Create solved cube and apply U move
const solvedCube = createSolvedCube('3x3x3');
const testCube = cloneCubeState(solvedCube);
const uMove = parseMoveNotation3x3('U');
applyMoveSequence3x3(testCube, uMove);

console.log('Analyzing PLL state after U move:');
const pllAnalysis = analyzePLLState(testCube);
console.log('PLL pattern:', pllAnalysis.pattern);
console.log('Is PLL complete?', pllAnalysis.isComplete);