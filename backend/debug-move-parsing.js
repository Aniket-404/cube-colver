// Debug: Test move parsing step by step
import { parseMoveNotation3x3, parseSingleMove3x3, applyMove3x3 } from './services/solver3x3x3.js';
import { createSolvedCube } from './utils/cubeStructures.js';

console.log('=== Testing move parsing step by step ===\n');

// Test 1: Parse single move string
console.log('Test 1: Parsing single move "R"');
const singleMove = parseSingleMove3x3("R");
console.log('Result:', singleMove);
console.log();

// Test 2: Parse move sequence string
console.log('Test 2: Parsing move sequence "R U R\'"');
const moveSequence = parseMoveNotation3x3("R U R'");
console.log('Result:', moveSequence);
console.log();

// Test 3: Parse array of moves (this is what's failing)
console.log('Test 3: Parsing array ["R"]');
const arrayMoves = parseMoveNotation3x3(["R"]);
console.log('Result:', arrayMoves);
console.log();

// Test 4: Apply move directly 
console.log('Test 4: Apply move directly');
const cube = createSolvedCube('3x3x3');
console.log('Before R move:');
console.log('U face:', cube.faces.U.slice(0, 3).join(' '));
console.log('F face:', cube.faces.F.slice(0, 3).join(' '));

try {
    applyMove3x3(cube, singleMove);
    console.log('After R move:');
    console.log('U face:', cube.faces.U.slice(0, 3).join(' '));
    console.log('F face:', cube.faces.F.slice(0, 3).join(' '));
} catch (error) {
    console.log('Error applying move:', error.message);
}