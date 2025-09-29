// Test simplest possible PLL case - just the pattern 01021000 we saw
import { applyMoveSequence3x3, isCubeSolved3x3, getPLLPattern } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Testing if any simple moves solve pattern 01021000 ===\n');

// Recreate the exact state we saw (pattern 01021000)
const cube = createSolvedCube('3x3x3');
// Apply the full scramble sequence to get to pattern 01021000
applyMoveSequence3x3(cube, "R U R' F' R U R' U' R' F R2 U' R' U");
// Then apply the PLL solver moves that led to 01021000
applyMoveSequence3x3(cube, "R U R' F' R U R' U' R' F R2 U' R' R' U R' U' R' U' R' U R U R2 R U R' U' R' F R2 U' R' U' R U R' F' R U R' F' R U R' U' R' F R2 U' R' R' U R' U' R' U' R' U R U R2 R U R' U' R' F R2 U' R' U' R U R' F'");

console.log('Current state (pattern should be 01021000):');
console.log('Pattern:', getPLLPattern(cube));
console.log('Is solved:', isCubeSolved3x3(cube));
console.log();

// Try simple moves to solve
const simpleMoves = ["U", "U'", "U2", "R", "R'", "R2"];

for (const move of simpleMoves) {
    const testCube = createSolvedCube('3x3x3');
    // Recreate the state
    applyMoveSequence3x3(testCube, "R U R' F' R U R' U' R' F R2 U' R' U");
    applyMoveSequence3x3(testCube, "R U R' F' R U R' U' R' F R2 U' R' R' U R' U' R' U' R' U R U R2 R U R' U' R' F R2 U' R' U' R U R' F' R U R' F' R U R' U' R' F R2 U' R' R' U R' U' R' U' R' U R U R2 R U R' U' R' F R2 U' R' U' R U R' F'");
    
    // Apply simple move
    applyMoveSequence3x3(testCube, move);
    
    console.log(`After ${move}:`);
    console.log('Pattern:', getPLLPattern(testCube));
    console.log('Is solved:', isCubeSolved3x3(testCube));
    
    if (isCubeSolved3x3(testCube)) {
        console.log(`✅ SUCCESS! Move ${move} solves the case!`);
        break;
    }
    console.log();
}