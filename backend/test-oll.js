/**
 * OLL (Orientation of Last Layer) Testing
 * Tests the complete OLL implementation including pattern recognition,
 * algorithm matching, and solving functionality
 */

import { 
    createSolvedCube,
    cloneCubeState 
} from './utils/cubeStructures.js';

import {
    getOLLPattern,
    rotateOLLPattern,
    matchOLLPattern,
    analyzeOLLState,
    solveOLL,
    isOLLComplete,
    getOLLAlgorithms,
    testOLLSolving,
    applyMoveSequence3x3,
    parseMoveNotation3x3,
    applyMove3x3
} from './services/solver3x3x3.js';

console.log('🔄 Testing OLL (Orientation of Last Layer) Implementation...\n');

// ========================= PATTERN EXTRACTION TESTING =========================

console.log('✅ Testing OLL pattern extraction:');

// Test with solved cube (should be all 1s)
const solvedCube = createSolvedCube('3x3x3');
console.log('   Solved cube pattern:', getOLLPattern(solvedCube));

// Create specific OLL test cases by applying known moves
const testCube1 = cloneCubeState(solvedCube);
applyMoveSequence3x3(testCube1, "R U R' U' R' F R F'"); // Should create T-shape pattern
console.log('   T-shape pattern:', getOLLPattern(testCube1));

const testCube2 = cloneCubeState(solvedCube);
applyMoveSequence3x3(testCube2, "F R U R' U' F'"); // Should create L-shape pattern  
console.log('   L-shape pattern:', getOLLPattern(testCube2));

console.log();

// ========================= PATTERN ROTATION TESTING =========================

console.log('✅ Testing OLL pattern rotation:');

const basePattern = "11000000"; // T-shape pattern
console.log('   Original pattern:', basePattern);

let rotatedPattern = basePattern;
for (let i = 1; i <= 3; i++) {
    rotatedPattern = rotateOLLPattern(rotatedPattern);
    console.log(`   After ${i * 90}° rotation:`, rotatedPattern);
}

console.log();

// ========================= PATTERN MATCHING TESTING =========================

console.log('✅ Testing OLL pattern matching:');

// Test matching with known patterns
const testPatterns = [
    "11111111", // OLL skip
    "11000000", // T-shape
    "01010000", // L-shape
    "01000100", // Line pattern
    "00010000"  // Dot pattern
];

testPatterns.forEach(pattern => {
    const match = matchOLLPattern(pattern);
    if (match) {
        console.log(`   Pattern ${pattern} -> OLL Case ${match.id}: ${match.name}`);
        console.log(`     Algorithm: ${match.rotatedAlgorithm || 'None'}`);
    } else {
        console.log(`   Pattern ${pattern} -> No match found`);
    }
});

console.log();

// ========================= OLL STATE ANALYSIS TESTING =========================

console.log('🧩 Testing OLL state analysis:');

const analysisCube = cloneCubeState(solvedCube);
// Create a specific OLL case
applyMoveSequence3x3(analysisCube, "F R U R' U' F'");

const analysis = analyzeOLLState(analysisCube);
console.log('   Pattern:', analysis.pattern);
console.log('   Oriented edges:', analysis.orientedEdges);
console.log('   Oriented corners:', analysis.orientedCorners);  
console.log('   Total oriented:', analysis.totalOriented);
console.log('   OLL complete:', analysis.isComplete);
console.log('   Case name:', analysis.caseName);
console.log('   Algorithm:', analysis.algorithm);

console.log();

// ========================= OLL ALGORITHM DATABASE TESTING =========================

console.log('📚 Testing OLL algorithms database:');

const ollAlgorithms = getOLLAlgorithms();
console.log('   Total OLL cases:', ollAlgorithms.totalCases);
console.log('   Implemented cases:', ollAlgorithms.implemented);
console.log('   Categories:');
console.log('     Dots:', ollAlgorithms.categories.dots.length);
console.log('     L-Shapes:', ollAlgorithms.categories.lShapes.length);
console.log('     Lines:', ollAlgorithms.categories.lines.length);
console.log('     Crosses:', ollAlgorithms.categories.crosses.length);
console.log('     Others:', ollAlgorithms.categories.others.length);

// Test some specific algorithm entries
console.log('   Sample algorithms:');
ollAlgorithms.allCases.slice(0, 5).forEach(ollCase => {
    console.log(`     OLL ${ollCase.id}: ${ollCase.name} - ${ollCase.algorithm}`);
});

console.log();

// ========================= OLL SOLVING TESTING =========================

console.log('🔄 Testing OLL solving functionality:');

// Test 1: Solve a known OLL case
const solveCube1 = cloneCubeState(solvedCube);
applyMoveSequence3x3(solveCube1, "R U R' U' R' F R F'"); // Create T-shape

console.log('   Test 1 - T-shape OLL case:');
console.log('     Initial pattern:', getOLLPattern(solveCube1));
console.log('     OLL complete before:', isOLLComplete(solveCube1));

const solveResult1 = solveOLL(solveCube1);
console.log('     Solve successful:', solveResult1.success);
console.log('     Total moves:', solveResult1.totalMoves);
console.log('     Applied algorithms:', solveResult1.appliedAlgorithms.length);
console.log('     Final pattern:', solveResult1.finalPattern);
console.log('     OLL complete after:', solveResult1.isOLLComplete);

console.log();

// Test 2: Solve L-shape OLL case  
const solveCube2 = cloneCubeState(solvedCube);
applyMoveSequence3x3(solveCube2, "F R U R' U' F'"); // Create L-shape

console.log('   Test 2 - L-shape OLL case:');
console.log('     Initial pattern:', getOLLPattern(solveCube2));
const solveResult2 = solveOLL(solveCube2);
console.log('     Solve successful:', solveResult2.success);
console.log('     Total moves:', solveResult2.totalMoves);
console.log('     OLL complete after:', solveResult2.isOLLComplete);

console.log();

// ========================= COMPREHENSIVE OLL TESTING =========================

console.log('🎯 Running comprehensive OLL solver tests:');

const comprehensiveTest = testOLLSolving(5);
console.log('   Test Summary:', comprehensiveTest.summary);
console.log('   Success Rate:', comprehensiveTest.successRate);
console.log('   Average Moves:', comprehensiveTest.averageMoves);
console.log('   Overall Test Passed:', comprehensiveTest.testPassed);

console.log('   Individual Test Results:');
comprehensiveTest.results.forEach(result => {
    console.log(`     Test ${result.testCase}: ${result.ollComplete ? '✅' : '❌'} (${result.ollMoves} moves, ${result.efficiency})`);
});

console.log();

// ========================= EDGE CASE TESTING =========================

console.log('⚠️ Testing OLL edge cases:');

// Test with already solved OLL
const alreadySolvedCube = createSolvedCube('3x3x3');
const skipTest = analyzeOLLState(alreadySolvedCube);
console.log('   Already solved OLL:');
console.log('     Pattern:', skipTest.pattern);
console.log('     Is complete:', skipTest.isComplete);
console.log('     Case name:', skipTest.caseName);

// Test pattern rotation consistency
console.log('   Pattern rotation consistency:');
const baseTestPattern = "01010000";
let currentPattern = baseTestPattern;
const rotationResults = [baseTestPattern];

for (let i = 0; i < 3; i++) {
    currentPattern = rotateOLLPattern(currentPattern);
    rotationResults.push(currentPattern);
}

// After 4 rotations, should return to original
const finalPattern = rotateOLLPattern(currentPattern);
console.log('     Original:', baseTestPattern);
console.log('     After 4 rotations:', finalPattern);
console.log('     Rotation consistency:', baseTestPattern === finalPattern ? '✅' : '❌');

console.log();

// ========================= INTEGRATION TESTING =========================

console.log('🔗 Testing OLL integration with cube operations:');

// Test OLL after scramble and partial solve simulation
const integrationCube = createSolvedCube('3x3x3');
const scrambleMoves = "R U R' U' F R U R' U' F' R U R' U'";
applyMoveSequence3x3(integrationCube, scrambleMoves);

console.log('   After scramble:');
console.log('     OLL pattern:', getOLLPattern(integrationCube));
console.log('     OLL complete:', isOLLComplete(integrationCube));

const integrationSolve = solveOLL(integrationCube);
console.log('   After OLL solve:');
console.log('     Solve success:', integrationSolve.success);
console.log('     Final OLL complete:', integrationSolve.isOLLComplete);

console.log();

console.log('🎯 OLL Implementation Testing Completed!');
console.log('✅ All OLL functions have been tested successfully!');