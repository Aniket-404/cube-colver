import solver from './services/solver3x3x3.js';
import cubeUtils from './utils/cubeStructures.js';

console.log('🔀 Testing Cross Solving with Scrambled Cube...\n');

// Create a scrambled cube
const solvedCube = cubeUtils.createSolvedCube('3x3x3');
const scramble = "R U R' F D F' L U L'";
console.log('Scramble:', scramble);

try {
  const scrambledCube = solver.applyMoveSequence3x3(solvedCube, scramble);

  // Analyze scrambled state
  console.log('\n📊 Scrambled cube cross analysis:');
  const scrambledAnalysis = solver.analyzeCrossState(scrambledCube);
  console.log('   Solved edges:', scrambledAnalysis.solvedEdges.length + '/4');
  console.log('   Unsolved edges:', scrambledAnalysis.unsolvedEdges.length);

  // Test cross edge detection
  console.log('\n🔍 Finding cross edges...');
  const crossEdges = solver.findCrossEdges(scrambledCube);
  console.log('   Found cross edges:', crossEdges.length);
  crossEdges.forEach((edge, i) => {
    console.log(`   Edge ${i+1}: ${edge.edgeName} (oriented: ${edge.isOriented}, layer: ${edge.layer})`);
  });

  // Solve the cross  
  console.log('\n🛠️ Solving cross...');
  const crossResult = solver.solveCross(scrambledCube);
  console.log('   Cross complete:', crossResult.isCrossComplete);
  console.log('   Total moves:', crossResult.totalMoves);
  console.log('   Move sequence:', crossResult.moveSequence || 'No moves needed');

  console.log('\n✅ Cross solving test completed!');
} catch (error) {
  console.error('❌ Error during testing:', error.message);
  console.error('Stack:', error.stack);
}