#!/usr/bin/env node
/**
 * Debug the comprehensive CFOP solver to identify why success rate dropped
 */

import { solveCube3x3, isCubeSolved3x3 } from './services/solver3x3x3.js';
import { createSolvedCube, cloneCubeState } from './utils/cubeStructures.js';
import { parseMoveNotation3x3, applyMoveSequence3x3 } from './services/solver3x3x3.js';

console.log('=== Debugging Comprehensive CFOP Solver ===\n');

// Test with the simplest case: U move (should just swap edges)
function testSimpleCase() {
    console.log('🧪 Testing simple case: U move');
    
    // Create solved cube and apply U move
    const originalCube = createSolvedCube('3x3x3');
    const testCube = cloneCubeState(originalCube);
    
    console.log('Original cube (should be solved):', isCubeSolved3x3(originalCube));
    
    // Apply U move
    const moves = parseMoveNotation3x3('U');
    applyMoveSequence3x3(testCube, moves);
    
    console.log('After U move (should not be solved):', isCubeSolved3x3(testCube));
    console.log('U face after U move:');
    console.log(testCube.faces.U);
    
    // Now try to solve with our comprehensive solver
    console.log('\n🎯 Solving with comprehensive CFOP solver...');
    const result = solveCube3x3(testCube);
    
    console.log('Solver result:', result.success);
    if (result.moveSequence) {
        console.log('Solution moves:', result.moveSequence.join(' '));
    } else {
        console.log('No solution moves available');
    }
    console.log('Total moves:', result.totalMoves);
    
    // Check final state
    console.log('\n🔍 Final state analysis:');
    console.log('Final cube solved?', isCubeSolved3x3(result.finalState));
    
    // CRITICAL DEBUG: Check if we can manually apply the solution
    console.log('\n🧪 Manual solution verification:');
    const manualTestCube = cloneCubeState(testCube);
    console.log('Manual test cube before solution:', isCubeSolved3x3(manualTestCube));
    if (result.moveSequence && result.moveSequence.length > 0) {
        const manualMoves = parseMoveNotation3x3(result.moveSequence.join(' '));
        applyMoveSequence3x3(manualTestCube, manualMoves);
        console.log('Manual test cube after applying solution:', isCubeSolved3x3(manualTestCube));
        if (!isCubeSolved3x3(manualTestCube)) {
            console.log('❌ Manual solution verification failed - solver algorithm wrong');
        } else {
            console.log('✅ Manual solution verification passed - state tracking bug');
        }
    }
    
    if (!isCubeSolved3x3(result.finalState)) {
        console.log('\n❌ Final cube state (not solved):');
        console.log('U face:', result.finalState.faces.U);
        console.log('L face:', result.finalState.faces.L);
        console.log('F face:', result.finalState.faces.F);
        console.log('R face:', result.finalState.faces.R);
        console.log('B face:', result.finalState.faces.B);
        console.log('D face:', result.finalState.faces.D);
        
        // Check what went wrong
        const solvedRef = createSolvedCube('3x3x3');
        console.log('\n🔍 Comparing to solved reference:');
        Object.keys(result.finalState.faces).forEach(face => {
            const finalFace = result.finalState.faces[face];
            const solvedFace = solvedRef.faces[face];
            const matches = finalFace.every((sticker, i) => sticker === solvedFace[i]);
            console.log(`${face} face matches solved: ${matches}`);
            if (!matches) {
                console.log(`  Final: [${finalFace.join(', ')}]`);
                console.log(`  Solved: [${solvedFace.join(', ')}]`);
            }
        });
    } else {
        console.log('✅ Final cube is correctly solved!');
    }
}

// Test with Sune case
function testSuneCase() {
    console.log('\n\n🧪 Testing Sune case: R U R\' U R U2 R\'');
    
    const originalCube = createSolvedCube('3x3x3');
    const testCube = cloneCubeState(originalCube);
    
    // Apply Sune scramble
    const scramble = parseMoveNotation3x3('R U R\' U R U2 R\'');
    applyMoveSequence3x3(testCube, scramble);
    
    console.log('After Sune scramble (should not be solved):', isCubeSolved3x3(testCube));
    
    // Solve with comprehensive solver
    const result = solveCube3x3(testCube);
    
    console.log('\n📊 Sune case results:');
    console.log('Success:', result.success);
    console.log('Total moves:', result.totalMoves);
    console.log('Final solved?', isCubeSolved3x3(result.finalState));
    
    if (!result.success) {
        console.log('❌ Sune case failed - this should be easy to solve');
    }
}

// Run tests
testSimpleCase();
testSuneCase();

console.log('\n=== Debug Complete ===');