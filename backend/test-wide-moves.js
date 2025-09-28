/**
 * Test Wide Move Notation Support
 */

import { 
    createSolvedCube,
    cloneCubeState 
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern
} from './services/solver3x3x3.js';

console.log('🔄 Testing Wide Move Notation Support...\n');

// Test lowercase f moves
const cube1 = createSolvedCube('3x3x3');
console.log('Testing f move (wide F):');
console.log('Before f:', cube1.faces.U);

const result1 = applyMoveSequence3x3(cube1, "f");
console.log('Move result success:', result1.success);
console.log('After f:', cube1.faces.U);
console.log('OLL pattern after f:', getOLLPattern(cube1));
console.log();

// Test sequence with f and f'
const cube2 = createSolvedCube('3x3x3');
console.log('Testing f R U R\' U\' f\' sequence:');
console.log('Before:', getOLLPattern(cube2));

const result2 = applyMoveSequence3x3(cube2, "f R U R' U' f'");
console.log('Sequence result success:', result2.success);
console.log('After f R U R\' U\' f\':', getOLLPattern(cube2));
console.log();

// Test if this matches any OLL cases
import { matchOLLPattern } from './services/solver3x3x3.js';
const pattern = getOLLPattern(cube2);
const match = matchOLLPattern(pattern);
if (match) {
    console.log(`Pattern ${pattern} matches OLL Case ${match.id}: ${match.name}`);
    console.log(`Algorithm: ${match.rotatedAlgorithm}`);
} else {
    console.log(`Pattern ${pattern} - no match found in database`);
}

console.log('\n✅ Wide move notation test completed!');