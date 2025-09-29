/**
 * Debug final cube states to understand why we're not reaching solved state
 */

import { createSolvedCube } from './utils/cubeStructures.js';
import { solveCube3x3, applyMoveSequence3x3, parseMoveNotation3x3, isCubeSolved3x3 } from './services/solver3x3x3.js';

console.log('=== Debugging final states of failed cases ===');

const failingCases = [
    "R U",
    "R U R'", 
    "F R U R' U' F'"
];

for (let i = 0; i < failingCases.length; i++) {
    const scramble = failingCases[i];
    console.log(`\n=== Case ${i + 1}: ${scramble} ===`);
    
    const testCube = createSolvedCube('3x3x3');
    const scrambleMoves = parseMoveNotation3x3(scramble);
    applyMoveSequence3x3(testCube, scrambleMoves);
    
    const result = solveCube3x3(testCube);
    
    console.log(`Success: ${result.success}`);
    console.log(`Total moves: ${result.totalMoves}`);
    
    if (result.finalState) {
        const actuallyFinalSolved = isCubeSolved3x3(result.finalState);
        console.log(`Final state actually solved: ${actuallyFinalSolved}`);
        
        // Check which faces might be wrong
        const solvedCube = createSolvedCube('3x3x3');
        const faces = ['U', 'L', 'F', 'R', 'B', 'D'];
        
        for (const face of faces) {
            const originalFace = solvedCube.faces[face];
            const finalFace = result.finalState.faces[face];
            const faceMatches = JSON.stringify(originalFace) === JSON.stringify(finalFace);
            console.log(`${face} face correct: ${faceMatches}`);
            
            if (!faceMatches) {
                console.log(`  Expected: [${originalFace.join(', ')}]`);
                console.log(`  Actual:   [${finalFace.join(', ')}]`);
            }
        }
    }
}