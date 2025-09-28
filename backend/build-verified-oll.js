/**
 * Systematic OLL Database Builder
 * Build verified OLL cases one by one
 */

import { 
    createSolvedCube
} from './utils/cubeStructures.js';

import {
    applyMoveSequence3x3,
    getOLLPattern,
    isOLLComplete
} from './services/solver3x3x3.js';

console.log('🔍 Systematic OLL Database Builder...\n');

// Store verified working cases
const verifiedOLLCases = [];

function addVerifiedCase(caseId, name, setupMoves, algorithm) {
    console.log(`=== Testing Case ${caseId}: ${name} ===`);
    
    const cube = createSolvedCube('3x3x3');
    
    // Create the case
    console.log(`Setup: ${setupMoves}`);
    applyMoveSequence3x3(cube, setupMoves);
    const pattern = getOLLPattern(cube);
    console.log(`Pattern: ${pattern}`);
    
    // Apply algorithm
    console.log(`Algorithm: ${algorithm}`);
    applyMoveSequence3x3(cube, algorithm);
    const solved = isOLLComplete(cube);
    
    console.log(`Result: ${solved ? '✅ WORKS' : '❌ FAILED'}`);
    
    if (solved) {
        verifiedOLLCases.push({
            id: caseId,
            name,
            pattern,
            algorithm,
            setup: setupMoves
        });
        console.log(`✅ Added to database!`);
    }
    
    console.log();
    return solved;
}

// Start with the known working case
addVerifiedCase(
    2,
    "Sune", 
    "R U2 R' U' R U' R'",
    "R U R' U R U2 R'"
);

// Try some basic cases that should work

// Case: Anti-Sune (reverse of Sune)
addVerifiedCase(
    1,
    "Anti-Sune",
    "R U R' U R U2 R'",  // Sune creates Anti-Sune case
    "R U2 R' U' R U' R'" // Anti-Sune algorithm
);

// Case: Try simple edge flip case - F U R U' R' F' should be involutory
addVerifiedCase(
    "edge1",
    "Simple edge flip", 
    "F U R U' R' F'",
    "F U R U' R' F'"
);

// Case: Simple F2 case  
addVerifiedCase(
    "f2case",
    "F2 case",
    "F2",
    "F2"
);

// Try some two-algorithm combinations to find involutory cases

// Case: R2 based
addVerifiedCase(
    "r2case", 
    "R2 case",
    "R2",
    "R2"
);

// Case: Try PLL H-perm (should be OLL complete after)
addVerifiedCase(
    "hperm",
    "H-Perm case",
    "M2 U M2 U2 M2 U M2",
    "M2 U M2 U2 M2 U M2"
);

// Print summary
console.log('=== VERIFIED OLL DATABASE ===');
console.log(`Found ${verifiedOLLCases.length} working cases:\n`);

verifiedOLLCases.forEach(ollCase => {
    console.log(`Case ${ollCase.id}: ${ollCase.name}`);
    console.log(`  Pattern: ${ollCase.pattern}`);
    console.log(`  Algorithm: ${ollCase.algorithm}`);
    console.log(`  Setup: ${ollCase.setup}`);
    console.log();
});

// Generate code for the database
console.log('=== GENERATED OLL_CASES CODE ===');
console.log('const VERIFIED_OLL_CASES = [');
verifiedOLLCases.forEach(ollCase => {
    console.log(`  {`);
    console.log(`    id: ${ollCase.id},`);
    console.log(`    name: "${ollCase.name}",`);
    console.log(`    pattern: "${ollCase.pattern}",`);
    console.log(`    algorithm: "${ollCase.algorithm}",`);
    console.log(`    setup: "${ollCase.setup}"`);
    console.log(`  },`);
});
console.log('];');

console.log('🎯 Systematic OLL Database Building Complete!');