// Test OLL solver in isolation
import { solveOLL, analyzeCubeState3x3, applyMoveSequence3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('🧪 Testing OLL Solver in Isolation...\n');

// Create a cube with Sune pattern
let cube = createSolvedCube('3x3x3');
console.log('1. Starting with solved cube');

// Apply Sune setup to create Sune case
const suneSetup = "R U R' U R U2 R'";
applyMoveSequence3x3(cube, suneSetup);
console.log(`2. Applied Sune setup: ${suneSetup}`);

const initialAnalysis = analyzeCubeState3x3(cube);
console.log('3. Initial OLL analysis:', initialAnalysis.oll);

// Now use the OLL solver
console.log('\n4. Calling solveOLL()...');
const ollResult = solveOLL(cube);

console.log('5. OLL solver result:');
console.log('   - Success:', ollResult.success);
console.log('   - Total moves:', ollResult.totalMoves);
console.log('   - Applied algorithms:', ollResult.appliedAlgorithms.length);
console.log('   - Attempts:', ollResult.attempts);

if (ollResult.appliedAlgorithms.length > 0) {
    console.log('   - Applied algorithms:');
    ollResult.appliedAlgorithms.forEach((alg, i) => {
        console.log(`     ${i+1}. ${alg.name}: ${alg.algorithm} (${alg.moves} moves)`);
    });
}

// Check final state after OLL solver
const finalAnalysis = analyzeCubeState3x3(ollResult.finalState);
console.log('\n6. Final analysis after OLL solver:', finalAnalysis.oll);
console.log('7. Final overall state:', finalAnalysis.overall);

console.log('\n🔍 Result: OLL solver', 
    ollResult.success && finalAnalysis.oll.complete ? '✅ SUCCESS' : '❌ FAILED');