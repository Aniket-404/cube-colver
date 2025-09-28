/**
 * Debug OLL Pattern Extraction
 * Testing to understand cube state structure and fix pattern detection
 */

import { 
    createSolvedCube,
    cloneCubeState 
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3
} from './services/solver3x3x3.js';

console.log('🔍 Debugging OLL Pattern Extraction...\n');

// Create solved cube and examine structure
const solvedCube = createSolvedCube('3x3x3');
console.log('Solved cube structure:');
console.log('Type:', solvedCube.cubeType);
console.log('Faces keys:', Object.keys(solvedCube.faces));
console.log('U face:', solvedCube.faces.U);
console.log('U face length:', solvedCube.faces.U.length);

// Apply a simple move and see the changes
const testCube = cloneCubeState(solvedCube);
console.log('\nBefore R move:');
console.log('U face:', testCube.faces.U);

const result = applyMoveSequence3x3(testCube, "R");
console.log('Move result success:', result.success);

console.log('\nAfter R move:');
console.log('U face:', testCube.faces.U);

// Test with a sequence that should affect OLL
const ollTestCube = cloneCubeState(solvedCube);
console.log('\nTesting OLL-affecting sequence:');
console.log('Before F R U R\' U\' F\':');
console.log('U face:', ollTestCube.faces.U);

const ollResult = applyMoveSequence3x3(ollTestCube, "F R U R' U' F'");
console.log('OLL move result success:', ollResult.success);

console.log('\nAfter F R U R\' U\' F\':');
console.log('U face:', ollTestCube.faces.U);

// Let's also test the current pattern extraction logic manually
function debugOLLPattern(cubeState) {
    const uFace = cubeState.faces.U;
    const uCenter = uFace[4]; // Center color (should be U color for proper OLL)
    
    console.log('\nPattern extraction debug:');
    console.log('U face array:', uFace);
    console.log('U center color:', uCenter);
    
    // Extract the 8 key positions (corners and edges, excluding center)  
    // For 3x3x3: positions 0,1,2,3,5,6,7,8 (skipping 4 which is center)
    const positions = [0, 1, 2, 3, 5, 6, 7, 8];
    
    const patternBits = positions.map((pos, index) => {
        const sticker = uFace[pos];
        const isOriented = sticker === uCenter;
        console.log(`Position ${pos} (index ${index}): ${sticker} -> ${isOriented ? 1 : 0}`);
        return isOriented ? '1' : '0';
    });
    
    const pattern = patternBits.join('');
    console.log('Final pattern:', pattern);
    
    return pattern;
}

console.log('\n=== Pattern Extraction Analysis ===');
debugOLLPattern(solvedCube);

console.log('\n=== After OLL moves ===');
debugOLLPattern(ollTestCube);