// Test Cross solver with specific simple cases
import { solveCross, applyMoveSequence3x3, analyzeCrossState } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Testing Cross solver with simple cases ===\n');

// Test 1: Already solved (should return 0 moves)
console.log('Test 1: Already solved cube');
const cube1 = createSolvedCube('3x3x3');

const analysis1 = analyzeCrossState(cube1);
console.log('Cross solved edges:', analysis1.solvedEdges.length + '/4');
console.log('Is complete:', analysis1.isComplete);

try {
    const result1 = solveCross(cube1);
    console.log('Cross solve result:');
    console.log('- Complete:', result1.isCrossComplete);
    console.log('- Moves:', result1.totalMoves);
    console.log('- Success: ✅');
} catch (error) {
    console.log('- Error:', error.message);
    console.log('- Success: ❌');
}
console.log();

// Test 2: Single F move (should need F' to fix)
console.log('Test 2: Single F move');
const cube2 = createSolvedCube('3x3x3');
applyMoveSequence3x3(cube2, "F");

const analysis2 = analyzeCrossState(cube2);
console.log('Cross solved edges:', analysis2.solvedEdges.length + '/4');

try {
    const result2 = solveCross(cube2);
    console.log('Cross solve result:');
    console.log('- Complete:', result2.isCrossComplete);
    console.log('- Moves:', result2.totalMoves);
    console.log('- Move sequence:', result2.moveSequence);
    console.log('- Success: ✅');
    
    // Verify the solution works
    const testCube = createSolvedCube('3x3x3');
    applyMoveSequence3x3(testCube, "F");
    applyMoveSequence3x3(testCube, result2.moveSequence);
    
    const finalAnalysis = analyzeCrossState(testCube);
    console.log('- Verification: Cross complete =', finalAnalysis.isComplete);
    
} catch (error) {
    console.log('- Error:', error.message);
    console.log('- Success: ❌');
}