/**
 * Debug Cross solver for complex scrambles to understand failure patterns
 */

import { createSolvedCube } from './utils/cubeStructures.js';
import { solveCross, analyzeCrossState, applyMoveSequence3x3, parseMoveNotation3x3 } from './services/solver3x3x3.js';

console.log('=== Testing Cross solver with complex scrambles ===');

// Test the failing scramble
const scramble = "R U F' L D B' U' R' F L' D' B";
console.log(`\nTest: Complex scramble: ${scramble}`);

const testCube = createSolvedCube('3x3x3');
const scrambleMoves = parseMoveNotation3x3(scramble);
applyMoveSequence3x3(testCube, scrambleMoves);

console.log('\nInitial cross analysis:');
const initialAnalysis = analyzeCrossState(testCube);
console.log(`- Complete: ${initialAnalysis.isComplete}`);
console.log(`- Solved edges: ${initialAnalysis.solvedEdges}/4`);
console.log(`- Unsolved edges:`, initialAnalysis.unsolvedEdges.map(e => e.targetSideColor));

console.log('\nAttempting cross solve:');
const crossResult = solveCross(testCube);
console.log('Cross solve result:');
console.log(`- Success: ${crossResult.success}`);
console.log(`- Complete: ${crossResult.isCrossComplete}`);
console.log(`- Moves: ${crossResult.totalMoves}`);
console.log(`- Sequence: ${crossResult.moveSequence || 'none'}`);

// Test what specific fallback algorithms are being tried
console.log('\n=== Testing individual fallback algorithms ===');
const crossFallbacks = [
    "F'", "R'", "U'", "L'", "B'", "D'",
    "F2", "R2", "U2", "L2", "B2", "D2"
];

for (const moves of crossFallbacks) {
    const testState = JSON.parse(JSON.stringify(testCube));
    const parsedMoves = parseMoveNotation3x3(moves);
    
    // Apply moves
    for (const move of parsedMoves) {
        applyMoveSequence3x3(testState, [move]);
    }
    
    const testAnalysis = analyzeCrossState(testState);
    console.log(`${moves.padEnd(4)}: ${testAnalysis.solvedEdges}/4 edges (${testAnalysis.isComplete ? 'COMPLETE!' : 'incomplete'})`);
}