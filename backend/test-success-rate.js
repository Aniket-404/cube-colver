/**
 * Test success rate with different scramble types 
 */

import { createSolvedCube } from './utils/cubeStructures.js';
import { solveCube3x3, applyMoveSequence3x3, parseMoveNotation3x3 } from './services/solver3x3x3.js';

console.log('=== Testing CFOP Success Rate with Various Scrambles ===');

const testScrambles = [
    "", // Already solved
    "R", // Single move
    "R U", // Two moves
    "R U R'", // Simple 3-move
    "R U R' U R U2 R'", // Sune (known working)
    "F R U R' U' F'", // OLL case
    "U", // Single U turn 
    "U R U' R'", // Simple F2L
    "R2 U2 R2 U2 R2 U2", // 180-degree moves
    "R U2 R' D R U2 R' D'", // More complex but structured
];

let successCount = 0;
let totalTests = testScrambles.length;

for (let i = 0; i < testScrambles.length; i++) {
    const scramble = testScrambles[i];
    console.log(`\n=== Test ${i + 1}: ${scramble || '(solved cube)'} ===`);
    
    const testCube = createSolvedCube('3x3x3');
    if (scramble) {
        const scrambleMoves = parseMoveNotation3x3(scramble);
        applyMoveSequence3x3(testCube, scrambleMoves);
    }
    
    const startTime = Date.now();
    const result = solveCube3x3(testCube);
    const endTime = Date.now();
    
    const success = result.success;
    const moves = result.totalMoves;
    const time = endTime - startTime;
    
    console.log(`Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Moves: ${moves}, Time: ${time}ms`);
    
    if (success) {
        successCount++;
    } else {
        console.log(`Failure reason: ${result.phases.find(p => !p.success)?.error || 'Unknown'}`);
    }
}

const successRate = (successCount / totalTests * 100).toFixed(1);
console.log(`\n=== OVERALL RESULTS ===`);
console.log(`Success Rate: ${successCount}/${totalTests} = ${successRate}%`);
console.log(`Status: ${successRate >= 50 ? '🎉 GOOD!' : successRate >= 20 ? '🔄 PROGRESS' : '❌ NEEDS WORK'}`);