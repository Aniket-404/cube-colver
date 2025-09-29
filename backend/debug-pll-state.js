#!/usr/bin/env node
/**
 * Debug PLL solver state modification
 */

import { createSolvedCube, cloneCubeState } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3, isCubeSolved3x3, solvePLL } from './services/solver3x3x3.js';

console.log('=== PLL Solver State Debug ===\n');

// Create U-scrambled cube
const testCube = createSolvedCube('3x3x3');
const uMove = parseMoveNotation3x3('U');
applyMoveSequence3x3(testCube, uMove);

console.log('✅ Test cube created (U scramble):');
console.log('Is solved:', isCubeSolved3x3(testCube));
console.log('F top row:', testCube.faces.F.slice(0, 3));

// Clone for PLL solver test
const pllTestCube = cloneCubeState(testCube);
console.log('\n🎯 Calling solvePLL...');
console.log('Before solvePLL:');
console.log('Is solved:', isCubeSolved3x3(pllTestCube));
console.log('F top row:', pllTestCube.faces.F.slice(0, 3));

// Test manual U' application first
const manualTestCube = cloneCubeState(pllTestCube);
console.log('\n🧪 Testing manual U\' application:');
const manualMoves = parseMoveNotation3x3("U'");
console.log('Parsed U\' moves:', manualMoves.map(m => m.notation));
applyMoveSequence3x3(manualTestCube, manualMoves);
console.log('After manual U\':', isCubeSolved3x3(manualTestCube));
console.log('Manual F top row:', manualTestCube.faces.F.slice(0, 3));

const pllResult = solvePLL(pllTestCube);

console.log('\n📊 PLL Result:');
console.log('Success:', pllResult.success);
console.log('Total moves:', pllResult.totalMoves);
console.log('Algorithms:', pllResult.appliedAlgorithms?.length || 0);
if (pllResult.appliedAlgorithms) {
    pllResult.appliedAlgorithms.forEach((alg, i) => {
        console.log(`  ${i+1}. ${alg.name}: ${alg.algorithm}`);
    });
}

console.log('\n🔍 After solvePLL:');
console.log('Is solved:', isCubeSolved3x3(pllTestCube));
console.log('F top row:', pllTestCube.faces.F.slice(0, 3));

// Compare final states
console.log('\n🧪 State comparison:');
console.log('Original solved F top:', ['G', 'G', 'G']);
console.log('After U scramble F top:', testCube.faces.F.slice(0, 3));
console.log('After PLL solve F top:', pllTestCube.faces.F.slice(0, 3));