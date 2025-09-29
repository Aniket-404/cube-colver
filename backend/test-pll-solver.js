// Test PLL solver in isolation to identify pattern issues
import { solvePLL, applyMoveSequence3x3, isCubeSolved3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Testing PLL solver in isolation ===\n');

// Create a cube with only PLL case (OLL already solved)
function createPLLCase() {
    const cube = createSolvedCube('3x3x3');
    // Create a real PLL case by swapping only top layer pieces (preserving OLL)
    // This T-Perm setup creates a known PLL case with corners/edges swapped
    applyMoveSequence3x3(cube, "R U R' F' R U R' U' R' F R2 U' R' U");
    return cube;
}

async function testPLL() {
    const cube = createPLLCase();
    
    console.log('Initial cube state (PLL case):');
    console.log('U face:', cube.faces.U.join(' '));
    console.log('L face:', cube.faces.L.join(' '));
    console.log('F face:', cube.faces.F.join(' '));
    console.log('R face:', cube.faces.R.join(' '));
    console.log('B face:', cube.faces.B.join(' '));
    console.log('D face:', cube.faces.D.join(' '));
    console.log();
    
    console.log('Testing PLL solver...');
    const result = await solvePLL(cube);
    
    console.log('PLL result:');
    console.log('- Total moves:', result.totalMoves);
    console.log('- Applied algorithms:', result.appliedAlgorithms.length);
    console.log('- Success:', result.success);
    console.log('- PLL Complete:', result.isPLLComplete);
    console.log('- Final pattern:', result.finalPattern);
    
    if (result.appliedAlgorithms.length > 0) {
        console.log('\nApplied algorithms:');
        result.appliedAlgorithms.forEach((alg, i) => {
            console.log(`  ${i + 1}. ${alg.name}: ${alg.algorithm} (${alg.moves} moves)`);
        });
    }
    
    if (result.success) {
        console.log('\n✅ PLL solver reported success!');
    } else {
        console.log('\n❌ PLL solver failed');
    }
    
    // Check if cube is actually solved after the solver ran
    const actualSolved = isCubeSolved3x3(result.finalState);
    console.log('Cube actually solved after PLL solver:', actualSolved);
}

testPLL();