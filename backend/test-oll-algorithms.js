/**
 * Test individual OLL algorithms to verify they work correctly
 */

import { createSolvedCube } from './utils/cubeStructures.js';
import { applyMoveSequence3x3, parseMoveNotation3x3, getOLLPattern, analyzeOLLState } from './services/solver3x3x3.js';

console.log('=== Testing OLL algorithms individually ===');

// Test the algorithms that are supposed to work
const testAlgorithms = [
    { pattern: "01111010", algorithm: "R U2 R' U' R U' R'", name: "Sune (OLL 27)" },
    { pattern: "11010100", algorithm: "R' U' R U' R' U2 R", name: "Anti-Sune (OLL 26)" },
    { pattern: "00110100", algorithm: "F R U R' U' F'", name: "Cross Case (OLL 21)" },
];

for (const testCase of testAlgorithms) {
    console.log(`\n=== Testing ${testCase.name} ===`);
    
    // Create a cube with the specific OLL pattern
    const cube = createSolvedCube('3x3x3');
    
    // For simplicity, let's create a scenario and test if algorithm actually solves it
    // We'll create Sune case manually and see if Sune algorithm solves it
    if (testCase.name.includes('Sune (OLL 27)')) {
        // Apply reverse Sune to create Sune case
        const reverseSune = "R U R' U R U2 R'"; // This should create a Sune case
        const reverseMoves = parseMoveNotation3x3(reverseSune);
        applyMoveSequence3x3(cube, reverseMoves);
        
        console.log('After creating Sune case:');
        const beforePattern = getOLLPattern(cube);
        console.log(`Pattern: ${beforePattern}`);
        console.log(`Target pattern: ${testCase.pattern}`);
        console.log(`Match: ${beforePattern === testCase.pattern}`);
        
        // Now apply the Sune algorithm
        const solveMoves = parseMoveNotation3x3(testCase.algorithm);
        applyMoveSequence3x3(cube, solveMoves);
        
        console.log('After applying Sune algorithm:');
        const afterPattern = getOLLPattern(cube);
        console.log(`Pattern: ${afterPattern}`);
        console.log(`Solved: ${afterPattern === '11111111'}`);
    }
    
    // Test if applying the algorithm twice gets back to original (for reversible cases)
    const testCube = createSolvedCube('3x3x3');
    const alg = parseMoveNotation3x3(testCase.algorithm);
    
    // Apply algorithm
    applyMoveSequence3x3(testCube, alg);
    const firstApplication = getOLLPattern(testCube);
    
    // Apply algorithm again  
    applyMoveSequence3x3(testCube, alg);
    const secondApplication = getOLLPattern(testCube);
    
    console.log(`First application pattern: ${firstApplication}`);
    console.log(`Second application pattern: ${secondApplication}`);
}