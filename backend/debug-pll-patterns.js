// Debug: Check what PLL pattern a simple U-turn creates
import { applyMoveSequence3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

// Function to get PLL pattern - copied from solver3x3x3.js for testing
function getPLLPattern(cubeState) {
    // Simplified pattern: just check where pieces ended up after move
    // U face positions: 0=UL, 2=UR, 8=RF, 6=LF (corners in clockwise order)
    const cornerPositions = [0, 2, 8, 6]; // UL, UR, RF, LF
    const edgePositions = [1, 5, 7, 3]; // UB, UR, UF, UL

    let pattern = '';
    
    // For U-turn, corners should shift: UL->UR->RF->LF->UL
    // So position 0->1, 1->2, 2->3, 3->0
    // Read U face and see the color arrangement
    const uFace = cubeState.faces.U;
    
    // Simple pattern: just use the corner and edge sticker colors directly
    // This gives us an 8-character pattern showing the permutation state
    for (const pos of cornerPositions) {
        pattern += uFace[pos] === 'W' ? '0' : '1';
    }
    for (const pos of edgePositions) {
        pattern += uFace[pos] === 'W' ? '0' : '1';
    }
    
    return pattern;
}

console.log('=== Testing PLL pattern for U-turn ===\n');

// Test various U-layer rotations
const moves = ['U', 'U2', "U'"];

for (const move of moves) {
    console.log(`Pattern after ${move}:`);
    const cube = createSolvedCube('3x3x3');
    applyMoveSequence3x3(cube, move);
    
    const pattern = getPLLPattern(cube);
    console.log(`- Pattern: ${pattern}`);
    console.log(`- Expected solve: ${move === 'U' ? "U'" : move === 'U2' ? 'U2' : 'U'}`);
    console.log();
}