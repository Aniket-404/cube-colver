/**
 * 2x2x2 Cube Solver - Ortega Method Implementation
 * 
 * This module implements the Ortega method for solving 2x2x2 cubes:
 * Phase 1: Orient Last Layer (OLL) - Get all pieces of one color facing up
 * Phase 2: Permute Both Layers (PBL) - Position all pieces correctly
 * 
 * Also includes CLL (Corners of Last Layer) method as fallback for advanced cases
 */

import { 
    cloneCubeState, 
    getCubeConfig, 
    FACE_NAMES,
    createSolvedCube 
} from '../utils/cubeStructures.js';

// ========================= MOVE NOTATION PARSER =========================

/**
 * @typedef {Object} ParsedMove
 * @property {string} face - Face to rotate (R, L, U, D, F, B)
 * @property {number} turns - Number of 90° clockwise turns (1, 2, -1 for prime)
 * @property {string} notation - Original notation string
 */

/**
 * Parse a move string into an array of move objects
 * Supports standard 2x2x2 notation: R, L, U, D, F, B with optional ' (prime) and 2 (double)
 * @param {string} moveString - Move sequence string (e.g., "R U R' U2")
 * @returns {ParsedMove[]} Array of parsed move objects
 */
export function parseMoveNotation(moveString) {
    if (!moveString || typeof moveString !== 'string') {
        return [];
    }

    // Split by whitespace and filter out empty strings
    const moves = moveString.trim().split(/\s+/).filter(move => move.length > 0);
    const parsedMoves = [];

    for (const move of moves) {
        const parsed = parseSingleMove(move);
        if (parsed) {
            parsedMoves.push(parsed);
        }
    }

    return parsedMoves;
}

/**
 * Parse a single move notation
 * @param {string} move - Single move notation (e.g., "R", "U'", "F2")
 * @returns {ParsedMove|null} Parsed move object or null if invalid
 */
export function parseSingleMove(move) {
    // Validate move format with regex
    const moveRegex = /^([RLUFDB])([']|[2])?$/;
    const match = move.match(moveRegex);
    
    if (!match) {
        console.warn(`Invalid move notation: ${move}`);
        return null;
    }

    const [, face, modifier] = match;
    let turns = 1;

    if (modifier === "'") {
        turns = -1; // Counter-clockwise
    } else if (modifier === "2") {
        turns = 2; // 180-degree turn
    }

    return {
        face,
        turns,
        notation: move
    };
}

/**
 * Validate an array of parsed moves
 * @param {ParsedMove[]} moves - Array of parsed moves
 * @returns {boolean} True if all moves are valid
 */
export function validateMoves(moves) {
    const validFaces = new Set(['R', 'L', 'U', 'D', 'F', 'B']);
    const validTurns = new Set([1, -1, 2]);

    return moves.every(move => 
        validFaces.has(move.face) && 
        validTurns.has(move.turns) &&
        typeof move.notation === 'string'
    );
}

/**
 * Convert parsed moves back to notation string
 * @param {ParsedMove[]} moves - Array of parsed moves
 * @returns {string} Move notation string
 */
export function movesToNotation(moves) {
    return moves.map(move => {
        let notation = move.face;
        if (move.turns === -1) notation += "'";
        else if (move.turns === 2) notation += "2";
        return notation;
    }).join(' ');
}

// ========================= CUBE STATE MANIPULATION =========================

/**
 * 2x2x2 cube face rotation and sticker cycling definitions
 * Each move rotates a face and cycles adjacent stickers
 */

// Face rotation mappings for 2x2x2 (4 stickers per face, clockwise)
const FACE_ROTATIONS = {
    // Clockwise rotation: [0,1,2,3] -> [2,0,3,1]
    clockwise: [2, 0, 3, 1],
    // Counter-clockwise rotation: [0,1,2,3] -> [1,3,0,2]  
    counterclockwise: [1, 3, 0, 2]
};

/**
 * Adjacent sticker cycling for each face move on 2x2x2
 * Format: { face: [[face1, indices], [face2, indices], [face3, indices], [face4, indices]] }
 * Indices represent the stickers that get cycled between adjacent faces
 */
const ADJACENT_CYCLES = {
    R: [
        ['U', [1, 3]], // Right side of U face
        ['F', [1, 3]], // Right side of F face  
        ['D', [1, 3]], // Right side of D face
        ['B', [0, 2]]  // Left side of B face (opposite orientation)
    ],
    L: [
        ['U', [0, 2]], // Left side of U face
        ['B', [1, 3]], // Right side of B face (opposite orientation)
        ['D', [0, 2]], // Left side of D face
        ['F', [0, 2]]  // Left side of F face
    ],
    U: [
        ['B', [0, 1]], // Top edge of B face
        ['R', [0, 1]], // Top edge of R face
        ['F', [0, 1]], // Top edge of F face
        ['L', [0, 1]]  // Top edge of L face
    ],
    D: [
        ['F', [2, 3]], // Bottom edge of F face
        ['R', [2, 3]], // Bottom edge of R face
        ['B', [2, 3]], // Bottom edge of B face
        ['L', [2, 3]]  // Bottom edge of L face
    ],
    F: [
        ['U', [2, 3]], // Bottom edge of U face
        ['R', [0, 2]], // Left side of R face
        ['D', [0, 1]], // Top edge of D face
        ['L', [1, 3]]  // Right side of L face
    ],
    B: [
        ['U', [0, 1]], // Top edge of U face
        ['L', [0, 2]], // Left side of L face
        ['D', [2, 3]], // Bottom edge of D face
        ['R', [1, 3]]  // Right side of R face
    ]
};

/**
 * Apply a single face rotation to a cube state
 * @param {Object} cubeState - Current cube state
 * @param {string} face - Face to rotate (R, L, U, D, F, B)
 * @param {number} turns - Number of 90° clockwise turns
 * @returns {Object} New cube state with rotation applied
 */
export function rotateFace(cubeState, face, turns) {
    // Validate input
    if (!FACE_NAMES.includes(face)) {
        throw new Error(`Invalid face: ${face}`);
    }

    const newState = cloneCubeState(cubeState);
    const normalizedTurns = ((turns % 4) + 4) % 4; // Normalize to 0-3 range

    if (normalizedTurns === 0) {
        return newState; // No rotation needed
    }

    // Apply face rotation (internal stickers)
    const faceStickers = newState.faces[face];
    const originalStickers = [...faceStickers];

    for (let i = 0; i < normalizedTurns; i++) {
        const rotationMap = FACE_ROTATIONS.clockwise;
        for (let j = 0; j < 4; j++) {
            faceStickers[j] = originalStickers[rotationMap[j]];
        }
        // Update original for next iteration
        Object.assign(originalStickers, faceStickers);
    }

    // Apply adjacent sticker cycling
    const cycle = ADJACENT_CYCLES[face];
    if (cycle) {
        applyAdjacentCycle(newState, cycle, normalizedTurns);
    }

    return newState;
}

/**
 * Apply adjacent sticker cycling for face rotations
 * @param {Object} cubeState - Cube state to modify (mutated)
 * @param {Array} cycle - Cycle definition for the face
 * @param {number} turns - Number of clockwise turns
 */
function applyAdjacentCycle(cubeState, cycle, turns) {
    // Store original values for all positions in the cycle
    const originalValues = cycle.map(([face, indices]) => 
        indices.map(index => cubeState.faces[face][index])
    );

    // Apply the cycle 'turns' number of times
    for (let turn = 0; turn < turns; turn++) {
        for (let i = 0; i < cycle.length; i++) {
            const [currentFace, currentIndices] = cycle[i];
            const [sourceFace, sourceIndices] = cycle[(i + cycle.length - 1) % cycle.length];
            
            // Get source values (from previous turn or original)
            const sourceValues = turn === 0 
                ? originalValues[(i + cycle.length - 1) % cycle.length]
                : sourceIndices.map(index => cubeState.faces[sourceFace][index]);

            // Set current values
            currentIndices.forEach((index, j) => {
                cubeState.faces[currentFace][index] = sourceValues[j];
            });
        }
    }
}

/**
 * Apply a single move to a cube state
 * @param {Object} cubeState - Current cube state
 * @param {ParsedMove} move - Move to apply
 * @returns {Object} New cube state with move applied
 */
export function applyMove(cubeState, move) {
    if (!move || !move.face) {
        throw new Error('Invalid move object');
    }

    return rotateFace(cubeState, move.face, move.turns);
}

/**
 * Apply a sequence of moves to a cube state
 * @param {Object} cubeState - Initial cube state
 * @param {ParsedMove[]|string} moves - Array of parsed moves or move notation string
 * @returns {Object} Cube state after applying all moves
 */
export function applyMoveSequence(cubeState, moves) {
    // Parse moves if string is provided
    const parsedMoves = typeof moves === 'string' ? parseMoveNotation(moves) : moves;
    
    if (!validateMoves(parsedMoves)) {
        throw new Error('Invalid moves in sequence');
    }

    let currentState = cubeState;
    
    for (const move of parsedMoves) {
        currentState = applyMove(currentState, move);
    }

    return currentState;
}

/**
 * Get the inverse of a move (opposite direction)
 * @param {ParsedMove} move - Original move
 * @returns {ParsedMove} Inverse move
 */
export function getInverseMove(move) {
    let inverseTurns;
    
    switch (move.turns) {
        case 1: inverseTurns = -1; break;
        case -1: inverseTurns = 1; break; 
        case 2: inverseTurns = 2; break; // 180° is its own inverse
        default: throw new Error(`Invalid turns value: ${move.turns}`);
    }

    return {
        face: move.face,
        turns: inverseTurns,
        notation: move.face + (inverseTurns === -1 ? "'" : inverseTurns === 2 ? "2" : "")
    };
}

/**
 * Get the inverse of a move sequence
 * @param {ParsedMove[]|string} moves - Move sequence to invert
 * @returns {ParsedMove[]} Inverted move sequence (reversed order with inverse moves)
 */
export function getInverseMoveSequence(moves) {
    const parsedMoves = typeof moves === 'string' ? parseMoveNotation(moves) : moves;
    
    return parsedMoves
        .map(move => getInverseMove(move))
        .reverse();
}

/**
 * Test if a cube state is solved for 2x2x2
 * @param {Object} cubeState - Cube state to check
 * @returns {boolean} True if the cube is solved
 */
export function isCubeSolved(cubeState) {
    if (cubeState.cubeType !== '2x2x2') {
        throw new Error(`This function only supports 2x2x2 cubes, got ${cubeState.cubeType}`);
    }

    // Check if each face has all the same color
    for (const face of FACE_NAMES) {
        const faceStickers = cubeState.faces[face];
        const firstColor = faceStickers[0];
        
        if (!faceStickers.every(color => color === firstColor)) {
            return false;
        }
    }

    return true;
}

/**
 * Create a scrambled 2x2x2 cube for testing
 * @param {number} scrambleLength - Number of random moves (default: 10)
 * @returns {Object} Scrambled cube state
 */
export function createScrambledCube(scrambleLength = 10) {
    const solvedCube = createSolvedCube('2x2x2');
    const faces = ['R', 'L', 'U', 'D', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    
    let scrambledCube = solvedCube;
    const scrambleMoves = [];

    for (let i = 0; i < scrambleLength; i++) {
        const face = faces[Math.floor(Math.random() * faces.length)];
        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        const moveNotation = face + modifier;
        
        scrambleMoves.push(moveNotation);
        scrambledCube = applyMoveSequence(scrambledCube, moveNotation);
    }

    return {
        cubeState: scrambledCube,
        scrambleMoves: scrambleMoves.join(' ')
    };
}

// ========================= UTILITY FUNCTIONS =========================

/**
 * Count the number of moves in a solution
 * @param {ParsedMove[]|string} moves - Move sequence
 * @returns {number} Total number of moves
 */
export function countMoves(moves) {
    const parsedMoves = typeof moves === 'string' ? parseMoveNotation(moves) : moves;
    return parsedMoves.length;
}

/**
 * Optimize a move sequence by removing redundant moves
 * @param {ParsedMove[]|string} moves - Move sequence to optimize
 * @returns {ParsedMove[]} Optimized move sequence
 */
export function optimizeMoveSequence(moves) {
    const parsedMoves = typeof moves === 'string' ? parseMoveNotation(moves) : moves;
    const optimized = [];
    
    for (const move of parsedMoves) {
        const lastMove = optimized[optimized.length - 1];
        
        if (lastMove && lastMove.face === move.face) {
            // Combine consecutive moves on the same face
            const totalTurns = ((lastMove.turns + move.turns) % 4 + 4) % 4;
            
            if (totalTurns === 0) {
                // Moves cancel out
                optimized.pop();
            } else {
                // Update last move with combined turns
                lastMove.turns = totalTurns > 2 ? totalTurns - 4 : totalTurns;
                lastMove.notation = lastMove.face + 
                    (lastMove.turns === -1 ? "'" : lastMove.turns === 2 ? "2" : "");
            }
        } else {
            // Add new move
            optimized.push({ ...move });
        }
    }
    
    return optimized;
}

// ========================= ORTEGA METHOD - OLL PHASE =========================

/**
 * OLL (Orient Last Layer) algorithm lookup table
 * Contains all 8 possible OLL cases for 2x2x2 cubes in Ortega method
 */
const OLL_ALGORITHMS = {
    solved: '',  // Already oriented - no moves needed
    sune: "R U R' U R U2 R'",
    antisune: "L' U' L U' L' U2 L",
    t: "R U R' U' R' F R F'",
    l: "F R U R' U' R U R' U' F'",
    pi: "F R U R' U' F'",
    h: "R2 U2 R' U2 R2",
    u: "R U2 R2 U' R2 U' R2 U2 R"
};

/**
 * Recognize the OLL case from cube state
 * @param {Object} cubeState - Current cube state (assumes D face needs to be oriented)
 * @returns {string} OLL case identifier
 */
export function recognizeOLLCase(cubeState) {
    // For Ortega method, we orient the bottom (D) face
    // Count oriented stickers (should be yellow 'Y' facing down)
    const dFace = cubeState.faces.D;
    const targetColor = 'Y'; // Yellow is the standard bottom color
    
    // Find which stickers are correctly oriented (yellow facing down)
    const orientedPositions = [];
    for (let i = 0; i < 4; i++) {
        if (dFace[i] === targetColor) {
            orientedPositions.push(i);
        }
    }
    
    const orientedCount = orientedPositions.length;
    
    // Determine OLL case based on oriented sticker count and positions
    switch (orientedCount) {
        case 4:
            return 'solved'; // All oriented
            
        case 0:
            return 'h'; // No oriented stickers (H case)
            
        case 1:
            // One oriented sticker - Sune or Anti-Sune
            return determineSuneCase(cubeState, orientedPositions[0]);
            
        case 2:
            // Two oriented stickers - T, L, Pi, or U case
            return determineTwoOrientedCase(orientedPositions);
            
        default:
            throw new Error(`Invalid OLL state: ${orientedCount} oriented stickers`);
    }
}

/**
 * Determine if one-oriented case is Sune or Anti-Sune
 * @param {Object} cubeState - Current cube state
 * @param {number} orientedPosition - Position of the single oriented sticker
 * @returns {string} 'sune' or 'antisune'
 */
function determineSuneCase(cubeState, orientedPosition) {
    // Check adjacent faces to determine orientation pattern
    // This is a simplified heuristic - in practice, you might need more sophisticated pattern matching
    
    // For now, alternate based on position to distinguish cases
    // Position 0 or 2 (diagonal) -> sune, Position 1 or 3 -> antisune
    return (orientedPosition % 2 === 0) ? 'sune' : 'antisune';
}

/**
 * Determine OLL case when two stickers are oriented
 * @param {number[]} orientedPositions - Positions of oriented stickers [0,1,2,3]
 * @returns {string} OLL case identifier
 */
function determineTwoOrientedCase(orientedPositions) {
    const [pos1, pos2] = orientedPositions.sort((a, b) => a - b);
    
    // Adjacent positions (side by side)
    if (Math.abs(pos2 - pos1) === 1 || (pos1 === 0 && pos2 === 3)) {
        // Adjacent stickers - could be T or U case
        // Use position pattern to distinguish
        if ((pos1 === 0 && pos2 === 1) || (pos1 === 2 && pos2 === 3)) {
            return 't'; // Top or bottom edge
        } else {
            return 'u'; // Left or right edge
        }
    } 
    // Diagonal positions (opposite corners)
    else if (Math.abs(pos2 - pos1) === 2) {
        return 'pi'; // Diagonal - Pi case
    }
    // This should cover all 2-sticker cases, but fallback
    else {
        return 'l'; // Default to L case for other patterns
    }
}

/**
 * Apply OLL algorithm to orient the last layer
 * @param {Object} cubeState - Current cube state
 * @returns {Object} Result object with new state and moves applied
 */
export function applyOLL(cubeState) {
    const ollCase = recognizeOLLCase(cubeState);
    
    if (ollCase === 'solved') {
        return {
            cubeState: cloneCubeState(cubeState),
            algorithm: '',
            moves: [],
            case: ollCase
        };
    }
    
    const algorithm = OLL_ALGORITHMS[ollCase];
    if (!algorithm) {
        throw new Error(`Unknown OLL case: ${ollCase}`);
    }
    
    const moves = parseMoveNotation(algorithm);
    const newState = applyMoveSequence(cubeState, moves);
    
    return {
        cubeState: newState,
        algorithm,
        moves,
        case: ollCase
    };
}

/**
 * Check if the last layer is oriented (all target color facing down)
 * @param {Object} cubeState - Cube state to check
 * @returns {boolean} True if D face is completely oriented
 */
export function isLastLayerOriented(cubeState) {
    const dFace = cubeState.faces.D;
    const targetColor = 'Y'; // Yellow
    
    return dFace.every(sticker => sticker === targetColor);
}

/**
 * Get all available OLL algorithms
 * @returns {Object} Copy of OLL algorithms lookup table
 */
export function getOLLAlgorithms() {
    return { ...OLL_ALGORITHMS };
}

/**
 * Test OLL recognition and execution with a specific case
 * @param {string} ollCase - OLL case to test
 * @returns {Object} Test result with scramble and solution
 */
export function testOLLCase(ollCase) {
    if (!OLL_ALGORITHMS.hasOwnProperty(ollCase)) {
        throw new Error(`Invalid OLL case: ${ollCase}`);
    }
    
    // Create a solved cube and apply the inverse of the OLL algorithm
    const solvedCube = createSolvedCube('2x2x2');
    const algorithm = OLL_ALGORITHMS[ollCase];
    
    if (!algorithm) {
        return {
            case: ollCase,
            scramble: '',
            solution: '',
            testState: solvedCube
        };
    }
    
    // Apply inverse to create test scramble
    const inverseMoves = getInverseMoveSequence(algorithm);
    const scrambledState = applyMoveSequence(solvedCube, inverseMoves);
    
    // Test recognition
    const recognizedCase = recognizeOLLCase(scrambledState);
    
    // Test solution
    const ollResult = applyOLL(scrambledState);
    
    return {
        case: ollCase,
        recognizedCase,
        scramble: movesToNotation(inverseMoves),
        solution: algorithm,
        testState: scrambledState,
        solvedState: ollResult.cubeState,
        isCorrect: recognizedCase === ollCase && isLastLayerOriented(ollResult.cubeState)
    };
}

// ========================= ORTEGA METHOD - PBL PHASE =========================

/**
 * PBL (Permute Both Layers) algorithm lookup table
 * Contains all 5 possible PBL cases for 2x2x2 cubes in Ortega method
 */
const PBL_ALGORITHMS = {
    solved: '',  // Already solved - no moves needed
    double_diagonal: "R2 F2 R2",
    double_adjacent: "R2 U' B2 U2 R2 U' R2", 
    opposite_swap: "R U' R' U' F2 U' R U R' D R2",
    opposite_adjacent: "R U2 R' U' R U2 L' U R' U' L"
};

/**
 * Detect if a face has a "bar" (two adjacent stickers of the same color)
 * @param {string[]} face - Array of 4 face stickers
 * @returns {Object} Bar detection result with position info
 */
function detectBar(face) {
    // Check all adjacent pairs in 2x2 face (positions 0-1, 1-3, 3-2, 2-0)
    const adjacentPairs = [
        [0, 1], // Top edge
        [1, 3], // Right edge  
        [3, 2], // Bottom edge
        [2, 0]  // Left edge
    ];
    
    for (let i = 0; i < adjacentPairs.length; i++) {
        const [pos1, pos2] = adjacentPairs[i];
        if (face[pos1] === face[pos2] && face[pos1] !== '') {
            return {
                hasBar: true,
                position: i, // 0=top, 1=right, 2=bottom, 3=left
                color: face[pos1],
                stickers: [pos1, pos2]
            };
        }
    }
    
    return { hasBar: false };
}

/**
 * Recognize the PBL case from cube state after OLL completion
 * @param {Object} cubeState - Current cube state (OLL should be complete)
 * @returns {string} PBL case identifier
 */
export function recognizePBLCase(cubeState) {
    // First check if already solved
    if (isCubeSolved(cubeState)) {
        return 'solved';
    }
    
    // Analyze U and D faces for bars
    const uBar = detectBar(cubeState.faces.U);
    const dBar = detectBar(cubeState.faces.D);
    
    // Determine case based on bar presence
    if (uBar.hasBar && dBar.hasBar) {
        return 'double_adjacent';
    } else if (!uBar.hasBar && !dBar.hasBar) {
        return 'double_diagonal';
    } else if (uBar.hasBar && !dBar.hasBar) {
        return 'opposite_swap';
    } else if (!uBar.hasBar && dBar.hasBar) {
        return 'opposite_adjacent';
    }
    
    // Fallback - should not reach here with valid cube state
    throw new Error('Unable to determine PBL case');
}

/**
 * Check if two faces need adjacent or diagonal corner swaps
 * @param {string[]} face - Face stickers array
 * @returns {string} 'none', 'adjacent', or 'diagonal'
 */
function analyzeCornerSwapType(face) {
    // Create array of unique positions for each color
    const colorPositions = {};
    
    for (let i = 0; i < 4; i++) {
        const color = face[i];
        if (!colorPositions[color]) {
            colorPositions[color] = [];
        }
        colorPositions[color].push(i);
    }
    
    // Check swap patterns
    const colors = Object.keys(colorPositions);
    
    if (colors.length === 1) {
        return 'none'; // Already solved
    }
    
    if (colors.length === 2) {
        // Two colors - check if adjacent or diagonal
        const color1Positions = colorPositions[colors[0]];
        const color2Positions = colorPositions[colors[1]];
        
        if (color1Positions.length === 2 && color2Positions.length === 2) {
            // Check if positions are adjacent or diagonal
            const [pos1, pos2] = color1Positions;
            const isDiagonal = Math.abs(pos1 - pos2) === 2;
            return isDiagonal ? 'diagonal' : 'adjacent';
        }
    }
    
    return 'diagonal'; // Default case for complex patterns
}

/**
 * Apply PBL algorithm to permute both layers
 * @param {Object} cubeState - Current cube state (after OLL)
 * @returns {Object} Result object with new state and moves applied
 */
export function applyPBL(cubeState) {
    const pblCase = recognizePBLCase(cubeState);
    
    if (pblCase === 'solved') {
        return {
            cubeState: cloneCubeState(cubeState),
            algorithm: '',
            moves: [],
            case: pblCase
        };
    }
    
    const algorithm = PBL_ALGORITHMS[pblCase];
    if (!algorithm) {
        throw new Error(`Unknown PBL case: ${pblCase}`);
    }
    
    const moves = parseMoveNotation(algorithm);
    const newState = applyMoveSequence(cubeState, moves);
    
    return {
        cubeState: newState,
        algorithm,
        moves,
        case: pblCase
    };
}

/**
 * Get all available PBL algorithms
 * @returns {Object} Copy of PBL algorithms lookup table
 */
export function getPBLAlgorithms() {
    return { ...PBL_ALGORITHMS };
}

/**
 * Test PBL recognition and execution with a specific case
 * @param {string} pblCase - PBL case to test
 * @returns {Object} Test result with scramble and solution
 */
export function testPBLCase(pblCase) {
    if (!PBL_ALGORITHMS.hasOwnProperty(pblCase)) {
        throw new Error(`Invalid PBL case: ${pblCase}`);
    }
    
    // Create a cube with completed OLL but requiring PBL
    const solvedCube = createSolvedCube('2x2x2');
    const algorithm = PBL_ALGORITHMS[pblCase];
    
    if (!algorithm) {
        return {
            case: pblCase,
            scramble: '',
            solution: '',
            testState: solvedCube
        };
    }
    
    // Apply inverse to create test scramble
    const inverseMoves = getInverseMoveSequence(algorithm);
    const scrambledState = applyMoveSequence(solvedCube, inverseMoves);
    
    // Test recognition
    const recognizedCase = recognizePBLCase(scrambledState);
    
    // Test solution
    const pblResult = applyPBL(scrambledState);
    
    return {
        case: pblCase,
        recognizedCase,
        scramble: movesToNotation(inverseMoves),
        solution: algorithm,
        testState: scrambledState,
        solvedState: pblResult.cubeState,
        isCorrect: recognizedCase === pblCase && isCubeSolved(pblResult.cubeState)
    };
}

// ========================= CLL METHOD - ADVANCED FALLBACK =========================

/**
 * CLL (Corners of Last Layer) algorithm lookup table
 * This is a subset of the full 42 CLL algorithms - implementing most common cases
 * Full CLL implementation would require all 42 cases for complete coverage
 */
const CLL_ALGORITHMS = {
    // Common T-shaped cases
    't_1': "F R U R' U' R U' R' U' R U R' F'",
    't_2': "R U R' U R U2 R'", // Sune variation
    
    // L-shaped cases  
    'l_1': "R2 U2 R' U2 R2",
    'l_2': "F R U R' U' F'",
    
    // Pi cases
    'pi_1': "R U2 R2 U' R2 U' R2 U2 R",
    'pi_2': "F R U R' U' R U R' U' F'",
    
    // H cases
    'h_1': "R2 U2 R U2 R2",
    'h_2': "F2 R2 U2 R2 F2",
    
    // U cases
    'u_1': "R U R' U R U' R' U R U2 R'",
    'u_2': "R2 U R U R' U' R' U' R' U R'",
    
    // Additional common cases
    'bar_1': "R U2 R' U' R U' R'",
    'diag_1': "R2 F2 R2",
    
    // Placeholder for additional algorithms
    // In a full implementation, this would contain all 42 CLL cases
    solved: '' // No algorithm needed if already solved
};

/**
 * Check if cube state is suitable for CLL method
 * CLL requires first layer to be completely solved
 * @param {Object} cubeState - Current cube state
 * @returns {boolean} True if suitable for CLL
 */
export function isSuitableForCLL(cubeState) {
    // Check if first layer (U face) is completely solved
    const uFace = cubeState.faces.U;
    const firstColor = uFace[0];
    
    // All U face stickers should be the same color
    const isUFaceSolved = uFace.every(sticker => sticker === firstColor);
    
    if (!isUFaceSolved) {
        return false;
    }
    
    // Check adjacent faces to ensure first layer is complete
    // For simplicity, we'll assume if U face is monochromatic, first layer is solved
    // A full implementation would check the top row of F, R, B, L faces
    
    return true;
}

/**
 * Basic CLL case recognition (simplified implementation)
 * Full CLL would require complex pattern recognition for all 42 cases
 * @param {Object} cubeState - Current cube state (first layer should be solved)
 * @returns {string} CLL case identifier or null if not recognized
 */
export function recognizeCLLCase(cubeState) {
    if (!isSuitableForCLL(cubeState)) {
        return null;
    }
    
    if (isCubeSolved(cubeState)) {
        return 'solved';
    }
    
    // Analyze the last layer (D face) for pattern recognition
    const dFace = cubeState.faces.D;
    
    // Basic pattern matching - this is a simplified implementation
    // Full CLL would analyze orientation and permutation patterns more thoroughly
    
    // Count oriented stickers (target color facing down)
    const targetColor = 'Y'; // Yellow
    const orientedCount = dFace.filter(sticker => sticker === targetColor).length;
    
    // Simple heuristics for common cases
    switch (orientedCount) {
        case 0:
            return 'h_1'; // No oriented corners
        case 1:
            return 't_1'; // One oriented corner
        case 2:
            // Check if diagonal or adjacent
            const positions = dFace.map((sticker, index) => 
                sticker === targetColor ? index : -1
            ).filter(pos => pos !== -1);
            
            if (positions.length === 2) {
                const [pos1, pos2] = positions;
                const isDiagonal = Math.abs(pos1 - pos2) === 2;
                return isDiagonal ? 'diag_1' : 'bar_1';
            }
            return 'l_1';
        case 3:
            return 'u_1'; // Three oriented corners
        case 4:
            return 'solved'; // All oriented (should be caught earlier)
        default:
            return null; // Unrecognized pattern
    }
}

/**
 * Apply CLL algorithm to solve the last layer in one step
 * @param {Object} cubeState - Current cube state (first layer solved)
 * @returns {Object} Result object with new state and moves applied
 */
export function applyCLL(cubeState) {
    const cllCase = recognizeCLLCase(cubeState);
    
    if (!cllCase) {
        throw new Error('Cube state not suitable for CLL or case not recognized');
    }
    
    if (cllCase === 'solved') {
        return {
            cubeState: cloneCubeState(cubeState),
            algorithm: '',
            moves: [],
            case: cllCase,
            method: 'CLL'
        };
    }
    
    const algorithm = CLL_ALGORITHMS[cllCase];
    if (!algorithm) {
        throw new Error(`CLL case '${cllCase}' not implemented in algorithm set`);
    }
    
    const moves = parseMoveNotation(algorithm);
    const newState = applyMoveSequence(cubeState, moves);
    
    return {
        cubeState: newState,
        algorithm,
        moves,
        case: cllCase,
        method: 'CLL'
    };
}

/**
 * Get available CLL algorithms
 * @returns {Object} Available CLL algorithms (subset of full 42)
 */
export function getCLLAlgorithms() {
    return { ...CLL_ALGORITHMS };
}

/**
 * Solve using CLL method (if suitable) or fallback to Ortega
 * @param {Object} cubeState - Scrambled cube state
 * @param {Object} options - Solving options
 * @returns {Object} Complete solution
 */
export function solveCLLOrOrtega(cubeState, options = {}) {
    const { preferCLL = false, forceCLL = false } = options;
    
    // Check if CLL is suitable and preferred
    if ((preferCLL || forceCLL) && isSuitableForCLL(cubeState)) {
        try {
            const cllResult = applyCLL(cubeState);
            
            if (isCubeSolved(cllResult.cubeState)) {
                return {
                    originalState: cubeState,
                    solvedState: cllResult.cubeState,
                    solutionSteps: [{
                        phase: 'CLL',
                        case: cllResult.case,
                        algorithm: cllResult.algorithm,
                        moves: cllResult.moves.length
                    }],
                    totalMoves: cllResult.moves.length,
                    moveSequence: movesToNotation(cllResult.moves),
                    parsedMoves: cllResult.moves,
                    isSolved: true,
                    method: 'CLL',
                    phases: ['CLL']
                };
            }
        } catch (error) {
            if (forceCLL) {
                throw new Error(`CLL forced but failed: ${error.message}`);
            }
            // Fall back to Ortega if CLL fails and not forced
        }
    }
    
    // Use Ortega method as default/fallback
    return solveOrtega(cubeState);
}

// ========================= COMPLETE ORTEGA METHOD SOLVER =========================

/**
 * Solve a 2x2x2 cube using the Ortega method
 * @param {Object} cubeState - Scrambled cube state to solve
 * @returns {Object} Complete solution with steps and total moves
 */
export function solveOrtega(cubeState) {
    if (cubeState.cubeType !== '2x2x2') {
        throw new Error(`Ortega solver only supports 2x2x2 cubes, got ${cubeState.cubeType}`);
    }
    
    let currentState = cloneCubeState(cubeState);
    const solutionSteps = [];
    let totalMoves = [];
    
    // Step 1: OLL (Orient Last Layer)
    const ollResult = applyOLL(currentState);
    if (ollResult.moves.length > 0) {
        solutionSteps.push({
            phase: 'OLL',
            case: ollResult.case,
            algorithm: ollResult.algorithm,
            moves: ollResult.moves.length
        });
        totalMoves = totalMoves.concat(ollResult.moves);
        currentState = ollResult.cubeState;
    }
    
    // Step 2: PBL (Permute Both Layers)
    const pblResult = applyPBL(currentState);
    if (pblResult.moves.length > 0) {
        solutionSteps.push({
            phase: 'PBL',
            case: pblResult.case,
            algorithm: pblResult.algorithm,
            moves: pblResult.moves.length
        });
        totalMoves = totalMoves.concat(pblResult.moves);
        currentState = pblResult.cubeState;
    }
    
    // Verify solution
    const isSolved = isCubeSolved(currentState);
    
    return {
        originalState: cubeState,
        solvedState: currentState,
        solutionSteps,
        totalMoves: totalMoves.length,
        moveSequence: movesToNotation(totalMoves),
        parsedMoves: totalMoves,
        isSolved,
        method: 'Ortega',
        phases: solutionSteps.map(step => step.phase)
    };
}

/**
 * Get a summary of Ortega method algorithms
 * @returns {Object} Summary of all OLL and PBL algorithms
 */
export function getOrtegaAlgorithms() {
    return {
        OLL: getOLLAlgorithms(),
        PBL: getPBLAlgorithms(),
        totalCases: Object.keys(getOLLAlgorithms()).length + Object.keys(getPBLAlgorithms()).length
    };
}

/**
 * Main 2x2x2 solver with method selection
 * @param {Object} cubeState - Scrambled cube state to solve
 * @param {Object} options - Solver options
 * @returns {Object} Complete solution
 */
export function solve2x2x2(cubeState, options = {}) {
    const { method = 'auto', preferCLL = false } = options;
    
    if (cubeState.cubeType !== '2x2x2') {
        throw new Error(`2x2x2 solver only supports 2x2x2 cubes, got ${cubeState.cubeType}`);
    }
    
    switch (method) {
        case 'ortega':
            return solveOrtega(cubeState);
            
        case 'cll':
            return solveCLLOrOrtega(cubeState, { forceCLL: true });
            
        case 'auto':
        default:
            return solveCLLOrOrtega(cubeState, { preferCLL });
    }
}

/**
 * Get all available algorithms for 2x2x2 solving
 * @returns {Object} Complete algorithm reference
 */
export function getAllAlgorithms() {
    return {
        Ortega: getOrtegaAlgorithms(),
        CLL: getCLLAlgorithms(),
        methods: ['Ortega', 'CLL'],
        totalAlgorithms: 
            Object.keys(getOLLAlgorithms()).length + 
            Object.keys(getPBLAlgorithms()).length +
            Object.keys(getCLLAlgorithms()).length
    };
}

// ========================= SOLUTION OPTIMIZATION AND ANALYSIS =========================

/**
 * Analyze solution quality and provide optimization metrics
 * @param {Object} solution - Solution object from solve2x2x2
 * @returns {Object} Analysis with metrics and recommendations
 */
export function analyzeSolution(solution) {
    const { totalMoves, method, solutionSteps, parsedMoves } = solution;
    
    // Calculate move efficiency metrics
    const moveAnalysis = {
        totalMoves,
        method,
        phases: solutionSteps.length,
        efficiency: calculateMoveEfficiency(totalMoves, method),
        moveBreakdown: solutionSteps.map(step => ({
            phase: step.phase,
            case: step.case,
            moves: step.moves,
            algorithm: step.algorithm
        }))
    };
    
    // Assess solution quality
    const quality = assessSolutionQuality(totalMoves, method);
    
    // Generate optimization suggestions
    const optimizations = generateOptimizationSuggestions(solution);
    
    return {
        analysis: moveAnalysis,
        quality,
        optimizations,
        metrics: {
            movesPerSecond: estimateMovesPerSecond(totalMoves, method),
            theoreticalMinimum: getTheoreticalMinimum(method),
            efficiencyRating: quality.rating
        }
    };
}

/**
 * Calculate move efficiency based on method and total moves
 * @param {number} totalMoves - Total moves in solution
 * @param {string} method - Solving method used
 * @returns {Object} Efficiency metrics
 */
function calculateMoveEfficiency(totalMoves, method) {
    // Typical move ranges for each method
    const ranges = {
        'Ortega': { min: 8, typical: 12, max: 18 },
        'CLL': { min: 6, typical: 10, max: 15 },
        'auto': { min: 6, typical: 11, max: 18 }
    };
    
    const range = ranges[method] || ranges['auto'];
    const efficiency = Math.max(0, Math.min(100, 
        ((range.max - totalMoves) / (range.max - range.min)) * 100
    ));
    
    return {
        moves: totalMoves,
        range: range,
        efficiencyPercent: Math.round(efficiency),
        category: totalMoves <= range.typical ? 'efficient' : 
                 totalMoves <= range.max ? 'average' : 'inefficient'
    };
}

/**
 * Assess overall solution quality
 * @param {number} totalMoves - Total moves in solution
 * @param {string} method - Solving method used
 * @returns {Object} Quality assessment
 */
function assessSolutionQuality(totalMoves, method) {
    const efficiency = calculateMoveEfficiency(totalMoves, method);
    
    let rating, description;
    
    if (efficiency.efficiencyPercent >= 80) {
        rating = 'excellent';
        description = 'Very efficient solution with minimal moves';
    } else if (efficiency.efficiencyPercent >= 60) {
        rating = 'good';
        description = 'Solid solution with reasonable move count';
    } else if (efficiency.efficiencyPercent >= 40) {
        rating = 'average';
        description = 'Standard solution, room for optimization';
    } else {
        rating = 'below average';
        description = 'Inefficient solution, consider alternative approach';
    }
    
    return {
        rating,
        description,
        score: efficiency.efficiencyPercent,
        category: efficiency.category
    };
}

/**
 * Generate optimization suggestions for the solution
 * @param {Object} solution - Complete solution object
 * @returns {Array} Array of optimization suggestions
 */
function generateOptimizationSuggestions(solution) {
    const suggestions = [];
    const { totalMoves, method, solutionSteps } = solution;
    
    // Method-specific suggestions
    if (method === 'Ortega' && totalMoves > 15) {
        suggestions.push({
            type: 'method',
            suggestion: 'Consider using CLL method for more advanced solving',
            impact: 'Could reduce moves by 2-4 on average',
            difficulty: 'advanced'
        });
    }
    
    if (method === 'CLL' && totalMoves > 12) {
        suggestions.push({
            type: 'recognition',
            suggestion: 'Review CLL case recognition for faster identification',
            impact: 'Better case selection could improve efficiency',
            difficulty: 'intermediate'
        });
    }
    
    // Phase-specific analysis
    solutionSteps.forEach((step, index) => {
        if (step.moves > 10 && step.phase === 'OLL') {
            suggestions.push({
                type: 'algorithm',
                suggestion: `OLL case "${step.case}" used ${step.moves} moves - consider alternative algorithm`,
                impact: 'Could save 2-3 moves',
                difficulty: 'beginner'
            });
        }
        
        if (step.moves > 12 && step.phase === 'PBL') {
            suggestions.push({
                type: 'algorithm',
                suggestion: `PBL case "${step.case}" was complex - practice recognition`,
                impact: 'Faster recognition improves overall time',
                difficulty: 'intermediate'
            });
        }
    });
    
    // General optimization tips
    if (totalMoves > 16) {
        suggestions.push({
            type: 'general',
            suggestion: 'Solution exceeded typical range - review cube state and algorithm choice',
            impact: 'Systematic improvement in case recognition',
            difficulty: 'beginner'
        });
    }
    
    return suggestions;
}

/**
 * Estimate solving speed based on move count and method
 * @param {number} totalMoves - Total moves in solution
 * @param {string} method - Solving method used
 * @returns {number} Estimated moves per second for average solver
 */
function estimateMovesPerSecond(totalMoves, method) {
    // Typical TPS (turns per second) for each method
    const methodSpeeds = {
        'Ortega': 3.5, // Beginner-friendly, higher TPS
        'CLL': 4.0,    // Advanced method, higher TPS potential
        'auto': 3.7    // Average between methods
    };
    
    return methodSpeeds[method] || methodSpeeds['auto'];
}

/**
 * Get theoretical minimum moves for each method
 * @param {string} method - Solving method
 * @returns {number} Theoretical minimum moves
 */
function getTheoreticalMinimum(method) {
    const minimums = {
        'Ortega': 6,  // Theoretical minimum with perfect case recognition
        'CLL': 4,     // Single algorithm if first layer solved
        'auto': 4     // Best case scenario
    };
    
    return minimums[method] || minimums['auto'];
}

/**
 * Compare multiple solving approaches for the same scramble
 * @param {Object} cubeState - Scrambled cube state
 * @returns {Object} Comparison of different methods
 */
export function compareSolvingMethods(cubeState) {
    const results = {};
    const methods = ['ortega', 'cll', 'auto'];
    
    methods.forEach(method => {
        try {
            const solution = solve2x2x2(cubeState, { method });
            const analysis = analyzeSolution(solution);
            
            results[method] = {
                solution,
                analysis,
                success: true
            };
        } catch (error) {
            results[method] = {
                error: error.message,
                success: false
            };
        }
    });
    
    // Find the most efficient method for this specific scramble
    const successful = Object.entries(results).filter(([_, result]) => result.success);
    if (successful.length > 0) {
        const bestMethod = successful.reduce((best, [method, result]) => 
            result.solution.totalMoves < best.solution.totalMoves ? result : best
        );
        
        results.recommendation = {
            bestMethod: successful.find(([_, result]) => result === bestMethod)[0],
            movesSaved: successful[0][1].solution.totalMoves - bestMethod.solution.totalMoves,
            reasoning: `${bestMethod.solution.method} method used ${bestMethod.solution.totalMoves} moves vs average of ${
                Math.round(successful.reduce((sum, [_, r]) => sum + r.solution.totalMoves, 0) / successful.length)
            }`
        };
    }
    
    return results;
}

/**
 * Generate detailed solving statistics
 * @param {Array} solutions - Array of solution objects from multiple solves
 * @returns {Object} Comprehensive statistics
 */
export function generateSolvingStatistics(solutions) {
    if (!solutions || solutions.length === 0) {
        return { error: 'No solutions provided for analysis' };
    }
    
    const moves = solutions.map(s => s.totalMoves);
    const methods = solutions.map(s => s.method);
    
    return {
        totalSolves: solutions.length,
        moveStatistics: {
            average: Math.round((moves.reduce((a, b) => a + b, 0) / moves.length) * 100) / 100,
            minimum: Math.min(...moves),
            maximum: Math.max(...moves),
            range: Math.max(...moves) - Math.min(...moves),
            median: moves.sort((a, b) => a - b)[Math.floor(moves.length / 2)]
        },
        methodDistribution: methods.reduce((dist, method) => {
            dist[method] = (dist[method] || 0) + 1;
            return dist;
        }, {}),
        qualityDistribution: solutions.reduce((dist, sol) => {
            const quality = assessSolutionQuality(sol.totalMoves, sol.method);
            dist[quality.rating] = (dist[quality.rating] || 0) + 1;
            return dist;
        }, {}),
        recommendations: {
            mostEfficient: methods[moves.indexOf(Math.min(...moves))],
            averageEfficiency: Math.round(solutions.reduce((sum, sol) => 
                sum + calculateMoveEfficiency(sol.totalMoves, sol.method).efficiencyPercent, 0
            ) / solutions.length),
            improvementTips: generateGeneralImprovementTips(solutions)
        }
    };
}

/**
 * Generate general improvement tips based on solving patterns
 * @param {Array} solutions - Array of solution objects
 * @returns {Array} Improvement suggestions
 */
function generateGeneralImprovementTips(solutions) {
    const tips = [];
    const avgMoves = solutions.reduce((sum, s) => sum + s.totalMoves, 0) / solutions.length;
    
    if (avgMoves > 14) {
        tips.push('Focus on learning more efficient algorithms for common cases');
    }
    
    if (avgMoves > 12) {
        tips.push('Practice case recognition to reduce thinking time');
    }
    
    const methodCounts = solutions.reduce((counts, s) => {
        counts[s.method] = (counts[s.method] || 0) + 1;
        return counts;
    }, {});
    
    if (methodCounts['Ortega'] > methodCounts['CLL'] && avgMoves > 10) {
        tips.push('Consider learning CLL method for faster single-look last layer');
    }
    
    return tips;
}

// ========================= EXPORTS =========================

export default {
    // Move notation parsing
    parseMoveNotation,
    parseSingleMove,
    validateMoves,
    movesToNotation,
    
    // Cube state manipulation
    rotateFace,
    applyMove,
    applyMoveSequence,
    getInverseMove,
    getInverseMoveSequence,
    
    // Utility functions
    isCubeSolved,
    createScrambledCube,
    countMoves,
    optimizeMoveSequence,
    
    // OLL (Orient Last Layer) functions
    recognizeOLLCase,
    applyOLL,
    isLastLayerOriented,
    getOLLAlgorithms,
    testOLLCase,
    
    // PBL (Permute Both Layers) functions
    recognizePBLCase,
    applyPBL,
    getPBLAlgorithms,
    testPBLCase,
    
    // CLL (Corners of Last Layer) functions
    isSuitableForCLL,
    recognizeCLLCase,
    applyCLL,
    getCLLAlgorithms,
    solveCLLOrOrtega,
    
    // Complete solvers
    solveOrtega,
    solve2x2x2,
    getOrtegaAlgorithms,
    getAllAlgorithms,
    
    // Solution optimization and analysis
    analyzeSolution,
    compareSolvingMethods,
    generateSolvingStatistics
};