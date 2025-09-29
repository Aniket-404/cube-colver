/**
 * Debug F2L detection to understand why it's running on simple cases
 */

import { createSolvedCube } from './utils/cubeStructures.js';
import { isF2LComplete, analyzeF2LState, applyMoveSequence3x3, parseMoveNotation3x3 } from './services/solver3x3x3.js';

console.log('=== Testing F2L detection on simple cases ===');

const testCases = [
    { name: "Solved cube", scramble: "" },
    { name: "Single R", scramble: "R" },
    { name: "Single U", scramble: "U" },
    { name: "R U", scramble: "R U" },
];

for (const test of testCases) {
    console.log(`\n=== ${test.name} ===`);
    
    const testCube = createSolvedCube('3x3x3');
    if (test.scramble) {
        const scrambleMoves = parseMoveNotation3x3(test.scramble);
        applyMoveSequence3x3(testCube, scrambleMoves);
    }
    
    const analysis = analyzeF2LState(testCube);
    const isComplete = isF2LComplete(testCube);
    
    console.log(`F2L Analysis:`);
    console.log(`- Total solved: ${analysis.totalSolved}/4`);
    console.log(`- Is complete: ${analysis.isComplete}`);
    console.log(`- Function says complete: ${isComplete}`);
    console.log(`- Should F2L run: ${!isComplete ? 'YES' : 'NO'}`);
}