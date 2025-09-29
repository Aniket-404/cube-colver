/**
 * Debug Piece Location Issues
 * Investigate why findPieceLocation can't find F2L pieces
 */

import { createSolvedCube } from './utils/cubeStructures.js';
import { 
    parseMoveNotation3x3, 
    applyMoveSequence3x3,
    findF2LPairs
} from './services/solver3x3x3.js';

console.log('🔍 Debugging Piece Location Issues...\n');

// Test the Sune case where FR corner is "not found"
const testCube = createSolvedCube('3x3x3');
const sune = parseMoveNotation3x3("R U R' U R U2 R'");
applyMoveSequence3x3(testCube, sune);

console.log('=== Cube State after Sune ===');
console.log('Faces:', JSON.stringify(testCube.faces, null, 2));

console.log('\n=== Center Colors ===');
const centerColors = {
    'F': testCube.faces.F[4], // Green
    'R': testCube.faces.R[4], // Red  
    'B': testCube.faces.B[4], // Blue
    'L': testCube.faces.L[4], // Orange
    'U': testCube.faces.U[4], // White
    'D': testCube.faces.D[4]  // Yellow
};
console.log('Center colors:', centerColors);

// Let's manually check the FR slot target colors
console.log('\n=== FR Slot Target Colors ===');
// FR slot should have corner with colors: D, F, R = Yellow, Green, Red
// FR slot should have edge with colors: F, R = Green, Red
console.log('Target corner colors (D,F,R):', [centerColors.D, centerColors.F, centerColors.R]);
console.log('Target edge colors (F,R):', [centerColors.F, centerColors.R]);

// Now let's check all corner positions to see where this piece actually is
console.log('\n=== All Corner Positions and Colors ===');
const cornerPositions = [
    { name: 'DFR', positions: [{ face: 'D', index: 2 }, { face: 'F', index: 8 }, { face: 'R', index: 6 }] },
    { name: 'DFL', positions: [{ face: 'D', index: 0 }, { face: 'F', index: 6 }, { face: 'L', index: 8 }] },
    { name: 'DBR', positions: [{ face: 'D', index: 8 }, { face: 'B', index: 6 }, { face: 'R', index: 8 }] },
    { name: 'DBL', positions: [{ face: 'D', index: 6 }, { face: 'B', index: 8 }, { face: 'L', index: 6 }] },
    { name: 'UFR', positions: [{ face: 'U', index: 8 }, { face: 'F', index: 2 }, { face: 'R', index: 0 }] },
    { name: 'UFL', positions: [{ face: 'U', index: 6 }, { face: 'F', index: 0 }, { face: 'L', index: 2 }] },
    { name: 'UBR', positions: [{ face: 'U', index: 2 }, { face: 'B', index: 0 }, { face: 'R', index: 2 }] },
    { name: 'UBL', positions: [{ face: 'U', index: 0 }, { face: 'B', index: 2 }, { face: 'L', index: 0 }] }
];

const targetCornerColors = [centerColors.D, centerColors.F, centerColors.R];
console.log('Looking for corner with colors (any order):', targetCornerColors);

cornerPositions.forEach(pos => {
    const colors = pos.positions.map(p => testCube.faces[p.face][p.index]);
    const sortedColors = [...colors].sort();
    const sortedTarget = [...targetCornerColors].sort();
    const matches = sortedColors.every((c, i) => c === sortedTarget[i]);
    
    console.log(`${pos.name}: [${colors.join(', ')}] - sorted: [${sortedColors.join(', ')}] - ${matches ? '✅ MATCH!' : '❌'}`);
});

// Check edges too
console.log('\n=== All Edge Positions and Colors ===');
const edgePositions = [
    { name: 'UF', positions: [{ face: 'U', index: 7 }, { face: 'F', index: 1 }] },
    { name: 'UR', positions: [{ face: 'U', index: 5 }, { face: 'R', index: 1 }] },
    { name: 'UB', positions: [{ face: 'U', index: 1 }, { face: 'B', index: 1 }] },
    { name: 'UL', positions: [{ face: 'U', index: 3 }, { face: 'L', index: 1 }] },
    { name: 'FR', positions: [{ face: 'F', index: 5 }, { face: 'R', index: 3 }] },
    { name: 'FL', positions: [{ face: 'F', index: 3 }, { face: 'L', index: 5 }] },
    { name: 'BR', positions: [{ face: 'B', index: 3 }, { face: 'R', index: 5 }] },
    { name: 'BL', positions: [{ face: 'B', index: 5 }, { face: 'L', index: 3 }] },
    { name: 'DF', positions: [{ face: 'D', index: 1 }, { face: 'F', index: 7 }] },
    { name: 'DR', positions: [{ face: 'D', index: 5 }, { face: 'R', index: 7 }] },
    { name: 'DB', positions: [{ face: 'D', index: 7 }, { face: 'B', index: 7 }] },
    { name: 'DL', positions: [{ face: 'D', index: 3 }, { face: 'L', index: 7 }] }
];

const targetEdgeColors = [centerColors.F, centerColors.R];
console.log('Looking for edge with colors (any order):', targetEdgeColors);

edgePositions.forEach(pos => {
    const colors = pos.positions.map(p => testCube.faces[p.face][p.index]);
    const sortedColors = [...colors].sort();
    const sortedTarget = [...targetEdgeColors].sort();
    const matches = sortedColors.every((c, i) => c === sortedTarget[i]);
    
    console.log(`${pos.name}: [${colors.join(', ')}] - sorted: [${sortedColors.join(', ')}] - ${matches ? '✅ MATCH!' : '❌'}`);
});

// Test our current findF2LPairs function
console.log('\n=== Current findF2LPairs Results ===');
const pairs = findF2LPairs(testCube);
pairs.forEach(pair => {
    console.log(`Slot ${pair.slot}: ${pair.isSolved ? 'Solved' : 'Unsolved'}`);
    console.log(`  Corner: ${pair.corner?.name || 'Not found'} - colors: ${pair.corner?.colors || 'N/A'}`);
    console.log(`  Edge: ${pair.edge?.name || 'Not found'} - colors: ${pair.edge?.colors || 'N/A'}`);
});

console.log('\n🎯 Piece Location Debug Complete!');