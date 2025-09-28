/**
 * Test Updated OLL Solver with Expanded Database
 * Check success rate with more verified cases
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete,
    solveOLL
} from './services/solver3x3x3.js';

console.log('🧪 Testing Updated OLL Solver with Expanded Database...\n');

// Test cases using known working setups
const testCases = [
    {
        name: "Already Solved",
        setup: "",
        expectedPattern: "11111111"
    },
    {
        name: "Sune Case",
        setup: "R U2 R' U' R U' R'",  // Anti-Sune creates this
        expectedPattern: "01111010"
    },
    {
        name: "F2 Case", 
        setup: "F2",
        expectedPattern: "11111000"
    },
    {
        name: "R2 Case",
        setup: "R2", 
        expectedPattern: "11010110"
    },
    {
        name: "L2 Case",
        setup: "L2",
        expectedPattern: "01101011"  
    },
    {
        name: "B2 Case",
        setup: "B2",
        expectedPattern: "00011111"
    },
    {
        name: "R2 L2 Case",
        setup: "R2 L2", 
        expectedPattern: "01000010"
    },
    {
        name: "F2 B2 Case",
        setup: "F2 B2",
        expectedPattern: "00011000"
    },
    {
        name: "Random Scramble 1",
        setup: "R U F' R U R' U' R' F R2 U' R'",
        expectedPattern: "unknown"
    },
    {
        name: "Random Scramble 2", 
        setup: "F R U R' U' F' f R U R' U' f'",
        expectedPattern: "unknown"
    }
];

let successCount = 0;
const results = [];

for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`=== Test ${i + 1}: ${testCase.name} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    if (testCase.setup) {
        console.log(`Setup: ${testCase.setup}`);
        applyMoveSequence3x3(cube, testCase.setup);
    } else {
        console.log('Setup: (already solved)');
    }
    
    const beforePattern = getOLLPattern(cube);
    console.log(`Before pattern: ${beforePattern}`);
    
    if (testCase.expectedPattern !== "unknown") {
        const patternMatch = beforePattern === testCase.expectedPattern;
        console.log(`Expected pattern: ${testCase.expectedPattern} ${patternMatch ? '✅' : '❌'}`);
    }
    
    const beforeOLL = isOLLComplete(cube);
    console.log(`Before OLL complete: ${beforeOLL}`);
    
    if (beforeOLL) {
        console.log('✅ Already solved - SUCCESS');
        successCount++;
        results.push({ name: testCase.name, success: true, reason: 'Already solved' });
    } else {
        const solution = solveOLL(cube);
        
        if (solution.success) {
            const algorithmsUsed = solution.appliedAlgorithms.map(alg => alg.algorithm).join(' ');
            const caseNames = solution.appliedAlgorithms.map(alg => alg.name).join(', ');
            
            console.log(`✅ Solution found: ${algorithmsUsed} (${solution.totalMoves} moves)`);
            console.log(`   Cases: ${caseNames}`);
            console.log(`   Final pattern: ${solution.finalPattern}`);
            
            if (solution.isOLLComplete) {
                console.log('✅ OLL Complete after solution - SUCCESS');
                successCount++;
                results.push({ 
                    name: testCase.name, 
                    success: true, 
                    moves: algorithmsUsed,
                    cases: caseNames,
                    totalMoves: solution.totalMoves
                });
            } else {
                console.log('❌ OLL NOT complete after solution - FAILED');
                results.push({ 
                    name: testCase.name, 
                    success: false, 
                    reason: 'Solution didnt solve OLL'
                });
            }
        } else {
            console.log(`❌ No solution found`);
            results.push({ 
                name: testCase.name, 
                success: false, 
                reason: 'No algorithm found'
            });
        }
    }
    
    console.log();
}

// Summary 
console.log('=== FINAL RESULTS ===');
console.log(`Success Rate: ${successCount}/${testCases.length} (${Math.round(successCount/testCases.length*100)}%)`);
console.log();

console.log('Individual Results:');
results.forEach((result, index) => {
    const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
    console.log(`${index + 1}. ${result.name}: ${status}`);
    if (result.moves) {
        console.log(`   Solution: ${result.moves} (${result.totalMoves} moves)`);
        console.log(`   Cases: ${result.cases}`);
    }
    if (result.reason && !result.success) {
        console.log(`   Reason: ${result.reason}`);
    }
});

console.log('\n🎯 OLL Solver Testing Complete!');