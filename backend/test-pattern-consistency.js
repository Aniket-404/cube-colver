// Test pattern detection consistency
import { analyzeCubeState3x3, analyzeOLLState, applyMoveSequence3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('🔍 Testing Pattern Detection Consistency...\n');

// Create a cube with Sune pattern
let cube = createSolvedCube('3x3x3');

// Apply Sune setup
const suneSetup = "R U R' U R U2 R'";
applyMoveSequence3x3(cube, suneSetup);

console.log('1. After Sune setup:');
const analysis1 = analyzeCubeState3x3(cube);
const ollAnalysis1 = analyzeOLLState(cube);

console.log('   analyzeCubeState3x3 OLL:', analysis1.oll.pattern);
console.log('   analyzeOLLState pattern:', ollAnalysis1.pattern);
console.log('   Match?', analysis1.oll.pattern === ollAnalysis1.pattern ? '✅' : '❌');

// Apply the correct Sune algorithm
console.log('\n2. Applying correct Sune algorithm: R U2 R\' U\' R U\' R\'');
const suneAlgorithm = "R U2 R' U' R U' R'";
applyMoveSequence3x3(cube, suneAlgorithm);

console.log('\n3. After Sune algorithm:');
const analysis2 = analyzeCubeState3x3(cube);
const ollAnalysis2 = analyzeOLLState(cube);

console.log('   analyzeCubeState3x3 OLL complete:', analysis2.oll.complete);
console.log('   analyzeOLLState complete:', ollAnalysis2.isComplete);
console.log('   analyzeCubeState3x3 pattern:', analysis2.oll.pattern);
console.log('   analyzeOLLState pattern:', ollAnalysis2.pattern);
console.log('   Overall solved?', analysis2.overall.solved);

console.log('\n🔍 Pattern detection', 
    (analysis2.oll.complete && ollAnalysis2.isComplete) ? '✅ CONSISTENT' : '❌ INCONSISTENT');