/**
 * Automated Algorithm Validation Framework
 * Systematically tests OLL/PLL algorithms against known cube states
 * Ensures algorithm correctness before database inclusion
 */

import { createSolvedCube, cloneCubeState, compareCubeStates } from './utils/cubeStructures.js';
import { getOLLPattern, isPLLComplete, parseMoveNotation3x3, applyMoveSequence3x3 } from './services/solver3x3x3.js';

console.log('🧪 Starting Automated Algorithm Validation Framework...');

/**
 * Test cube states with known OLL patterns for validation
 */
const OLL_TEST_CASES = [
    {
        name: "OLL Skip - Already Oriented",
        setupMoves: "", // Solved cube
        expectedPattern: "11111111",
        shouldBeComplete: true
    },
    {
        name: "Sune Case - Proven Working",
        setupMoves: "R U R' U R U2 R'", // Creates Sune pattern
        expectedPattern: "01111010",
        shouldBeComplete: false,
        correctAlgorithm: "R U2 R' U' R U' R'"
    },
    {
        name: "Anti-Sune Case",
        setupMoves: "R U2 R' U' R U' R'", // Creates Anti-Sune pattern
        expectedPattern: "11010100",
        shouldBeComplete: false,
        correctAlgorithm: "R U R' U R U2 R'"
    },
    {
        name: "T-OLL Case",
        setupMoves: "F R U R' U' F'", // Creates T-OLL pattern
        expectedPattern: "00111100",
        shouldBeComplete: false,
        correctAlgorithm: "F R U R' U' F'"
    },
    {
        name: "Simple Cross Case",
        setupMoves: "F U R U' R' F'", // Creates cross pattern
        expectedPattern: "01101110",
        shouldBeComplete: false,
        correctAlgorithm: "F R U R' U' F'"
    }
];

/**
 * Candidate algorithms to test for validation
 */
const CANDIDATE_OLL_ALGORITHMS = [
    {
        pattern: "11111111",
        algorithm: "",
        name: "OLL Skip (Already Oriented)",
        source: "Mathematical certainty"
    },
    {
        pattern: "01111010",
        algorithm: "R U2 R' U' R U' R'",
        name: "Sune (OLL 27)",
        source: "Proven in test case 5"
    },
    {
        pattern: "11010100",
        algorithm: "R' U' R U' R' U2 R",
        name: "Anti-Sune (OLL 26)",
        source: "Standard speedcubing algorithm"
    },
    {
        pattern: "00111100",
        algorithm: "F R U R' U' F'",
        name: "T-OLL (OLL 21)",
        source: "Basic T-shape algorithm"
    },
    {
        pattern: "01101110",
        algorithm: "F U R U' R' F'",
        name: "L-Shape OLL",
        source: "Standard L-shape algorithm"
    },
    // Test some potentially problematic algorithms
    {
        pattern: "10011001",
        algorithm: "F R U R' U' F'",
        name: "Test Pattern 1",
        source: "Validation test"
    },
    {
        pattern: "01100110",
        algorithm: "R U R' U R U2 R'",
        name: "Test Pattern 2", 
        source: "Validation test"
    }
];

/**
 * Validate a single algorithm against its intended pattern
 * @param {Object} algorithm - Algorithm to test
 * @param {Object} testCase - Test case with setup moves
 * @returns {Object} Validation result
 */
function validateAlgorithm(algorithm, testCase) {
    try {
        // Create test cube with known pattern
        const testCube = createSolvedCube('3x3x3');
        
        // Apply setup moves to create the target pattern
        if (testCase.setupMoves) {
            const setupMoves = parseMoveNotation3x3(testCase.setupMoves);
            applyMoveSequence3x3(testCube, setupMoves);
        }
        
        // Verify we have the expected pattern
        const actualPattern = getOLLPattern(testCube);
        if (actualPattern !== testCase.expectedPattern) {
            return {
                success: false,
                error: `Setup pattern mismatch. Expected: ${testCase.expectedPattern}, Got: ${actualPattern}`,
                algorithm: algorithm.name,
                testCase: testCase.name
            };
        }
        
        // Apply the algorithm being tested
        const algorithmMoves = parseMoveNotation3x3(algorithm.algorithm);
        const preAlgorithmState = cloneCubeState(testCube);
        applyMoveSequence3x3(testCube, algorithmMoves);
        
        // Check if OLL is now complete
        const postAlgorithmPattern = getOLLPattern(testCube);
        const isComplete = postAlgorithmPattern === "11111111";
        
        return {
            success: true,
            isComplete: isComplete,
            algorithm: algorithm.name,
            testCase: testCase.name,
            prePattern: actualPattern,
            postPattern: postAlgorithmPattern,
            moveCount: algorithmMoves.length,
            shouldBeComplete: testCase.shouldBeComplete !== false // Default to true for OLL Skip
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            algorithm: algorithm.name,
            testCase: testCase.name
        };
    }
}

/**
 * Run comprehensive validation of all algorithms
 */
function runValidation() {
    const results = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        algorithmResults: {},
        detailedResults: []
    };
    
    console.log('\n📋 Testing Algorithm Candidates...\n');
    
    // Test each algorithm against relevant test cases
    for (const algorithm of CANDIDATE_OLL_ALGORITHMS) {
        results.algorithmResults[algorithm.name] = {
            totalTests: 0,
            passed: 0,
            failed: 0,
            results: []
        };
        
        // Find matching test case for this algorithm pattern
        const matchingTestCase = OLL_TEST_CASES.find(tc => 
            tc.expectedPattern === algorithm.pattern || 
            tc.correctAlgorithm === algorithm.algorithm
        );
        
        if (!matchingTestCase) {
            console.log(`⚠️  No test case found for ${algorithm.name} (pattern: ${algorithm.pattern})`);
            continue;
        }
        
        const result = validateAlgorithm(algorithm, matchingTestCase);
        results.totalTests++;
        results.algorithmResults[algorithm.name].totalTests++;
        results.algorithmResults[algorithm.name].results.push(result);
        results.detailedResults.push(result);
        
        if (result.success) {
            if (algorithm.pattern === "11111111" || result.isComplete) {
                results.passedTests++;
                results.algorithmResults[algorithm.name].passed++;
                console.log(`✅ ${algorithm.name}: PASS (${result.moveCount} moves, pattern: ${result.prePattern} → ${result.postPattern})`);
            } else {
                results.failedTests++;
                results.algorithmResults[algorithm.name].failed++;
                console.log(`❌ ${algorithm.name}: FAIL (Algorithm did not solve OLL, pattern: ${result.prePattern} → ${result.postPattern})`);
            }
        } else {
            results.failedTests++;
            results.algorithmResults[algorithm.name].failed++;
            console.log(`❌ ${algorithm.name}: ERROR - ${result.error}`);
        }
    }
    
    return results;
}

/**
 * Generate validation report
 */
function generateReport(results) {
    console.log('\n📊 VALIDATION REPORT\n');
    console.log('═'.repeat(50));
    
    const successRate = (results.passedTests / results.totalTests * 100).toFixed(1);
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`Passed: ${results.passedTests}`);
    console.log(`Failed: ${results.failedTests}`);
    console.log(`Success Rate: ${successRate}%`);
    
    console.log('\n🔍 ALGORITHM ANALYSIS:\n');
    
    const verifiedAlgorithms = [];
    const problematicAlgorithms = [];
    
    for (const [algName, algResult] of Object.entries(results.algorithmResults)) {
        const algSuccessRate = algResult.totalTests > 0 ? 
            (algResult.passed / algResult.totalTests * 100).toFixed(1) : '0';
        
        if (algResult.passed === algResult.totalTests && algResult.totalTests > 0) {
            verifiedAlgorithms.push(algName);
            console.log(`✅ ${algName}: VERIFIED (${algSuccessRate}% success)`);
        } else {
            problematicAlgorithms.push(algName);
            console.log(`❌ ${algName}: PROBLEMATIC (${algSuccessRate}% success)`);
        }
    }
    
    console.log('\n🎯 RECOMMENDATIONS:\n');
    
    if (verifiedAlgorithms.length > 0) {
        console.log('✅ SAFE TO INCLUDE IN DATABASE:');
        verifiedAlgorithms.forEach(alg => console.log(`   • ${alg}`));
    }
    
    if (problematicAlgorithms.length > 0) {
        console.log('\n❌ DO NOT INCLUDE (Need review):');
        problematicAlgorithms.forEach(alg => console.log(`   • ${alg}`));
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Add verified algorithms to ultra-minimal database');
    console.log('2. Review and fix problematic algorithms');
    console.log('3. Create additional test cases for uncovered patterns');
    console.log('4. Run validation after any algorithm changes');
    
    return {
        verifiedAlgorithms,
        problematicAlgorithms,
        successRate: parseFloat(successRate)
    };
}

// Run the validation framework
const results = runValidation();
const report = generateReport(results);

console.log('\n🔬 Automated Algorithm Validation Complete!');
console.log(`📈 Overall Success Rate: ${report.successRate}%`);
console.log(`✅ Verified Algorithms: ${report.verifiedAlgorithms.length}`);
console.log(`❌ Problematic Algorithms: ${report.problematicAlgorithms.length}`);