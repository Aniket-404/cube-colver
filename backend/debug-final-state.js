// Debug final cube state after CFOP completion
import { solveCube3x3, isCubeSolved3x3, analyzeCubeState3x3, applyMoveSequence3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('🔍 Debugging Final Cube State After CFOP...\n');

// Test with simple Sune case
console.log('=== Test: Simple Sune Case ===');
let cube = createSolvedCube('3x3x3');
const scramble = "R U R' U R U2 R'";
console.log(`Scramble: ${scramble}`);

// Apply scramble (modifies cube in place)
applyMoveSequence3x3(cube, scramble);
console.log('After scramble - Analysis:', analyzeCubeState3x3(cube));

// Solve with CFOP
const solution = solveCube3x3(cube);
console.log(`\nSolution Success: ${solution.success}`);
console.log(`Total Moves: ${solution.totalMoves}`);

// Check what the final state actually looks like
if (solution.finalState) {
    console.log('\n🔍 Final State Analysis:');
    const finalAnalysis = analyzeCubeState3x3(solution.finalState);
    console.log('Final analysis:', finalAnalysis);
    
    console.log('\n🔍 Individual Face Check:');
    const faces = solution.finalState.faces;
    for (const face of ['U', 'L', 'F', 'R', 'B', 'D']) {
        const centerColor = faces[face][4];
        const allSame = faces[face].every(color => color === centerColor);
        console.log(`${face} face: ${faces[face].join('')} (center: ${centerColor}, solved: ${allSame})`);
    }
    
    console.log(`\n🔍 isCubeSolved3x3 check: ${isCubeSolved3x3(solution.finalState)}`);
} else {
    console.log('❌ No final state available');
}

console.log('\n=== Analysis Complete ===');