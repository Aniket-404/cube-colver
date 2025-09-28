/**
 * Cube Data Structures and Schemas for Multi-Cube Solver
 * 
 * This module defines standardized data structures for 2x2x2, 3x3x3, and 4x4x4 Rubik's cubes.
 * Each cube type has specific facelet counts, color distributions, and validation requirements.
 */

// ========================= CUBE SIZE CONFIGURATIONS =========================

/**
 * @typedef {Object} CubeConfig
 * @property {string} name - Human-readable cube name
 * @property {number} size - Cube dimension (2, 3, or 4)
 * @property {number} faceletsPerFace - Number of facelets on each face
 * @property {number} totalFacelets - Total facelets on the cube
 * @property {number} colorsPerType - How many facelets of each color
 * @property {Array<string>} standardColors - Standard color sequence
 * @property {Object} faces - Face definitions with indices
 */

export const CUBE_CONFIGS = {
    '2x2x2': {
        name: '2x2x2 Pocket Cube',
        size: 2,
        faceletsPerFace: 4,
        totalFacelets: 24,
        colorsPerType: 4,
        standardColors: ['W', 'Y', 'G', 'B', 'R', 'O'],
        faces: ['U', 'L', 'F', 'R', 'B', 'D']
    },
    '3x3x3': {
        name: '3x3x3 Standard Cube',
        size: 3,
        faceletsPerFace: 9,
        totalFacelets: 54,
        colorsPerType: 9,
        standardColors: ['W', 'Y', 'G', 'B', 'R', 'O'],
        faces: ['U', 'L', 'F', 'R', 'B', 'D']
    },
    '4x4x4': {
        name: "4x4x4 Rubik's Revenge",
        size: 4,
        faceletsPerFace: 16,
        totalFacelets: 96,
        colorsPerType: 16,
        standardColors: ['W', 'Y', 'G', 'B', 'R', 'O'],
        faces: ['U', 'L', 'F', 'R', 'B', 'D']
    }
};

// ========================= COLOR DEFINITIONS =========================

/**
 * Standard color mapping for Rubik's cubes
 */
export const CUBE_COLORS = {
    W: 'White',    // Up face (traditionally white)
    Y: 'Yellow',   // Down face (opposite of white)
    G: 'Green',    // Front face (traditionally green)
    B: 'Blue',     // Back face (opposite of green)  
    R: 'Red',      // Right face (traditionally red)
    O: 'Orange'    // Left face (opposite of red)
};

/**
 * Valid color values for validation
 */
export const VALID_COLORS = Object.keys(CUBE_COLORS);

// ========================= FACE DEFINITIONS =========================

/**
 * Standard face notation for all cube types
 * Using standard cube notation where:
 * - U = Up face (white)
 * - D = Down face (yellow)  
 * - F = Front face (green)
 * - B = Back face (blue)
 * - R = Right face (red)
 * - L = Left face (orange)
 */
export const FACE_NAMES = ['U', 'L', 'F', 'R', 'B', 'D'];

/**
 * Face relationships for cube rotations and algorithms
 */
export const FACE_RELATIONSHIPS = {
    opposites: {
        U: 'D', D: 'U',
        F: 'B', B: 'F', 
        R: 'L', L: 'R'
    },
    adjacent: {
        U: ['F', 'R', 'B', 'L'],
        D: ['F', 'L', 'B', 'R'],
        F: ['U', 'R', 'D', 'L'],
        B: ['U', 'L', 'D', 'R'],
        R: ['U', 'B', 'D', 'F'],
        L: ['U', 'F', 'D', 'B']
    }
};

// ========================= CUBE STATE STRUCTURES =========================

/**
 * @typedef {Object} CubeState
 * @property {string} cubeType - Type of cube (2x2x2, 3x3x3, 4x4x4)
 * @property {Object} faces - Face data with U, L, F, R, B, D keys
 * @property {string[]} faces.U - Up face facelets (row-major order)
 * @property {string[]} faces.L - Left face facelets
 * @property {string[]} faces.F - Front face facelets
 * @property {string[]} faces.R - Right face facelets
 * @property {string[]} faces.B - Back face facelets
 * @property {string[]} faces.D - Down face facelets
 */

/**
 * Create a solved cube state for any cube type
 * @param {string} cubeType - Type of cube (2x2x2, 3x3x3, 4x4x4)
 * @returns {CubeState} Solved cube state
 */
export function createSolvedCube(cubeType) {
    const config = CUBE_CONFIGS[cubeType];
    if (!config) {
        throw new Error(`Invalid cube type: ${cubeType}`);
    }

    const faceColors = {
        U: 'W', // White on top
        D: 'Y', // Yellow on bottom  
        F: 'G', // Green in front
        B: 'B', // Blue in back
        R: 'R', // Red on right
        L: 'O'  // Orange on left
    };

    const faces = {};
    for (const face of FACE_NAMES) {
        faces[face] = new Array(config.faceletsPerFace).fill(faceColors[face]);
    }

    return {
        cubeType,
        faces
    };
}

/**
 * Create an empty cube state with all facelets uncolored
 * @param {string} cubeType - Type of cube (2x2x2, 3x3x3, 4x4x4)
 * @returns {CubeState} Empty cube state
 */
export function createEmptyCube(cubeType) {
    const config = CUBE_CONFIGS[cubeType];
    if (!config) {
        throw new Error(`Invalid cube type: ${cubeType}`);
    }

    const faces = {};
    for (const face of FACE_NAMES) {
        faces[face] = new Array(config.faceletsPerFace).fill('');
    }

    return {
        cubeType,
        faces
    };
}

/**
 * Create a cube state from facelet array representation
 * @param {string} cubeType - Type of cube (2x2x2, 3x3x3, 4x4x4)
 * @param {string[]} facelets - Array of facelets in ULFRBD order
 * @returns {CubeState} Cube state object
 */
export function createCubeFromArray(cubeType, facelets) {
    const config = CUBE_CONFIGS[cubeType];
    if (!config) {
        throw new Error(`Invalid cube type: ${cubeType}`);
    }

    if (facelets.length !== config.totalFacelets) {
        throw new Error(
            `Invalid facelet count for ${cubeType}: expected ${config.totalFacelets}, got ${facelets.length}`
        );
    }

    const faces = {};
    let index = 0;
    
    for (const face of FACE_NAMES) {
        faces[face] = facelets.slice(index, index + config.faceletsPerFace);
        index += config.faceletsPerFace;
    }

    return {
        cubeType,
        faces
    };
}

// ========================= CUBE CLONING AND CONVERSION =========================

/**
 * Deep clone a cube state
 * @param {CubeState} cubeState - Cube state to clone
 * @returns {CubeState} Cloned cube state
 */
export function cloneCubeState(cubeState) {
    const clonedFaces = {};
    for (const face of FACE_NAMES) {
        clonedFaces[face] = [...cubeState.faces[face]];
    }

    return {
        cubeType: cubeState.cubeType,
        faces: clonedFaces
    };
}

/**
 * Convert cube state to flat array representation
 * @param {CubeState} cubeState - Cube state to convert
 * @returns {string[]} Array of facelets in ULFRBD order
 */
export function cubeStateToArray(cubeState) {
    const result = [];
    for (const face of FACE_NAMES) {
        result.push(...cubeState.faces[face]);
    }
    return result;
}

/**
 * Convert cube state to string representation for debugging
 * @param {CubeState} cubeState - Cube state to convert
 * @returns {string} String representation of cube
 */
export function cubeStateToString(cubeState) {
    const lines = [`${cubeState.cubeType} Cube State:`];
    
    for (const face of FACE_NAMES) {
        const facelets = cubeState.faces[face];
        lines.push(`${face}: [${facelets.join(', ')}]`);
    }
    
    return lines.join('\n');
}

// ========================= FACELET INDEXING UTILITIES =========================

/**
 * Convert 2D grid coordinates to linear index
 * @param {number} size - Cube size (2, 3, or 4)
 * @param {number} row - Row coordinate (0-indexed)
 * @param {number} col - Column coordinate (0-indexed)
 * @returns {number} Linear index
 */
export function gridToIndex(size, row, col) {
    return row * size + col;
}

/**
 * Convert linear index to 2D grid coordinates
 * @param {number} size - Cube size (2, 3, or 4)
 * @param {number} index - Linear index
 * @returns {Object} Object with row and col properties
 */
export function indexToGrid(size, index) {
    return {
        row: Math.floor(index / size),
        col: index % size
    };
}

/**
 * Get facelet at specific grid position
 * @param {CubeState} cubeState - Cube state
 * @param {string} face - Face name (U, L, F, R, B, D)
 * @param {number} row - Row coordinate
 * @param {number} col - Column coordinate
 * @returns {string} Facelet color
 */
export function getFaceletAt(cubeState, face, row, col) {
    const config = CUBE_CONFIGS[cubeState.cubeType];
    const index = gridToIndex(config.size, row, col);
    return cubeState.faces[face][index];
}

/**
 * Set facelet at specific grid position
 * @param {CubeState} cubeState - Cube state (will be modified)
 * @param {string} face - Face name (U, L, F, R, B, D)
 * @param {number} row - Row coordinate
 * @param {number} col - Column coordinate
 * @param {string} color - Color to set
 */
export function setFaceletAt(cubeState, face, row, col, color) {
    const config = CUBE_CONFIGS[cubeState.cubeType];
    const index = gridToIndex(config.size, row, col);
    cubeState.faces[face][index] = color;
}

// ========================= CUBE METADATA UTILITIES =========================

/**
 * Get cube configuration for a cube type
 * @param {string} cubeType - Type of cube (2x2x2, 3x3x3, 4x4x4)
 * @returns {CubeConfig} Cube configuration
 */
export function getCubeConfig(cubeType) {
    const config = CUBE_CONFIGS[cubeType];
    if (!config) {
        throw new Error(`Invalid cube type: ${cubeType}`);
    }
    return config;
}

/**
 * Check if a cube type is valid
 * @param {string} cubeType - Type to check
 * @returns {boolean} True if valid cube type
 */
export function isValidCubeType(cubeType) {
    return cubeType in CUBE_CONFIGS;
}

/**
 * Get all supported cube types
 * @returns {string[]} Array of supported cube types
 */
export function getSupportedCubeTypes() {
    return Object.keys(CUBE_CONFIGS);
}

/**
 * Get cube type from total facelet count
 * @param {number} totalFacelets - Total number of facelets
 * @returns {string|null} Cube type or null if not found
 */
export function getCubeTypeFromFacelets(totalFacelets) {
    for (const [cubeType, config] of Object.entries(CUBE_CONFIGS)) {
        if (config.totalFacelets === totalFacelets) {
            return cubeType;
        }
    }
    return null;
}

// ========================= DATA CONVERSION HELPERS =========================

/**
 * Serialize cube state to JSON string
 * @param {Object} cubeState - Cube state to serialize
 * @returns {string} JSON representation of cube state
 */
export function serializeCubeState(cubeState) {
    return JSON.stringify(cubeState, null, 2);
}

/**
 * Deserialize cube state from JSON string
 * @param {string} jsonString - JSON string to deserialize
 * @returns {Object} Parsed cube state object
 */
export function deserializeCubeState(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        
        // Validate basic structure
        if (!parsed.cubeType || !parsed.faces) {
            throw new Error('Invalid cube state format');
        }
        
        return parsed;
    } catch (error) {
        throw new Error(`Failed to deserialize cube state: ${error.message}`);
    }
}

/**
 * Convert cube state to flat array format (all faces concatenated)
 * @param {Object} cubeState - Cube state to convert
 * @param {string[]} faceOrder - Face order for concatenation (default: U,L,F,R,B,D)
 * @returns {string[]} Flat array of all facelets
 */
export function cubeStateToFlatArray(cubeState, faceOrder = FACE_NAMES) {
    const result = [];
    
    for (const face of faceOrder) {
        if (cubeState.faces[face]) {
            result.push(...cubeState.faces[face]);
        }
    }
    
    return result;
}

/**
 * Convert flat array to cube state format
 * @param {string[]} flatArray - Flat array of facelets
 * @param {string} cubeType - Type of cube to create
 * @param {string[]} faceOrder - Face order used in flat array (default: U,L,F,R,B,D)
 * @returns {Object} Cube state object
 */
export function flatArrayToCubeState(flatArray, cubeType, faceOrder = FACE_NAMES) {
    const config = getCubeConfig(cubeType);
    const expectedLength = config.totalFacelets;
    
    if (flatArray.length !== expectedLength) {
        throw new Error(`Flat array length ${flatArray.length} does not match expected length ${expectedLength} for ${cubeType}`);
    }
    
    const cubeState = {
        cubeType: cubeType,
        faces: {}
    };
    
    let index = 0;
    for (const face of faceOrder) {
        cubeState.faces[face] = flatArray.slice(index, index + config.faceletsPerFace);
        index += config.faceletsPerFace;
    }
    
    return cubeState;
}

/**
 * Convert cube state to compact string notation (one character per facelet)
 * @param {Object} cubeState - Cube state to convert
 * @returns {string} Compact string representation
 */
export function cubeStateToCompactString(cubeState) {
    const flatArray = cubeStateToFlatArray(cubeState);
    return flatArray.join('');
}

/**
 * Convert compact string notation to cube state
 * @param {string} compactString - Compact string to parse
 * @param {string} cubeType - Type of cube to create
 * @returns {Object} Cube state object
 */
export function compactStringToCubeState(compactString, cubeType) {
    const flatArray = compactString.split('');
    return flatArrayToCubeState(flatArray, cubeType);
}

// ========================= PIECE EXTRACTION UTILITIES =========================

/**
 * Extract corner pieces from cube state
 * Corner positions vary by cube type
 * @param {Object} cubeState - Cube state to analyze
 * @returns {Object} Corner piece data
 */
export function extractCornerPieces(cubeState) {
    const config = getCubeConfig(cubeState.cubeType);
    const corners = {};
    
    // Corner positions by cube type (0-indexed)
    const cornerMaps = {
        '2x2x2': {
            // All pieces are corners in 2x2x2
            'UFR': [['U', 0], ['F', 1], ['R', 0]], // Top-front-right
            'UFL': [['U', 1], ['F', 0], ['L', 1]], // Top-front-left  
            'UBR': [['U', 3], ['B', 0], ['R', 1]], // Top-back-right
            'UBL': [['U', 2], ['B', 1], ['L', 0]], // Top-back-left
            'DFR': [['D', 1], ['F', 3], ['R', 2]], // Bottom-front-right
            'DFL': [['D', 0], ['F', 2], ['L', 3]], // Bottom-front-left
            'DBR': [['D', 2], ['B', 3], ['R', 3]], // Bottom-back-right
            'DBL': [['D', 3], ['B', 2], ['L', 2]]  // Bottom-back-left
        },
        '3x3x3': {
            'UFR': [['U', 2], ['F', 2], ['R', 0]], // Top-front-right
            'UFL': [['U', 0], ['F', 0], ['L', 2]], // Top-front-left
            'UBR': [['U', 8], ['B', 0], ['R', 2]], // Top-back-right
            'UBL': [['U', 6], ['B', 2], ['L', 0]], // Top-back-left
            'DFR': [['D', 2], ['F', 8], ['R', 6]], // Bottom-front-right
            'DFL': [['D', 0], ['F', 6], ['L', 8]], // Bottom-front-left
            'DBR': [['D', 8], ['B', 6], ['R', 8]], // Bottom-back-right
            'DBL': [['D', 6], ['B', 8], ['L', 6]]  // Bottom-back-left
        },
        '4x4x4': {
            'UFR': [['U', 3], ['F', 3], ['R', 0]], // Top-front-right
            'UFL': [['U', 0], ['F', 0], ['L', 3]], // Top-front-left
            'UBR': [['U', 15], ['B', 0], ['R', 3]], // Top-back-right
            'UBL': [['U', 12], ['B', 3], ['L', 0]], // Top-back-left
            'DFR': [['D', 3], ['F', 15], ['R', 12]], // Bottom-front-right
            'DFL': [['D', 0], ['F', 12], ['L', 15]], // Bottom-front-left
            'DBR': [['D', 15], ['B', 12], ['R', 15]], // Bottom-back-right
            'DBL': [['D', 12], ['B', 15], ['L', 12]]  // Bottom-back-left
        }
    };
    
    const cornerMap = cornerMaps[cubeState.cubeType];
    if (!cornerMap) {
        throw new Error(`Corner extraction not supported for ${cubeState.cubeType}`);
    }
    
    for (const [cornerName, positions] of Object.entries(cornerMap)) {
        corners[cornerName] = positions.map(([face, index]) => ({
            face: face,
            index: index,
            color: cubeState.faces[face][index]
        }));
    }
    
    return corners;
}

/**
 * Extract center pieces from cube state  
 * @param {Object} cubeState - Cube state to analyze
 * @returns {Object} Center piece data
 */
export function extractCenterPieces(cubeState) {
    const centers = {};
    
    if (cubeState.cubeType === '3x3x3') {
        // 3x3x3 has single center per face (index 4)
        for (const face of FACE_NAMES) {
            centers[face] = {
                face: face,
                index: 4,
                color: cubeState.faces[face][4]
            };
        }
    } else if (cubeState.cubeType === '4x4x4') {
        // 4x4x4 has 2x2 center blocks (indices 5,6,9,10)
        const centerIndices = [5, 6, 9, 10];
        for (const face of FACE_NAMES) {
            centers[face] = centerIndices.map(index => ({
                face: face,
                index: index,
                color: cubeState.faces[face][index]
            }));
        }
    } else if (cubeState.cubeType === '2x2x2') {
        // 2x2x2 has no fixed centers
        return {};
    }
    
    return centers;
}

/**
 * Extract edge pieces from cube state
 * @param {Object} cubeState - Cube state to analyze  
 * @returns {Object} Edge piece data
 */
export function extractEdgePieces(cubeState) {
    const edges = {};
    
    // Edge positions by cube type
    const edgeMaps = {
        '3x3x3': {
            'UF': [['U', 1], ['F', 1]], // Top-front
            'UR': [['U', 5], ['R', 1]], // Top-right
            'UB': [['U', 7], ['B', 1]], // Top-back
            'UL': [['U', 3], ['L', 1]], // Top-left
            'DF': [['D', 1], ['F', 7]], // Bottom-front
            'DR': [['D', 5], ['R', 7]], // Bottom-right
            'DB': [['D', 7], ['B', 7]], // Bottom-back
            'DL': [['D', 3], ['L', 7]], // Bottom-left
            'FR': [['F', 5], ['R', 3]], // Front-right
            'FL': [['F', 3], ['L', 5]], // Front-left
            'BR': [['B', 3], ['R', 5]], // Back-right
            'BL': [['B', 5], ['L', 3]]  // Back-left
        },
        '4x4x4': {
            // 4x4x4 has wing pieces (dedges) - simplified extraction
            'UF1': [['U', 1], ['F', 1]], // Top-front wing 1
            'UF2': [['U', 2], ['F', 2]], // Top-front wing 2
            'UR1': [['U', 7], ['R', 1]], // Top-right wing 1
            'UR2': [['U', 11], ['R', 2]], // Top-right wing 2
            // ... (more wing pieces would be defined)
        }
    };
    
    const edgeMap = edgeMaps[cubeState.cubeType];
    if (!edgeMap) {
        return {}; // No edges for 2x2x2, or not implemented for this cube type
    }
    
    for (const [edgeName, positions] of Object.entries(edgeMap)) {
        edges[edgeName] = positions.map(([face, index]) => ({
            face: face,
            index: index,
            color: cubeState.faces[face][index]
        }));
    }
    
    return edges;
}

// ========================= COORDINATE SYSTEM CONVERSIONS =========================

/**
 * Convert between different coordinate systems for cube representation
 * @param {Object} cubeState - Cube state to convert
 * @param {string} targetFormat - Target coordinate format ('kociemba', 'standard', 'solver')
 * @returns {Object} Converted cube state
 */
export function convertCoordinateSystem(cubeState, targetFormat) {
    // Placeholder for coordinate system conversions
    // This would implement conversions for different solver formats
    // (e.g., Kociemba notation, different face orientations, etc.)
    
    switch (targetFormat) {
        case 'kociemba':
            // Convert to Kociemba solver format
            return convertToKociembaFormat(cubeState);
        case 'standard':
            // Already in standard format
            return cloneCubeState(cubeState);
        default:
            throw new Error(`Unsupported coordinate system: ${targetFormat}`);
    }
}

/**
 * Convert cube state to Kociemba solver format (placeholder)
 * @param {Object} cubeState - Cube state to convert
 * @returns {Object} Kociemba-formatted cube state
 */
function convertToKociembaFormat(cubeState) {
    // This would implement specific conversion logic for Kociemba notation
    // For now, return cloned standard format
    return cloneCubeState(cubeState);
}

// ========================= VALIDATION HELPERS =========================

/**
 * Deep compare two cube states for equality
 * @param {Object} cubeState1 - First cube state
 * @param {Object} cubeState2 - Second cube state
 * @returns {boolean} True if cube states are identical
 */
export function compareCubeStates(cubeState1, cubeState2) {
    if (cubeState1.cubeType !== cubeState2.cubeType) {
        return false;
    }
    
    for (const face of FACE_NAMES) {
        const face1 = cubeState1.faces[face];
        const face2 = cubeState2.faces[face];
        
        if (!face1 || !face2 || face1.length !== face2.length) {
            return false;
        }
        
        for (let i = 0; i < face1.length; i++) {
            if (face1[i] !== face2[i]) {
                return false;
            }
        }
    }
    
    return true;
}

/**
 * Calculate difference between two cube states
 * @param {Object} cubeState1 - First cube state
 * @param {Object} cubeState2 - Second cube state
 * @returns {Object} Difference analysis
 */
export function calculateCubeStateDifference(cubeState1, cubeState2) {
    const differences = [];
    let totalDifferences = 0;
    
    if (cubeState1.cubeType !== cubeState2.cubeType) {
        return {
            compatible: false,
            reason: 'Different cube types',
            cubeType1: cubeState1.cubeType,
            cubeType2: cubeState2.cubeType
        };
    }
    
    for (const face of FACE_NAMES) {
        const face1 = cubeState1.faces[face];
        const face2 = cubeState2.faces[face];
        
        for (let i = 0; i < face1.length; i++) {
            if (face1[i] !== face2[i]) {
                differences.push({
                    face: face,
                    index: i,
                    color1: face1[i],
                    color2: face2[i]
                });
                totalDifferences++;
            }
        }
    }
    
    return {
        compatible: true,
        totalDifferences: totalDifferences,
        differences: differences,
        percentDifferent: (totalDifferences / getCubeConfig(cubeState1.cubeType).totalFacelets) * 100
    };
}

// ========================= SCRAMBLING UTILITIES =========================

/**
 * Apply a sequence of moves to a cube state (placeholder)
 * @param {Object} cubeState - Initial cube state
 * @param {string[]} moves - Array of move notations
 * @returns {Object} Cube state after applying moves
 */
export function applyMoveSequence(cubeState, moves) {
    // Placeholder for move application logic
    // This would implement actual cube move mechanics
    console.warn('applyMoveSequence not yet implemented');
    return cloneCubeState(cubeState);
}

/**
 * Generate a scrambled cube state (placeholder)
 * @param {string} cubeType - Type of cube to scramble
 * @param {number} moveCount - Number of scramble moves (default: 20)
 * @returns {Object} Scrambled cube state
 */
export function generateScrambledCube(cubeType, moveCount = 20) {
    // Placeholder for scrambling logic
    // This would generate random valid scrambles
    console.warn('generateScrambledCube not yet implemented');
    return createSolvedCube(cubeType);
}

// ========================= EXPORTS =========================

export default {
    // Configuration
    CUBE_CONFIGS,
    CUBE_COLORS,
    VALID_COLORS,
    FACE_NAMES,
    FACE_RELATIONSHIPS,
    
    // Factory functions
    createSolvedCube,
    createEmptyCube,
    createCubeFromArray,
    
    // Conversion utilities
    cloneCubeState,
    cubeStateToArray,
    cubeStateToString,
    
    // Indexing utilities
    gridToIndex,
    indexToGrid,
    getFaceletAt,
    setFaceletAt,
    
    // Metadata utilities
    getCubeConfig,
    isValidCubeType,
    getSupportedCubeTypes,
    getCubeTypeFromFacelets,
    
    // Data conversion helpers
    serializeCubeState,
    deserializeCubeState,
    cubeStateToFlatArray,
    flatArrayToCubeState,
    cubeStateToCompactString,
    compactStringToCubeState,
    
    // Piece extraction utilities
    extractCornerPieces,
    extractCenterPieces,
    extractEdgePieces,
    
    // Coordinate system conversions
    convertCoordinateSystem,
    
    // Validation helpers
    compareCubeStates,
    calculateCubeStateDifference,
    
    // Scrambling utilities (placeholders)
    applyMoveSequence,
    generateScrambledCube
};