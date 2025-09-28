/**
 * Debug F2 F2 vs F F F F
 * Test why F2 F2 doesn't equal F F F F
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    parseSingleMove3x3,
    applyMove3x3
} from './services/solver3x3x3.js';

console.log('🔍 Debugging F2 F2 vs F F F F...\n');

// Test 1: Apply F F F F using individual moves
console.log('=== Test 1: F F F F (four individual F moves) ===');
const cube1 = createSolvedCube('3x3x3');
const parsedF = parseSingleMove3x3('F');

console.log('Initial U face:', cube1.faces.U);
applyMove3x3(cube1, parsedF);
console.log('After F:      ', cube1.faces.U);
applyMove3x3(cube1, parsedF);
console.log('After F F:    ', cube1.faces.U);
applyMove3x3(cube1, parsedF);
console.log('After F F F:  ', cube1.faces.U);
applyMove3x3(cube1, parsedF);
console.log('After F F F F:', cube1.faces.U);
console.log();

// Test 2: Apply F2 F2 using F2 moves
console.log('=== Test 2: F2 F2 (two F2 moves) ===');
const cube2 = createSolvedCube('3x3x3');
const parsedF2 = parseSingleMove3x3('F2');

console.log('Initial U face:', cube2.faces.U);
applyMove3x3(cube2, parsedF2);
console.log('After F2:     ', cube2.faces.U);
applyMove3x3(cube2, parsedF2);
console.log('After F2 F2:  ', cube2.faces.U);
console.log();

// Test 3: Using applyMoveSequence3x3
console.log('=== Test 3: Using applyMoveSequence3x3 ===');
const cube3a = createSolvedCube('3x3x3');
const cube3b = createSolvedCube('3x3x3');

console.log('Testing "F F F F" sequence...');
applyMoveSequence3x3(cube3a, 'F F F F');
console.log('Result:', cube3a.faces.U);

console.log('Testing "F2 F2" sequence...');
applyMoveSequence3x3(cube3b, 'F2 F2');
console.log('Result:', cube3b.faces.U);

console.log();

// Test 4: Check if the issue is in sequence parsing
console.log('=== Test 4: Check sequence parsing ===');
console.log('Parsing "F F F F":');
const sequence1 = 'F F F F'.split(' ').map(move => parseSingleMove3x3(move));
console.log(sequence1);

console.log('Parsing "F2 F2":');
const sequence2 = 'F2 F2'.split(' ').map(move => parseSingleMove3x3(move));
console.log(sequence2);

console.log('🎯 F2 F2 Debug Complete!');