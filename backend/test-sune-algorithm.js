// Test if our Sune algorithm actually solves Sune pattern
import { applyMoveSequence3x3, analyzeCubeState3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('🧪 Testing Sune Algorithm Correctness...\n');

// Create a cube with Sune pattern
let cube = createSolvedCube('3x3x3');
console.log('1. Starting with solved cube');

// Apply Sune setup to create Sune case
const suneSetup = "R U R' U R U2 R'";
applyMoveSequence3x3(cube, suneSetup);
console.log(`2. Applied Sune setup: ${suneSetup}`);

const analysis1 = analyzeCubeState3x3(cube);
console.log('3. Analysis after setup:', analysis1.oll);

// Now apply the INVERSE of our setup (correct Sune algorithm)
const suneAlgorithm = "R U2 R' U' R U' R'";  // Inverse of setup
applyMoveSequence3x3(cube, suneAlgorithm);
console.log(`4. Applied inverse Sune algorithm: ${suneAlgorithm}`);

const analysis2 = analyzeCubeState3x3(cube);
console.log('5. Analysis after algorithm:', analysis2.oll);

// Check if we're back to solved
const finalAnalysis = analyzeCubeState3x3(cube);
console.log('6. Final state:', finalAnalysis.overall);

console.log('\n🔍 Result: Our Sune algorithm', 
    analysis2.oll.complete ? '✅ WORKS' : '❌ FAILS', 
    'on Sune pattern');