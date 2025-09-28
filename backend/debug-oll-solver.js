/**
 * Debug OLL solver step by step
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete,
    analyzeOLLState,
    matchOLLPattern,
    solveOLL
} from './services/solver3x3x3.js';

console.log('🔍 Debug OLL Solver Step by Step...\n');

// Test simple F2 case
console.log('=== Testing F2 Case ===');
const cube = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube, 'F2');

console.log('1. Pattern extraction:');
const pattern = getOLLPattern(cube);
console.log(`   Pattern: ${pattern}`);

console.log('2. OLL complete check:');
const complete = isOLLComplete(cube);
console.log(`   Complete: ${complete}`);

console.log('3. Pattern matching:');
const matchedCase = matchOLLPattern(pattern);
console.log(`   Matched case:`, matchedCase);

console.log('4. State analysis:');
const analysis = analyzeOLLState(cube);
console.log(`   Analysis:`, analysis);

console.log('5. Full solve:');
const solution = solveOLL(cube);
console.log(`   Solution:`, solution);

console.log('\n=== Testing Sune Case ===');
const cube2 = createSolvedCube('3x3x3'); 
applyMoveSequence3x3(cube2, 'R U2 R\' U\' R U\' R\'');

const pattern2 = getOLLPattern(cube2);
console.log(`Pattern: ${pattern2}`);

const analysis2 = analyzeOLLState(cube2);
console.log(`Analysis:`, analysis2);

const solution2 = solveOLL(cube2);
console.log(`Solution:`, solution2);

console.log('\n🎯 Debug Complete!');