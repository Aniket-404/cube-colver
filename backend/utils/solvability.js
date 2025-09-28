/**
 * Solvability Detection for Rubik's Cubes
 * 
 * This module implements mathematical solvability checks using group theory principles.
 * Each cube type has specific parity constraints that must be satisfied for a legal cube state.
 */

import {
    extractCornerPieces,
    extractCenterPieces,
    extractEdgePieces,
    getCubeConfig,
    VALID_COLORS,
    FACE_NAMES
} from './cubeStructures.js';

// ========================= SOLVABILITY ERROR TYPES =========================

export const SOLVABILITY_ERRORS = {
    CORNER_ORIENTATION_PARITY: 'CORNER_ORIENTATION_PARITY',
    EDGE_ORIENTATION_PARITY: 'EDGE_ORIENTATION_PARITY',
    CORNER_PERMUTATION_PARITY: 'CORNER_PERMUTATION_PARITY',
    EDGE_PERMUTATION_PARITY: 'EDGE_PERMUTATION_PARITY',
    INVALID_PIECE_CONFIGURATION: 'INVALID_PIECE_CONFIGURATION',
    IMPOSSIBLE_PIECE_POSITIONS: 'IMPOSSIBLE_PIECE_POSITIONS'
};

// ========================= PIECE IDENTIFICATION UTILITIES =========================

/**
 * Get the expected colors for a piece based on its position
 * @param {string} piecePosition - Position identifier (e.g., 'UFR', 'UF')
 * @param {string} cubeType - Type of cube
 * @returns {string[]} Array of expected colors in order
 */
function getExpectedPieceColors(piecePosition, cubeType) {
    // Standard color mapping: U=W, L=O, F=G, R=R, B=B, D=Y
    const colorMap = {
        'U': 'W', 'L': 'O', 'F': 'G', 'R': 'R', 'B': 'B', 'D': 'Y'
    };
    
    return piecePosition.split('').map(face => colorMap[face]);
}

/**
 * Calculate corner orientation value
 * Corners can be oriented 0, 1, or 2 (clockwise rotations)
 * @param {Object} corner - Corner piece data
 * @param {string} position - Corner position (e.g., 'UFR')
 * @returns {number} Orientation value (0, 1, or 2)
 */
function getCornerOrientation(corner, position) {
    const expectedColors = getExpectedPieceColors(position);
    const actualColors = corner.map(facelet => facelet.color);
    
    // Find which rotation of expected colors matches actual colors
    for (let rotation = 0; rotation < 3; rotation++) {
        const rotatedExpected = expectedColors.slice(rotation).concat(expectedColors.slice(0, rotation));
        if (JSON.stringify(rotatedExpected) === JSON.stringify(actualColors)) {
            return rotation;
        }
    }
    
    return -1; // Invalid corner configuration
}

/**
 * Calculate edge orientation value (for 3x3x3)
 * Edges can be oriented 0 (good) or 1 (flipped)
 * @param {Object} edge - Edge piece data
 * @param {string} position - Edge position (e.g., 'UF')
 * @returns {number} Orientation value (0 or 1)
 */
function getEdgeOrientation(edge, position) {
    const expectedColors = getExpectedPieceColors(position);
    const actualColors = edge.map(facelet => facelet.color);
    
    // Check if colors match in correct order (orientation 0)
    if (JSON.stringify(expectedColors) === JSON.stringify(actualColors)) {
        return 0;
    }
    
    // Check if colors match in flipped order (orientation 1)
    if (JSON.stringify(expectedColors.reverse()) === JSON.stringify(actualColors)) {
        return 1;
    }
    
    return -1; // Invalid edge configuration
}

/**
 * Calculate permutation parity using cycle decomposition
 * @param {number[]} permutation - Array representing permutation
 * @returns {number} Parity value (0 = even, 1 = odd)
 */
function calculatePermutationParity(permutation) {
    const visited = new Array(permutation.length).fill(false);
    let cycleCount = 0;
    
    for (let i = 0; i < permutation.length; i++) {
        if (!visited[i] && permutation[i] !== i) {
            // Start a new cycle
            let current = i;
            let cycleLength = 0;
            
            while (!visited[current]) {
                visited[current] = true;
                current = permutation[current];
                cycleLength++;
            }
            
            // Each cycle of length n contributes (n-1) to the parity
            cycleCount += cycleLength - 1;
        }
    }
    
    return cycleCount % 2;
}

// ========================= 2x2x2 SOLVABILITY CHECKS =========================

/**
 * Check corner permutation parity for 2x2x2 cube
 * @param {Object} cubeState - Cube state to check
 * @returns {Object} Solvability result
 */
function check2x2x2CornerPermutationParity(cubeState) {
    const corners = extractCornerPieces(cubeState);
    const cornerPositions = ['UFR', 'UFL', 'UBR', 'UBL', 'DFR', 'DFL', 'DBR', 'DBL'];
    
    // Create permutation array
    const permutation = new Array(8);
    
    for (let i = 0; i < cornerPositions.length; i++) {
        const position = cornerPositions[i];
        const corner = corners[position];
        
        if (!corner) {
            return {
                isValid: false,
                error: {
                    type: SOLVABILITY_ERRORS.INVALID_PIECE_CONFIGURATION,
                    message: `Missing corner piece at position ${position}`
                }
            };
        }
        
        // Find where this piece belongs
        const actualColors = corner.map(f => f.color).sort().join('');
        let targetIndex = -1;
        
        for (let j = 0; j < cornerPositions.length; j++) {
            const expectedColors = getExpectedPieceColors(cornerPositions[j]).sort().join('');
            if (actualColors === expectedColors) {
                targetIndex = j;
                break;
            }
        }
        
        if (targetIndex === -1) {
            return {
                isValid: false,
                error: {
                    type: SOLVABILITY_ERRORS.IMPOSSIBLE_PIECE_POSITIONS,
                    message: `Corner at position ${position} has impossible color combination: ${actualColors}`
                }
            };
        }
        
        permutation[i] = targetIndex;
    }
    
    const parity = calculatePermutationParity(permutation);
    
    return {
        isValid: parity === 0,
        parity: parity,
        error: parity !== 0 ? {
            type: SOLVABILITY_ERRORS.CORNER_PERMUTATION_PARITY,
            message: '2x2x2 corner permutation parity is odd - cube is unsolvable'
        } : null
    };
}

/**
 * Check corner orientation parity for 2x2x2 cube
 * @param {Object} cubeState - Cube state to check
 * @returns {Object} Solvability result
 */
function check2x2x2CornerOrientationParity(cubeState) {
    const corners = extractCornerPieces(cubeState);
    const cornerPositions = ['UFR', 'UFL', 'UBR', 'UBL', 'DFR', 'DFL', 'DBR', 'DBL'];
    
    let totalOrientation = 0;
    const orientations = [];
    
    for (const position of cornerPositions) {
        const corner = corners[position];
        const orientation = getCornerOrientation(corner, position);
        
        if (orientation === -1) {
            return {
                isValid: false,
                error: {
                    type: SOLVABILITY_ERRORS.INVALID_PIECE_CONFIGURATION,
                    message: `Corner at position ${position} has invalid orientation`
                }
            };
        }
        
        orientations.push({ position, orientation });
        totalOrientation += orientation;
    }
    
    const parity = totalOrientation % 3;
    
    return {
        isValid: parity === 0,
        totalOrientation: totalOrientation,
        orientations: orientations,
        error: parity !== 0 ? {
            type: SOLVABILITY_ERRORS.CORNER_ORIENTATION_PARITY,
            message: `2x2x2 corner orientation sum is ${totalOrientation}, must be divisible by 3`
        } : null
    };
}

/**
 * Complete solvability check for 2x2x2 cube
 * @param {Object} cubeState - Cube state to check
 * @returns {Object} Comprehensive solvability result
 */
export function checkSolvability2x2x2(cubeState) {
    const results = {
        isSolvable: true,
        errors: [],
        checks: {}
    };
    
    // Check corner orientation parity
    const orientationResult = check2x2x2CornerOrientationParity(cubeState);
    results.checks.cornerOrientation = orientationResult;
    if (!orientationResult.isValid) {
        results.isSolvable = false;
        results.errors.push(orientationResult.error);
    }
    
    // Check corner permutation parity (only if orientation is valid)
    if (orientationResult.isValid) {
        const permutationResult = check2x2x2CornerPermutationParity(cubeState);
        results.checks.cornerPermutation = permutationResult;
        if (!permutationResult.isValid) {
            results.isSolvable = false;
            results.errors.push(permutationResult.error);
        }
    }
    
    return results;
}

// ========================= 3x3x3 SOLVABILITY CHECKS =========================

/**
 * Check edge orientation parity for 3x3x3 cube
 * @param {Object} cubeState - Cube state to check
 * @returns {Object} Solvability result
 */
function check3x3x3EdgeOrientationParity(cubeState) {
    const edges = extractEdgePieces(cubeState);
    const edgePositions = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL'];
    
    let totalOrientation = 0;
    const orientations = [];
    
    for (const position of edgePositions) {
        const edge = edges[position];
        if (!edge) continue;
        
        const orientation = getEdgeOrientation(edge, position);
        
        if (orientation === -1) {
            return {
                isValid: false,
                error: {
                    type: SOLVABILITY_ERRORS.INVALID_PIECE_CONFIGURATION,
                    message: `Edge at position ${position} has invalid orientation`
                }
            };
        }
        
        orientations.push({ position, orientation });
        totalOrientation += orientation;
    }
    
    const parity = totalOrientation % 2;
    
    return {
        isValid: parity === 0,
        totalOrientation: totalOrientation,
        orientations: orientations,
        error: parity !== 0 ? {
            type: SOLVABILITY_ERRORS.EDGE_ORIENTATION_PARITY,
            message: `3x3x3 edge orientation sum is ${totalOrientation}, must be even`
        } : null
    };
}

/**
 * Check edge permutation parity for 3x3x3 cube
 * @param {Object} cubeState - Cube state to check
 * @returns {Object} Solvability result
 */
function check3x3x3EdgePermutationParity(cubeState) {
    const edges = extractEdgePieces(cubeState);
    const edgePositions = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL'];
    
    // Create permutation array
    const permutation = new Array(12);
    
    for (let i = 0; i < edgePositions.length; i++) {
        const position = edgePositions[i];
        const edge = edges[position];
        
        if (!edge) {
            return {
                isValid: false,
                error: {
                    type: SOLVABILITY_ERRORS.INVALID_PIECE_CONFIGURATION,
                    message: `Missing edge piece at position ${position}`
                }
            };
        }
        
        // Find where this piece belongs
        const actualColors = edge.map(f => f.color).sort().join('');
        let targetIndex = -1;
        
        for (let j = 0; j < edgePositions.length; j++) {
            const expectedColors = getExpectedPieceColors(edgePositions[j]).sort().join('');
            if (actualColors === expectedColors) {
                targetIndex = j;
                break;
            }
        }
        
        if (targetIndex === -1) {
            return {
                isValid: false,
                error: {
                    type: SOLVABILITY_ERRORS.IMPOSSIBLE_PIECE_POSITIONS,
                    message: `Edge at position ${position} has impossible color combination`
                }
            };
        }
        
        permutation[i] = targetIndex;
    }
    
    const parity = calculatePermutationParity(permutation);
    
    return {
        isValid: true, // Edge permutation parity is determined by corner parity
        parity: parity,
        permutation: permutation
    };
}

/**
 * Complete solvability check for 3x3x3 cube
 * @param {Object} cubeState - Cube state to check
 * @returns {Object} Comprehensive solvability result
 */
export function checkSolvability3x3x3(cubeState) {
    const results = {
        isSolvable: true,
        errors: [],
        checks: {}
    };
    
    // Check corner orientation parity (reuse 2x2x2 logic)
    const cornerOrientationResult = check2x2x2CornerOrientationParity(cubeState);
    results.checks.cornerOrientation = cornerOrientationResult;
    if (!cornerOrientationResult.isValid) {
        results.isSolvable = false;
        results.errors.push(cornerOrientationResult.error);
    }
    
    // Check edge orientation parity
    const edgeOrientationResult = check3x3x3EdgeOrientationParity(cubeState);
    results.checks.edgeOrientation = edgeOrientationResult;
    if (!edgeOrientationResult.isValid) {
        results.isSolvable = false;
        results.errors.push(edgeOrientationResult.error);
    }
    
    // Check corner and edge permutation parity
    if (cornerOrientationResult.isValid && edgeOrientationResult.isValid) {
        const cornerPermutationResult = check2x2x2CornerPermutationParity(cubeState);
        const edgePermutationResult = check3x3x3EdgePermutationParity(cubeState);
        
        results.checks.cornerPermutation = cornerPermutationResult;
        results.checks.edgePermutation = edgePermutationResult;
        
        if (!cornerPermutationResult.isValid) {
            results.isSolvable = false;
            results.errors.push(cornerPermutationResult.error);
        } else if (cornerPermutationResult.parity !== edgePermutationResult.parity) {
            results.isSolvable = false;
            results.errors.push({
                type: SOLVABILITY_ERRORS.CORNER_PERMUTATION_PARITY,
                message: `Corner and edge permutation parities don't match (corner: ${cornerPermutationResult.parity}, edge: ${edgePermutationResult.parity})`
            });
        }
    }
    
    return results;
}

// ========================= 4x4x4 SOLVABILITY CHECKS =========================

/**
 * Check solvability for 4x4x4 cube (simplified)
 * 4x4x4 cubes have additional parity cases that are complex to detect
 * @param {Object} cubeState - Cube state to check
 * @returns {Object} Solvability result
 */
export function checkSolvability4x4x4(cubeState) {
    // For 4x4x4, we'll do a simplified check focusing on center blocks
    const results = {
        isSolvable: true,
        errors: [],
        checks: {}
    };
    
    // Check that center blocks are uniform and different colors
    const centers = extractCenterPieces(cubeState);
    const centerColors = new Set();
    
    for (const [face, centerBlock] of Object.entries(centers)) {
        if (!Array.isArray(centerBlock)) continue;
        
        // Check uniformity within each center block
        const colors = centerBlock.map(p => p.color);
        const uniqueColors = new Set(colors);
        
        if (uniqueColors.size !== 1) {
            results.isSolvable = false;
            results.errors.push({
                type: SOLVABILITY_ERRORS.INVALID_PIECE_CONFIGURATION,
                message: `4x4x4 center block on face ${face} is not uniform`
            });
            continue;
        }
        
        const centerColor = colors[0];
        
        // Check for duplicate center colors
        if (centerColors.has(centerColor)) {
            results.isSolvable = false;
            results.errors.push({
                type: SOLVABILITY_ERRORS.INVALID_PIECE_CONFIGURATION,
                message: `4x4x4 has duplicate center color: ${centerColor}`
            });
        }
        
        centerColors.add(centerColor);
    }
    
    // Note: Full 4x4x4 solvability requires checking OLL and PLL parity
    // This is a simplified version for basic validation
    results.checks.centerBlocks = {
        isValid: results.errors.length === 0,
        centerColors: Array.from(centerColors)
    };
    
    return results;
}

// ========================= MAIN SOLVABILITY INTERFACE =========================

/**
 * Check if a cube state is mathematically solvable
 * @param {Object} cubeState - Cube state to check
 * @returns {Object} Comprehensive solvability analysis
 */
export function checkSolvability(cubeState) {
    if (!cubeState || !cubeState.cubeType) {
        return {
            isSolvable: false,
            errors: [{
                type: SOLVABILITY_ERRORS.INVALID_PIECE_CONFIGURATION,
                message: 'Invalid cube state provided'
            }],
            cubeType: 'unknown'
        };
    }
    
    switch (cubeState.cubeType) {
        case '2x2x2':
            return {
                ...checkSolvability2x2x2(cubeState),
                cubeType: '2x2x2'
            };
        case '3x3x3':
            return {
                ...checkSolvability3x3x3(cubeState),
                cubeType: '3x3x3'
            };
        case '4x4x4':
            return {
                ...checkSolvability4x4x4(cubeState),
                cubeType: '4x4x4'
            };
        default:
            return {
                isSolvable: false,
                errors: [{
                    type: SOLVABILITY_ERRORS.INVALID_PIECE_CONFIGURATION,
                    message: `Solvability check not implemented for ${cubeState.cubeType}`
                }],
                cubeType: cubeState.cubeType
            };
    }
}

// ========================= EXPORTS =========================

export default {
    SOLVABILITY_ERRORS,
    checkSolvability,
    checkSolvability2x2x2,
    checkSolvability3x3x3,
    checkSolvability4x4x4
};