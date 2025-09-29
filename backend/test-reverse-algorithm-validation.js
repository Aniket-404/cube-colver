/**
 * Reverse Algorithm Validation Framework
 * Tests algorithms by applying their REVERSE as setup, then the algorithm should solve
 */

import { createSolvedCube, cloneCubeState, compareCubeStates } from './utils/cubeStructures.js';
import { getOLLPattern, isPLLComplete, parseMoveNotation3x3, applyMoveSequence3x3 } from './services/solver3x3x3.js';

console.log('🔄 Starting Reverse Algorithm Validation Framework...');

/**
 * Function to reverse move notation
 */
function reverseMoveSequence(moveString) {
    if (!moveString || moveString.trim() === '') return '';
    
    const moves = parseMoveNotation3x3(moveString);
    const reversedMoves = [];
    
    // Reverse the order and invert each move
    for (let i = moves.length - 1; i >= 0; i--) {
        const move = moves[i];
        let reversedMove = move.face;
        
        // Invert the turns
        if (move.turns === 1) {
            reversedMove += "'"; // Clockwise becomes counter-clockwise
        } else if (move.turns === -1) {
            // Counter-clockwise becomes clockwise (no modifier)
            // reversedMove stays as is
        } else if (move.turns === 2) {
            reversedMove += "2"; // 180-degree moves are their own inverse
        }
        
        reversedMoves.push(reversedMove);
    }
    
    return reversedMoves.join(' ');
}

/**
 * Algorithm test cases with their reverse as setup
 */
const ALGORITHM_TESTS = [
    {
        name: "OLL Skip (Already Oriented)",
        algorithm: "",
        expectedToSolve: true
    },
    {
        name: "Sune (OLL 27)", 
        algorithm: "R U2 R' U' R U' R'",
        expectedToSolve: true
    },
    {
        name: "Anti-Sune (OLL 26)",
        algorithm: "L' U2 L U L' U L",
        expectedToSolve: true
    },
    {
        name: "T-OLL (OLL 21)",
        algorithm: "F R U R' U' F'",
        expectedToSolve: true
    },
    {
        name: "L-Shape OLL (OLL 17)",
        algorithm: "r U R' U' r' F R F'",
        expectedToSolve: true
    },
    {
        name: "H-OLL (OLL 19)",
        algorithm: "R U R' U R U' R' U R U2 R'",
        expectedToSolve: true
    },
    {
        name: "Pi-OLL (OLL 18)", 
        algorithm: "R U2 R2 U' R2 U' R2 U2 R",
        expectedToSolve: true
    },
    {
        name: "Cross OLL (OLL 20)",
        algorithm: "R U R' U R U' R' U R U2 R'",
        expectedToSolve: true
    },
    {
        name: "I-Shape (Basic F-move)",
        algorithm: "F R U R' U' F'",
        expectedToSolve: true
    },
    {
        name: "Simple R-perm test",
        algorithm: "R U R' U R U2 R'",
        expectedToSolve: true
    }
];

/**
 * Test an algorithm by applying its reverse as setup
 */
function testAlgorithmReverse(algorithmTest) {
    try {
        // Start with solved cube
        const testCube = createSolvedCube('3x3x3');
        
        // Apply reverse of algorithm as setup (if algorithm exists)
        if (algorithmTest.algorithm && algorithmTest.algorithm.trim() !== '') {
            const reverseSetup = reverseMoveSequence(algorithmTest.algorithm);
            console.log(`🔄 Setup for ${algorithmTest.name}: ${reverseSetup}`);
            
            const setupMoves = parseMoveNotation3x3(reverseSetup);
            applyMoveSequence3x3(testCube, setupMoves);
        }
        
        // Check initial pattern after setup
        const initialPattern = getOLLPattern(testCube);
        console.log(`📋 Initial pattern after setup: ${initialPattern}`);
        
        // Now apply the algorithm to see if it solves
        if (algorithmTest.algorithm && algorithmTest.algorithm.trim() !== '') {
            const algorithmMoves = parseMoveNotation3x3(algorithmTest.algorithm);
            applyMoveSequence3x3(testCube, algorithmMoves);
        }
        
        // Check if OLL is solved after algorithm
        const finalPattern = getOLLPattern(testCube);
        const isSolved = finalPattern === "11111111";
        
        console.log(`📊 ${algorithmTest.name}: ${isSolved ? '✅ PASS' : '❌ FAIL'} (${algorithmTest.algorithm.length > 0 ? algorithmTest.algorithm.split(' ').length : 0} moves, pattern: ${initialPattern} → ${finalPattern})`);
        
        return {
            name: algorithmTest.name,
            algorithm: algorithmTest.algorithm,
            reverseSetup: algorithmTest.algorithm ? reverseMoveSequence(algorithmTest.algorithm) : "",
            initialPattern: initialPattern,
            finalPattern: finalPattern,
            solved: isSolved,
            success: isSolved,
            moveCount: algorithmTest.algorithm ? algorithmTest.algorithm.split(' ').length : 0
        };
        
    } catch (error) {
        console.log(`❌ ${algorithmTest.name}: ERROR - ${error.message}`);
        return {
            name: algorithmTest.name,
            algorithm: algorithmTest.algorithm,
            success: false,
            error: error.message
        };
    }
}

/**
 * Run comprehensive reverse validation
 */
function runReverseValidation() {
    console.log('\n📋 Testing Algorithms with Reverse Setup...\n');
    
    const results = [];
    let passed = 0;
    let failed = 0;
    
    for (const algorithmTest of ALGORITHM_TESTS) {
        const result = testAlgorithmReverse(algorithmTest);
        results.push(result);
        
        if (result.success) {
            passed++;
        } else {
            failed++;
        }
    }
    
    // Generate report
    console.log('\n📊 REVERSE VALIDATION REPORT\n');
    console.log('══════════════════════════════════════════════════');
    console.log(`Total Tests: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
    
    console.log('\n🔍 ALGORITHM ANALYSIS:\n');
    
    const verified = [];
    const problematic = [];
    
    for (const result of results) {
        if (result.success) {
            console.log(`✅ ${result.name}: VERIFIED (${result.moveCount} moves)`);
            verified.push(result.name);
        } else {
            console.log(`❌ ${result.name}: PROBLEMATIC (${result.error || 'Failed to solve'})`);
            problematic.push(result.name);
        }
    }
    
    console.log('\n🎯 RECOMMENDATIONS:\n');
    console.log('✅ SAFE TO INCLUDE IN DATABASE:');
    for (const alg of verified) {
        console.log(`   • ${alg}`);
    }
    
    console.log('\n❌ DO NOT INCLUDE (Need review):');
    for (const alg of problematic) {
        console.log(`   • ${alg}`);
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Add verified algorithms to ultra-minimal database');
    console.log('2. Review and fix problematic algorithms');
    console.log('3. Test integration with solver before deployment');
    console.log('4. Run end-to-end solver tests to measure success rate improvement');
    
    console.log('\n🔬 Reverse Algorithm Validation Complete!');
    console.log(`📈 Overall Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
    console.log(`✅ Verified Algorithms: ${passed}`);
    console.log(`❌ Problematic Algorithms: ${failed}`);
    
    return results;
}

// Run the validation
runReverseValidation();