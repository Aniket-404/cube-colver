/**
 * Test Updated OLL Solver with Verified Database
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    solveOLL,
    analyzeOLLState,
    getOLLPattern
} from './services/solver3x3x3.js';

console.log('🔍 Testing Updated OLL Solver...\n');

function testOLLSolver(testName, setupSequence) {
    console.log(`=== ${testName} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Apply setup to create OLL case
    if (setupSequence) {
        console.log(`Setup: ${setupSequence}`);
        applyMoveSequence3x3(cube, setupSequence);
    }
    
    const initialPattern = getOLLPattern(cube);
    console.log(`Initial pattern: ${initialPattern}`);
    
    // Analyze the OLL state
    const analysis = analyzeOLLState(cube);
    console.log(`Analysis:`, {
        caseName: analysis.caseName,
        algorithm: analysis.algorithm,
        orientedEdges: analysis.orientedEdges,
        orientedCorners: analysis.orientedCorners
    });
    
    // Solve OLL
    console.log('\\nSolving OLL...');
    const result = solveOLL(cube);
    
    console.log(`Result:`, {
        success: result.success,
        movesUsed: result.totalMoves,
        algorithmsApplied: result.appliedAlgorithms.length,
        finalPattern: getOLLPattern(cube)
    });
    
    console.log(`Overall: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log();
    
    return result.success;
}

// Test verified cases
let successCount = 0;
let totalTests = 0;

// Test 1: Already solved (should work)
totalTests++;
if (testOLLSolver('Already solved', '')) successCount++;

// Test 2: Sune case (should work - verified)
totalTests++;
if (testOLLSolver('Sune case', 'R U2 R\' U\' R U\' R\'')) successCount++;

// Test 3: Anti-Sune case (should work - verified)  
totalTests++;
if (testOLLSolver('Anti-Sune case', 'R U R\' U R U2 R\'')) successCount++;

// Test 4: F2 case (should work - verified)
totalTests++;
if (testOLLSolver('F2 case', 'F2')) successCount++;

// Test 5: R2 case (should work - verified)
totalTests++;
if (testOLLSolver('R2 case', 'R2')) successCount++;

// Test 6: Random scramble (might work if it creates a known pattern)
totalTests++;
if (testOLLSolver('Random scramble', 'R U R\' F R F\' U F U\' F\'')) successCount++;

console.log(`=== SUMMARY ===`);
console.log(`Success rate: ${successCount}/${totalTests} (${Math.round(successCount/totalTests*100)}%)`);
console.log(`Verified cases working: ${successCount >= 5 ? '✅' : '❌'}`);

console.log('🎯 OLL Solver Testing Complete!');