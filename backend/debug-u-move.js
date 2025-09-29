#!/usr/bin/env node
/**
 * Debug U move application to understand the exact state changes
 */

import { createSolvedCube, cloneCubeState } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, isCubeSolved3x3 } from './services/solver3x3x3.js';

console.log('=== U Move State Analysis ===\n');

// Create solved cube
const solvedCube = createSolvedCube('3x3x3');
console.log('✅ Solved cube created');
console.log('Is solved?', isCubeSolved3x3(solvedCube));

// Apply U move
const testCube1 = cloneCubeState(solvedCube);
const uMove = parseMoveNotation3x3('U');
applyMoveSequence3x3(testCube1, uMove);
console.log('\n🔄 After U move:');
console.log('Is solved?', isCubeSolved3x3(testCube1));
console.log('U face edges:');
console.log('Top:', testCube1.faces.U.slice(0, 3));
console.log('Mid:', testCube1.faces.U.slice(3, 6));  
console.log('Bot:', testCube1.faces.U.slice(6, 9));

// Try U' to solve
const testCube2 = cloneCubeState(testCube1);
const uPrimeMove = parseMoveNotation3x3("U'");
applyMoveSequence3x3(testCube2, uPrimeMove);
console.log('\n🔄 After U\' (should solve):');
console.log('Is solved?', isCubeSolved3x3(testCube2));

// Try U2 (what solver attempted)
const testCube3 = cloneCubeState(testCube1);
const u2Move = parseMoveNotation3x3('U2');
applyMoveSequence3x3(testCube3, u2Move);
console.log('\n🔄 After U2 (what solver tried):');
console.log('Is solved?', isCubeSolved3x3(testCube3));

// Test edge positions after each move
console.log('\n📊 Edge analysis:');
console.log('Original F-U edge (should be G):', solvedCube.faces.F[1]);
console.log('After U, F-U edge (should be different):', testCube1.faces.F[1]);
console.log('After U\', F-U edge (should be back to G):', testCube2.faces.F[1]); 
console.log('After U2, F-U edge (wrong solution):', testCube3.faces.F[1]);