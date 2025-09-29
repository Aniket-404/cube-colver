/**
 * Debug F2L Pair Detection
 * Test the findF2LPairs function to see what it returns
 */

import { createSolvedCube } from './utils/cubeStructures.js';
import { 
    parseMoveNotation3x3, 
    applyMoveSequence3x3,
    analyzeCubeState3x3,
    findF2LPairs,
    analyzeF2LState,
    isF2LComplete
} from './services/solver3x3x3.js';

console.log('🔍 Debugging F2L Pair Detection...\n');

// Test case 1: Simple Sune case (should have mostly solved F2L)
const testCube1 = createSolvedCube('3x3x3');
const sune = parseMoveNotation3x3("R U R' U R U2 R'");
applyMoveSequence3x3(testCube1, sune);

console.log('=== Test Case 1: Sune (R U R\' U R U2 R\') ===');
console.log('F2L Complete:', isF2LComplete(testCube1));

const analysis1 = analyzeCubeState3x3(testCube1);
console.log('F2L Analysis:', analysis1.f2l);

const f2lAnalysis1 = analyzeF2LState(testCube1);
console.log('Raw F2L Analysis:');
console.log('- Solved slots:', f2lAnalysis1.solvedSlots);
console.log('- Unsolved slots:', f2lAnalysis1.unsolvedSlots);
console.log('- Total solved:', f2lAnalysis1.totalSolved);
console.log('- Is complete:', f2lAnalysis1.isComplete);

const pairs1 = findF2LPairs(testCube1);
console.log('Found F2L pairs:');
pairs1.forEach((pair, index) => {
    console.log(`  ${index + 1}. Slot ${pair.slot}: ${pair.isSolved ? '✅ Solved' : '❌ Not solved'}`);
    console.log(`     Corner: ${pair.corner?.name || 'Not found'}`);
    console.log(`     Edge: ${pair.edge?.name || 'Not found'}`);
});

console.log('\n=== Test Case 2: Scrambled cube ===');
const testCube2 = createSolvedCube('3x3x3');
const scramble = parseMoveNotation3x3("R U F' L D B'");
applyMoveSequence3x3(testCube2, scramble);

console.log('F2L Complete:', isF2LComplete(testCube2));

const analysis2 = analyzeCubeState3x3(testCube2);
console.log('F2L Analysis:', analysis2.f2l);

const f2lAnalysis2 = analyzeF2LState(testCube2);
console.log('Raw F2L Analysis:');
console.log('- Solved slots:', f2lAnalysis2.solvedSlots);
console.log('- Unsolved slots:', f2lAnalysis2.unsolvedSlots);
console.log('- Total solved:', f2lAnalysis2.totalSolved);
console.log('- Is complete:', f2lAnalysis2.isComplete);

const pairs2 = findF2LPairs(testCube2);
console.log('Found F2L pairs:');
pairs2.forEach((pair, index) => {
    console.log(`  ${index + 1}. Slot ${pair.slot}: ${pair.isSolved ? '✅ Solved' : '❌ Not solved'}`);
    console.log(`     Corner: ${pair.corner?.name || 'Not found'}`);
    console.log(`     Edge: ${pair.edge?.name || 'Not found'}`);
});

console.log('\n🎯 F2L Pair Detection Debug Complete!');