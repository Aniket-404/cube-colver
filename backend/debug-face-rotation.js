/**
 * Debug Face Rotation Logic
 * Test the core face rotation mechanism
 */

import { 
    createSolvedCube,
    cloneCubeState
} from './utils/cubeStructures.js';

import {
    rotateFace3x3,
    parseSingleMove3x3,
    applyMove3x3
} from './services/solver3x3x3.js';

console.log('🔍 Debugging Face Rotation Logic...\n');

function testFaceRotation(face, turns, label) {
    console.log(`=== ${label} ===`);
    
    const cube = createSolvedCube('3x3x3');
    console.log('Initial F face:', cube.faces.F);
    console.log('Initial U face:', cube.faces.U);
    
    console.log(`\nApplying rotateFace3x3('${face}', ${turns})...`);
    const newState = rotateFace3x3(cube, face, turns);
    
    console.log('After rotation:');
    console.log('F face:', newState.faces.F);
    console.log('U face:', newState.faces.U);
    console.log();
}

// Test individual rotations
testFaceRotation('F', 1, 'F (single 90-degree turn)');
testFaceRotation('F', 2, 'F2 (double 180-degree turn)');
testFaceRotation('F', 4, 'F4 (should be identity)');

// Now test the sequence F F vs F2
console.log('=== Comparing F F vs F2 ===');

const cube1 = createSolvedCube('3x3x3');
console.log('Starting cube U face:', cube1.faces.U);

// Apply F twice using individual moves
const parsedF = parseSingleMove3x3('F');
console.log('Parsed F move:', parsedF);

console.log('\\nApplying first F...');
applyMove3x3(cube1, parsedF);
console.log('After first F:', cube1.faces.U);

console.log('\\nApplying second F...');
applyMove3x3(cube1, parsedF);
console.log('After second F (F F):', cube1.faces.U);

// Now test F2 directly
const cube2 = createSolvedCube('3x3x3');
const parsedF2 = parseSingleMove3x3('F2');
console.log('\\nParsed F2 move:', parsedF2);

console.log('\\nApplying F2...');
applyMove3x3(cube2, parsedF2);
console.log('After F2:', cube2.faces.U);

// Compare results
console.log('\\n=== COMPARISON ===');
const ffMatch = JSON.stringify(cube1.faces.U) === JSON.stringify(cube2.faces.U);
console.log('F F equals F2?', ffMatch);
console.log('F F result:  ', cube1.faces.U);
console.log('F2 result:   ', cube2.faces.U);

console.log('🎯 Face Rotation Debug Complete!');