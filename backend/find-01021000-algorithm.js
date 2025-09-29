// Find what algorithm solves pattern 01021000 from CFOP test
import { applyMoveSequence3x3, isCubeSolved3x3, getPLLPattern } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Finding algorithm for pattern 01021000 ===\n');

// Recreate the exact state from CFOP test that produced 01021000
function createPattern01021000() {
    const cube = createSolvedCube('3x3x3');
    // Apply Sune scramble
    applyMoveSequence3x3(cube, "R U R' U R U2 R'");
    // Apply OLL solution (Sune)
    applyMoveSequence3x3(cube, "R U2 R' U' R U' R'");
    // This should give us the 01021000 pattern
    return cube;
}

const cube = createPattern01021000();
console.log('Initial pattern:', getPLLPattern(cube));
console.log('Is solved:', isCubeSolved3x3(cube));
console.log();

// Test simple moves to see if any solve it
const testMoves = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2'];

console.log('Testing simple moves:');
for (const move of testMoves) {
    const testCube = createPattern01021000();
    applyMoveSequence3x3(testCube, move);
    
    const afterPattern = getPLLPattern(testCube);
    const solved = isCubeSolved3x3(testCube);
    
    console.log(`${move.padEnd(3)}: ${afterPattern} → ${solved ? '✅ SOLVED' : '❌'}`);
    
    if (solved) {
        console.log(`\n🎉 Found solution! Pattern 01021000 → Algorithm "${move}"`);
        break;
    }
}
console.log();

// If simple moves don't work, test 2-move combinations
const moves2 = ['U', "U'", 'U2'];
console.log('Testing 2-move combinations:');

let found = false;
for (const move1 of moves2) {
    for (const move2 of moves2) {
        if (move1 === move2) continue; // Skip same move twice
        
        const testCube = createPattern01021000();
        applyMoveSequence3x3(testCube, `${move1} ${move2}`);
        
        const solved = isCubeSolved3x3(testCube);
        
        if (solved) {
            console.log(`🎉 Found 2-move solution! Pattern 01021000 → Algorithm "${move1} ${move2}"`);
            found = true;
            break;
        }
    }
    if (found) break;
}