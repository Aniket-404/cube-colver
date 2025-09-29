import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { solveCube3x3, applyMoveSequence3x3, parseMoveNotation3x3, isCubeSolved3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

/**
 * Analyze specific failure cases to understand why they're failing
 */
async function analyzeFailures() {
    console.log('=== Detailed Failure Analysis ===\n');
    
    // Test cases that we know are failing from the success rate test
    const failingScrambles = [
        'R U',           // Test 3: Failed
        'R U R\'',       // Test 4: Failed  
        'F R U R\' U\' F\'',  // Test 6: Failed
        'R2 U2 R2 U2 R2 U2', // Test 9: Failed
        'R U2 R\' D R U2 R\' D\''  // Test 10: Failed
    ];
    
    // Track unknown OLL patterns encountered across analyses
    const unknownOLLPatterns = new Map(); // pattern -> count

    for (let i = 0; i < failingScrambles.length; i++) {
        const scramble = failingScrambles[i];
        console.log(`=== Analyzing Failure ${i + 1}: ${scramble} ===`);
        
        try {
            // Create scrambled cube
            const testCube = createSolvedCube('3x3x3');
            
            // Apply scramble
            if (scramble) {
                applyMoveSequence3x3(testCube, scramble);
            }
            console.log(`🔄 Applied scramble: ${scramble}`);
            
            // Attempt to solve
            console.log('🎯 Starting detailed solve analysis...');
            const result = solveCube3x3(testCube);
            
            console.log(`📊 Result: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
            console.log(`📈 Moves: ${result.totalMoves || 0}, Time: ${result.executionTime || 0}ms`);
            
            if (!result.success) {
                console.log(`🔍 Failure reason: ${result.error || 'Unknown'}`);
                
                // Check final state
                if (result.finalState) {
                    const finalSolved = isCubeSolved3x3(result.finalState);
                    console.log(`🎲 Final state solved: ${finalSolved ? '✅ YES' : '❌ NO'}`);
                    
                    if (!finalSolved) {
                        // Analyze what went wrong
                        console.log('🔬 Analyzing final state discrepancies...');
                        
                        try {
                            // Check each face using cubeState.faces reference
                            const facesOrder = ['U', 'L', 'F', 'R', 'B', 'D'];
                            const expectedColors = { U: 'W', L: 'O', F: 'G', R: 'R', B: 'B', D: 'Y' };
                            const facesObj = result.finalState.faces || result.finalState; // fallback if shape differs

                            facesOrder.forEach(faceKey => {
                                const faceColors = facesObj[faceKey];
                                if (!Array.isArray(faceColors)) return;
                                const target = expectedColors[faceKey];
                                const wrong = faceColors.filter(c => c !== target).length;
                                if (wrong > 0) {
                                    console.log(`   ${faceKey} face: ${wrong}/${faceColors.length} stickers off`);
                                    console.log(`   Actual : [${faceColors.join(', ')}]`);
                                    console.log(`   Expect : [${Array(faceColors.length).fill(target).join(', ')}]`);
                                }
                            });
                        } catch (e) {
                            console.log(`   ⚠️ Face analysis error: ${e.message}`);
                        }
                    }
                }
            }
            
            console.log(''); // Empty line for separation
            
        } catch (error) {
            console.log(`❌ Error during analysis: ${error.message}`);
        }
    }

    // Summarize unknown OLL patterns captured from solver console warnings (if any were globally tracked)
    // NOTE: To fully automate capture, future enhancement: hook into console.warn to intercept 'Unknown OLL pattern:' lines.
    if (unknownOLLPatterns.size > 0) {
        console.log('=== Summary: Unknown OLL Patterns Encountered ===');
        for (const [pattern, count] of unknownOLLPatterns.entries()) {
            console.log(` Pattern ${pattern}: ${count} occurrences`);
        }
        console.log('\nAdd these patterns to OLL_CASES with verified algorithms to improve success rate.');
    }
}

// Run the analysis
analyzeFailures().catch(console.error);