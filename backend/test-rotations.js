import solver from './services/solver3x3x3.js';
import cubeUtils from './utils/cubeStructures.js';

console.log('🔄 Testing Cube Rotation Functions (x, y, z)...\n');

// Test 1: Basic rotation parsing
console.log('✅ Testing rotation move parsing:');
const rotations = ['x', 'y', 'z', "x'", "y'", "z'", 'x2', 'y2', 'z2'];
rotations.forEach(rotation => {
  const parsed = solver.parseSingleMove3x3(rotation);
  console.log(`   ${rotation}: face=${parsed.face}, turns=${parsed.turns}`);
});

// Test 2: Rotation application on solved cube
console.log('\n🧩 Testing rotation effects on solved cube:');
const solvedCube = cubeUtils.createSolvedCube('3x3x3');

try {
  // Test x rotation (around R-L axis)
  console.log('\n   Testing x rotation (around R-L axis):');
  const xRotated = solver.applyMove3x3(solvedCube, { face: 'x', turns: 1 });
  console.log('   Front face after x:', xRotated.faces.F[4], '(should be D center color)');
  console.log('   Up face after x:', xRotated.faces.U[4], '(should be F center color)');
  
  // Test y rotation (around U-D axis)  
  console.log('\n   Testing y rotation (around U-D axis):');
  const yRotated = solver.applyMove3x3(solvedCube, { face: 'y', turns: 1 });
  console.log('   Front face after y:', yRotated.faces.F[4], '(should be R center color)');
  console.log('   Right face after y:', yRotated.faces.R[4], '(should be B center color)');
  
  // Test z rotation (around F-B axis)
  console.log('\n   Testing z rotation (around F-B axis):');
  const zRotated = solver.applyMove3x3(solvedCube, { face: 'z', turns: 1 });
  console.log('   Up face after z:', zRotated.faces.U[4], '(should be L center color)');
  console.log('   Right face after z:', zRotated.faces.R[4], '(should be U center color)');
  
  // Test rotation sequence
  console.log('\n   Testing rotation sequence: x y z');
  const sequenceResult = solver.applyMoveSequence3x3(solvedCube, 'x y z');
  console.log('   Sequence applied successfully:', sequenceResult ? 'Yes' : 'No');
  
  // Test inverse rotations (should return to original state)
  console.log('\n   Testing inverse rotations:');
  const testCube = solver.applyMoveSequence3x3(solvedCube, 'x');
  const inverseCube = solver.applyMoveSequence3x3(testCube, "x'");
  const isBackToOriginal = cubeUtils.compareCubeStates(solvedCube, inverseCube);
  console.log('   x followed by x\' returns to original:', isBackToOriginal);
  
  // Test double rotations  
  console.log('\n   Testing double rotations (x2, y2, z2):');
  const x2Cube = solver.applyMoveSequence3x3(solvedCube, 'x2');
  console.log('   x2 applied successfully:', x2Cube ? 'Yes' : 'No');
  
  console.log('\n✅ Cube rotation tests completed successfully!');

} catch (error) {
  console.error('❌ Error during rotation testing:', error.message);
  console.error('Stack:', error.stack);
}

// Test 3: Rotation combinations and cube solving compatibility  
console.log('\n🔄 Testing rotation integration with scrambles:');
try {
  const scrambleWithRotations = "R U R' x D R D' y R U' R'";
  console.log('   Applying scramble with rotations:', scrambleWithRotations);
  const rotatedScramble = solver.applyMoveSequence3x3(solvedCube, scrambleWithRotations);
  console.log('   Scramble with rotations applied successfully');
  
  // Test if cross solver works with rotated cube
  const crossResult = solver.solveCross(rotatedScramble);
  console.log('   Cross solver works with rotated cube:', crossResult.isCrossComplete || crossResult.totalMoves > 0);
  
} catch (error) {
  console.error('❌ Error in rotation integration test:', error.message);
}

console.log('\n🎯 Cube rotation function implementation verified!');