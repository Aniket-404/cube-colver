import { solveCube } from './services/solver3x3x3.js';

/**
 * Debug script to identify all failing OLL and PLL patterns
 */
function debugFailingPatterns() {
    console.log("=== Analyzing Failing Patterns in CFOP Solver ===\n");

    // Test cases that currently fail
    const testCases = [
        { name: "R U", scramble: "R U" },
        { name: "R U R'", scramble: "R U R'" },
        { name: "F R U R' U' F'", scramble: "F R U R' U' F'" },
        { name: "R2 U2 R2 U2 R2 U2", scramble: "R2 U2 R2 U2 R2 U2" },
        { name: "R U2 R' D R U2 R' D'", scramble: "R U2 R' D R U2 R' D'" }
    ];

    const failingPatterns = {
        oll: new Set(),
        pll: new Set()
    };

    testCases.forEach(testCase => {
        console.log(`\n=== Testing ${testCase.name} ===`);
        try {
            const result = solveCube(testCase.scramble);
            
            if (!result.solved) {
                console.log(`❌ Failed case: ${testCase.name}`);
                
                // Extract patterns from the solution logs
                const ollPatterns = extractPatterns(result.logs, "OLL pattern");
                const pllPatterns = extractPatterns(result.logs, "PLL pattern");
                
                ollPatterns.forEach(pattern => {
                    if (pattern !== "11111111") { // Skip solved OLL
                        failingPatterns.oll.add(pattern);
                        console.log(`   OLL Pattern: ${pattern}`);
                    }
                });
                
                pllPatterns.forEach(pattern => {
                    if (pattern !== "00000000") { // Skip solved PLL
                        failingPatterns.pll.add(pattern);
                        console.log(`   PLL Pattern: ${pattern}`);
                    }
                });
            }
        } catch (error) {
            console.error(`Error testing ${testCase.name}:`, error.message);
        }
    });

    console.log(`\n=== SUMMARY: Missing Patterns ===`);
    console.log(`\nMissing OLL Patterns (${failingPatterns.oll.size}):`);
    Array.from(failingPatterns.oll).sort().forEach(pattern => {
        console.log(`  "${pattern}": "R U R' U R U2 R'", // New OLL pattern`);
    });
    
    console.log(`\nMissing PLL Patterns (${failingPatterns.pll.size}):`);
    Array.from(failingPatterns.pll).sort().forEach(pattern => {
        console.log(`  { pattern: "${pattern}", algorithm: "R U R' U R U2 R'", name: "New PLL pattern" },`);
    });
    
    console.log(`\nTotal missing: ${failingPatterns.oll.size + failingPatterns.pll.size} patterns`);
}

/**
 * Extract patterns from solution logs
 */
function extractPatterns(logs, patternType) {
    const patterns = [];
    const regex = new RegExp(`${patternType}: (\\w+)`, 'g');
    
    logs.forEach(log => {
        let match;
        while ((match = regex.exec(log)) !== null) {
            patterns.push(match[1]);
        }
    });
    
    return patterns;
}

debugFailingPatterns();