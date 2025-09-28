/**
 * Test Updated PLL Solver with Verified Database
 * Check success rate with verified working cases
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getPLLPattern,
    isPLLComplete,
    solvePLL
} from './services/solver3x3x3.js';

console.log('🧪 Testing Updated PLL Solver with Verified Database...\n');

// Test cases using verified working setups
const testCases = [
    {
        name: "Already Solved",
        setup: "",
        expectedPattern: "00000000"
    },
    {
        name: "U2 Case",
        setup: "U2",
        expectedPattern: "11001100"
    },
    {
        name: "R2 Case", 
        setup: "R2",
        expectedPattern: "01001010"
    },
    {
        name: "F2 Case",
        setup: "F2",
        expectedPattern: "00100100"
    },
    {
        name: "L2 Case",
        setup: "L2",
        expectedPattern: "00011010"
    },
    {
        name: "B2 Case",
        setup: "B2",
        expectedPattern: "10001000"
    },
    {
        name: "M2 Case",
        setup: "M2", 
        expectedPattern: "01001000"
    },
    {
        name: "Random Scramble 1",
        setup: "R U F' D L' B",
        expectedPattern: "unknown"
    },
    {
        name: "Random Scramble 2",
        setup: "U R2 D' L F2 B'",
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
    
    const beforePattern = getPLLPattern(cube);
    console.log(`Before pattern: ${beforePattern}`);
    
    if (testCase.expectedPattern !== "unknown") {
        const patternMatch = beforePattern === testCase.expectedPattern;
        console.log(`Expected pattern: ${testCase.expectedPattern} ${patternMatch ? '✅' : '❌'}`);
    }
    
    const beforePLL = isPLLComplete(cube);
    console.log(`Before PLL complete: ${beforePLL}`);
    
    if (beforePLL) {
        console.log('✅ Already solved - SUCCESS');
        successCount++;
        results.push({ name: testCase.name, success: true, reason: 'Already solved' });
    } else {
        const solution = solvePLL(cube);
        
        if (solution.success) {
            const algorithmsUsed = solution.appliedAlgorithms.map(alg => alg.algorithm).join(' ');
            const caseNames = solution.appliedAlgorithms.map(alg => alg.name).join(', ');
            
            console.log(`✅ Solution found: ${algorithmsUsed} (${solution.totalMoves} moves)`);
            console.log(`   Cases: ${caseNames}`);
            console.log(`   Final pattern: ${solution.finalPattern}`);
            
            if (solution.isPLLComplete) {
                console.log('✅ PLL Complete after solution - SUCCESS');
                successCount++;
                results.push({ 
                    name: testCase.name, 
                    success: true, 
                    moves: algorithmsUsed,
                    cases: caseNames,
                    totalMoves: solution.totalMoves
                });
            } else {
                console.log('❌ PLL NOT complete after solution - FAILED');
                results.push({ 
                    name: testCase.name, 
                    success: false, 
                    reason: 'Solution didnt solve PLL'
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

console.log('\n🎯 PLL Solver Testing Complete!');