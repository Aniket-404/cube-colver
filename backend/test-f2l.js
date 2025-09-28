import solver from './services/solver3x3x3.js';
import cubeUtils from './utils/cubeStructures.js';

console.log('🧩 Testing F2L (First Two Layers) Implementation...\n');

// Test 1: F2L analysis on solved cube
const solvedCube = cubeUtils.createSolvedCube('3x3x3');
console.log('✅ Solved cube F2L analysis:');
const solvedF2LAnalysis = solver.analyzeF2LState(solvedCube);
console.log('   Solved slots:', solvedF2LAnalysis.solvedSlots.length + '/4');
console.log('   Is complete:', solvedF2LAnalysis.isComplete);

// Test 2: F2L pairs finding
console.log('\n🔍 Finding F2L pairs in solved cube:');
const f2lPairs = solver.findF2LPairs(solvedCube);
console.log('   Found pairs:', f2lPairs.length);
f2lPairs.forEach(pair => {
  console.log(`   ${pair.slot}: solved = ${pair.isSolved}`);
});

// Test 3: Test with simple scramble
console.log('\n🔀 Testing F2L with scramble: R U2 R\' D R D\'');
try {
  const scramble = "R U2 R' D R D'";
  const scrambledCube = solver.applyMoveSequence3x3(solvedCube, scramble);
  
  // First solve cross
  console.log('   Solving cross first...');
  const crossResult = solver.solveCross(scrambledCube);
  console.log('   Cross solved:', crossResult.isCrossComplete, `(${crossResult.totalMoves} moves)`);
  
  if (crossResult.isCrossComplete) {
    // Now test F2L
    console.log('   Analyzing F2L state...');
    const f2lAnalysis = solver.analyzeF2LState(crossResult.solvedState);
    console.log('   F2L slots solved:', f2lAnalysis.solvedSlots.length + '/4');
    
    if (f2lAnalysis.totalSolved < 4) {
      console.log('   Attempting F2L solve...');
      const f2lResult = solver.solveF2L(crossResult.solvedState);
      console.log('   F2L complete:', f2lResult.isF2LComplete, `(${f2lResult.totalMoves} moves)`);
    }
  }
  
  console.log('\n✅ F2L tests completed!');
} catch (error) {
  console.error('❌ Error during F2L testing:', error.message);
}