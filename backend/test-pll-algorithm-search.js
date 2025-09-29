// Find what algorithm solves pattern 01021000 by systematic testing
import { applyMoveSequence3x3, isCubeSolved3x3, getPLLPattern } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

// Helper function to recreate the 01021000 pattern state
function create01021000Pattern() {
    const cube = createSolvedCube('3x3x3');
    applyMoveSequence3x3(cube, "R U R' F' R U R' U' R' F R2 U' R' U");
    applyMoveSequence3x3(cube, "R U R' F' R U R' U' R' F R2 U' R' R' U R' U' R' U' R' U R U R2 R U R' U' R' F R2 U' R' U' R U R' F' R U R' F' R U R' U' R' F R2 U' R' R' U R' U' R' U' R' U R U R2 R U R' U' R' F R2 U' R' U' R U R' F'");
    return cube;
}

console.log('=== Systematic search for algorithm that solves 01021000 ===\n');

// Test common PLL algorithms
const pllAlgorithms = [
    { name: "T-Perm", alg: "R U R' F' R U R' U' R' F R2 U' R'" },
    { name: "J-Perm (a)", alg: "R' U L' U2 R U' R' U2 R L U'" },
    { name: "J-Perm (b)", alg: "R U R' F' R U R' U' R' F R2 U' R' U'" },
    { name: "Y-Perm", alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
    { name: "A-Perm (a)", alg: "R' F R' B2 R F' R' B2 R2" },
    { name: "A-Perm (b)", alg: "R2 B2 R F R' B2 R F' R" },
    { name: "U-Perm (a)", alg: "R2 U' R' U' R U R U R2" },
    { name: "U-Perm (b)", alg: "R2 U R U R' U' R' U' R2" },
    { name: "H-Perm", alg: "M2 U M2 U2 M2 U M2" },
    { name: "Z-Perm", alg: "M' U M2 U M2 U M' U2 M2" }
];

console.log('Testing each algorithm on pattern 01021000:\n');

for (const pll of pllAlgorithms) {
    const cube = create01021000Pattern();
    
    console.log(`Testing ${pll.name}: ${pll.alg}`);
    console.log('Before:', getPLLPattern(cube));
    
    try {
        applyMoveSequence3x3(cube, pll.alg);
        const afterPattern = getPLLPattern(cube);
        const solved = isCubeSolved3x3(cube);
        
        console.log('After:', afterPattern);
        console.log('Solved:', solved);
        
        if (solved) {
            console.log(`🎉 SUCCESS! ${pll.name} solves pattern 01021000!`);
            console.log(`Algorithm: ${pll.alg}`);
            break;
        }
    } catch (error) {
        console.log('Error:', error.message);
    }
    
    console.log();
}