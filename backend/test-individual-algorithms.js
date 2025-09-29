import { getCubeState, applyAlgorithm, getOLLPattern, getPLLPattern } from './services/solver3x3x3.js';

/**
 * Test individual algorithms to verify they work correctly
 */
function testAlgorithms() {
    console.log("=== Testing Individual Algorithms ===\n");

    // Test basic OLL algorithms
    const basicOLLTests = [
        {
            name: "Sune (R U R' U R U2 R')",
            algorithm: "R U R' U R U2 R'",
            setupMoves: "R U R' U R U2 R'", // Creates Sune case
            expectedSolution: true
        },
        {
            name: "Anti-Sune (R' U' R U' R' U2 R)",
            algorithm: "R' U' R U' R' U2 R",
            setupMoves: "F R U R' U' F'", // Creates Anti-Sune case
            expectedSolution: false // Might not work perfectly
        }
    ];

    // Test basic PLL algorithms
    const basicPLLTests = [
        {
            name: "T-perm (R U R' F' R U R' U' R' F R2 U' R')",
            algorithm: "R U R' F' R U R' U' R' F R2 U' R'",
            setupMoves: "R U R' F' R U R' U' R' F R2 U' R'", // Creates T-perm case
            expectedSolution: true
        },
        {
            name: "U-turn (U')",
            algorithm: "U'",
            setupMoves: "U", // Creates simple U case
            expectedSolution: true
        }
    ];

    console.log("=== OLL Algorithm Tests ===");
    basicOLLTests.forEach(test => {
        console.log(`\nTesting: ${test.name}`);
        testSingleAlgorithm(test, 'OLL');
    });

    console.log("\n=== PLL Algorithm Tests ===");
    basicPLLTests.forEach(test => {
        console.log(`\nTesting: ${test.name}`);
        testSingleAlgorithm(test, 'PLL');
    });
}

function testSingleAlgorithm(test, phase) {
    try {
        // Start with solved cube
        let cubeState = getCubeState(""); 
        
        // Apply setup moves to create the case
        console.log(`  Setup: ${test.setupMoves}`);
        cubeState = applyAlgorithm(cubeState, test.setupMoves);
        
        // Check the pattern created
        if (phase === 'OLL') {
            const pattern = getOLLPattern(cubeState);
            console.log(`  OLL Pattern created: ${pattern}`);
        } else {
            const pattern = getPLLPattern(cubeState);
            console.log(`  PLL Pattern created: ${pattern}`);
        }
        
        // Apply the algorithm
        console.log(`  Algorithm: ${test.algorithm}`);
        cubeState = applyAlgorithm(cubeState, test.algorithm);
        
        // Check if it solved the case
        if (phase === 'OLL') {
            const finalPattern = getOLLPattern(cubeState);
            console.log(`  Final OLL Pattern: ${finalPattern}`);
            const solved = finalPattern === "11111111";
            console.log(`  ✅ OLL Solved: ${solved ? "YES" : "NO"}`);
        } else {
            const finalPattern = getPLLPattern(cubeState);
            console.log(`  Final PLL Pattern: ${finalPattern}`);
            const solved = finalPattern === "00000000";
            console.log(`  ✅ PLL Solved: ${solved ? "YES" : "NO"}`);
        }
        
    } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
    }
}

testAlgorithms();