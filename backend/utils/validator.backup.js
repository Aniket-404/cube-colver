/**
 * Cube State Validation Utilities
 * 
 * This module provides validation functions for different Rubik's cube types.
 * Each cube type has specific constraints regarding facelet counts, color distribu    return errors;
}

// ========================= 4x4x4 SPECIFIC VALIDATION =========================

/**
 * Validate color distribution for 4x4x4 cube
 * @param {Object} cubeState - Cube state to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateColorDistribution4x4x4(cubeState) {
    const errors = [];
    
    // Validate basic structure first
    const basicErrors = validateColors(cubeState);
    if (basicErrors.length > 0) {
        return basicErrors;
    }

    const config = CUBE_CONFIGS['4x4x4'];
    const colorCounts = countColors(cubeState);

    // Check each color has exactly 16 facelets
    const wrongCounts = [];
    for (const color of VALID_COLORS) {
        const count = colorCounts[color];
        if (count !== config.colorsPerType) {
            wrongCounts.push({
                color,
                expected: config.colorsPerType,
                actual: count,
                difference: count - config.colorsPerType
            });
        }
    }

    if (wrongCounts.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_COLOR_DISTRIBUTION,
            message: `4x4x4 cube must have exactly ${config.colorsPerType} of each color`,
            details: {
                cubeType: '4x4x4',
                expectedPerColor: config.colorsPerType,
                wrongCounts,
                totalFacelets: config.totalFacelets,
                actualTotal: Object.values(colorCounts).reduce((sum, count) => sum + count, 0)
            }
        });
    }

    return errors;
}

/**
 * Validate center blocks for 4x4x4 cube
 * 4x4x4 cubes have 2x2 center blocks (indices 5,6,9,10 in a 4x4 grid)
 * @param {Object} cubeState - Cube state to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateCenters4x4x4(cubeState) {
    const errors = [];
    
    // 4x4x4 center positions (2x2 block in middle of 4x4 grid)
    // Grid layout:  0  1  2  3
    //              4  5  6  7
    //              8  9 10 11
    //             12 13 14 15
    // Center indices: 5, 6, 9, 10
    const centerIndices = [5, 6, 9, 10];
    
    // Extract center blocks for each face
    const centerBlocks = {};
    for (const face of FACE_NAMES) {
        centerBlocks[face] = centerIndices.map(index => cubeState.faces[face][index]);
    }

    // Validate each face's center block has all same color
    const invalidCenterBlocks = [];
    for (const [face, centers] of Object.entries(centerBlocks)) {
        const uniqueColors = new Set(centers);
        if (uniqueColors.size !== 1) {
            invalidCenterBlocks.push({
                face,
                centers,
                uniqueColorCount: uniqueColors.size,
                colors: Array.from(uniqueColors)
            });
        }
    }

    if (invalidCenterBlocks.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_COLOR_DISTRIBUTION,
            message: '4x4x4 cube center blocks must be uniform (all 4 center pieces same color)',
            details: {
                invalidCenterBlocks,
                centerPositions: centerIndices,
                expectedUniformity: '4 pieces per center block should be same color'
            }
        });
    }

    // Check that all faces have different center colors
    const faceColors = {};
    const validCenterBlocks = [];
    
    for (const [face, centers] of Object.entries(centerBlocks)) {
        const uniqueColors = new Set(centers);
        if (uniqueColors.size === 1) {
            const centerColor = centers[0];
            faceColors[face] = centerColor;
            validCenterBlocks.push(face);
        }
    }

    // Check for duplicate center colors across faces
    if (validCenterBlocks.length > 1) {
        const colorToFaces = {};
        for (const [face, color] of Object.entries(faceColors)) {
            if (!colorToFaces[color]) {
                colorToFaces[color] = [];
            }
            colorToFaces[color].push(face);
        }

        const duplicateCenters = [];
        for (const [color, faces] of Object.entries(colorToFaces)) {
            if (faces.length > 1) {
                duplicateCenters.push({ color, faces });
            }
        }

        if (duplicateCenters.length > 0) {
            errors.push({
                type: VALIDATION_ERRORS.INVALID_COLOR_DISTRIBUTION,
                message: '4x4x4 cube center blocks must all be different colors',
                details: {
                    duplicateCenters,
                    faceColors,
                    validCenterBlocks
                }
            });
        }
    }

    // Validate center colors are valid
    const invalidCenterColors = [];
    for (const [face, centers] of Object.entries(centerBlocks)) {
        for (let i = 0; i < centers.length; i++) {
            const color = centers[i];
            if (color && !VALID_COLORS.includes(color)) {
                invalidCenterColors.push({ 
                    face, 
                    position: centerIndices[i], 
                    color 
                });
            }
        }
    }
    
    if (invalidCenterColors.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_COLOR,
            message: '4x4x4 cube center blocks have invalid colors',
            details: {
                invalidCenterColors,
                validColors: VALID_COLORS
            }
        });
    }

    return errors;
}

/**
 * Complete validation for 4x4x4 cube
 * @param {Object} cubeState - Cube state to validate
 * @returns {Object} Validation result with success flag and errors
 */
export function validate4x4x4(cubeState) {
    const errors = [];

    // Step 1: Validate cube type
    if (!cubeState || cubeState.cubeType !== '4x4x4') {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_CUBE_TYPE,
            message: 'Expected 4x4x4 cube type',
            details: { 
                expected: '4x4x4',
                received: cubeState?.cubeType
            }
        });
        return {
            isValid: false,
            errors,
            cubeType: '4x4x4'
        };
    }

    // Step 2: Validate structure
    errors.push(...validateCubeStructure(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '4x4x4'
        };
    }

    // Step 3: Validate facelet counts
    errors.push(...validateFaceletCount(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '4x4x4'
        };
    }

    // Step 4: Validate colors
    errors.push(...validateColors(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '4x4x4'
        };
    }

    // Step 5: Validate color distribution
    errors.push(...validateColorDistribution4x4x4(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '4x4x4'
        };
    }

    // Step 6: Validate center blocks (4x4x4 specific)
    errors.push(...validateCenters4x4x4(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '4x4x4'
        };
    }

    // Extract center block colors for summary
    const centerIndices = [5, 6, 9, 10];
    const centerBlocks = {};
    for (const face of FACE_NAMES) {
        const centers = centerIndices.map(index => cubeState.faces[face][index]);
        centerBlocks[face] = centers[0]; // All should be same color, so take first
    }

    return {
        isValid: true,
        errors: [],
        cubeType: '4x4x4',
        summary: {
            totalFacelets: CUBE_CONFIGS['4x4x4'].totalFacelets,
            colorsPerType: CUBE_CONFIGS['4x4x4'].colorsPerType,
            colorDistribution: countColors(cubeState),
            centerBlocks: centerBlocks,
            centerPositions: centerIndices
        }
    };
}

// ========================= 2x2x2 SPECIFIC VALIDATION =========================
    CUBE_CONFIGS,
    VALID_COLORS,
    FACE_NAMES,
    getCubeConfig,
    isValidCubeType
} from './cubeStructures.js';

// ========================= VALIDATION ERROR TYPES =========================

/**
 * @typedef {Object} ValidationError
 * @property {string} type - Type of validation error
 * @property {string} message - Human-readable error message
 * @property {any} details - Additional error details
 */

/**
 * Validation error types
 */
export const VALIDATION_ERRORS = {
    INVALID_CUBE_TYPE: 'INVALID_CUBE_TYPE',
    INVALID_STRUCTURE: 'INVALID_STRUCTURE', 
    INVALID_FACELET_COUNT: 'INVALID_FACELET_COUNT',
    INVALID_COLOR: 'INVALID_COLOR',
    INVALID_COLOR_DISTRIBUTION: 'INVALID_COLOR_DISTRIBUTION',
    MISSING_FACES: 'MISSING_FACES',
    EMPTY_FACELETS: 'EMPTY_FACELETS',
    UNSOLVABLE_STATE: 'UNSOLVABLE_STATE'
};

// ========================= BASIC STRUCTURE VALIDATION =========================

/**
 * Validate basic cube state structure
 * @param {any} cubeState - Object to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateCubeStructure(cubeState) {
    const errors = [];

    // Check if cubeState is an object
    if (!cubeState || typeof cubeState !== 'object') {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_STRUCTURE,
            message: 'Cube state must be an object',
            details: { received: typeof cubeState }
        });
        return errors;
    }

    // Check if cubeType exists and is valid
    if (!cubeState.cubeType) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_CUBE_TYPE,
            message: 'Cube state must have a cubeType property',
            details: { cubeState }
        });
    } else if (!isValidCubeType(cubeState.cubeType)) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_CUBE_TYPE,
            message: `Invalid cube type: ${cubeState.cubeType}`,
            details: { 
                received: cubeState.cubeType,
                valid: Object.keys(CUBE_CONFIGS)
            }
        });
    }

    // Check if faces object exists
    if (!cubeState.faces || typeof cubeState.faces !== 'object') {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_STRUCTURE,
            message: 'Cube state must have a faces object',
            details: { faces: cubeState.faces }
        });
        return errors;
    }

    // Check if all required faces are present
    const missingFaces = FACE_NAMES.filter(face => !(face in cubeState.faces));
    if (missingFaces.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.MISSING_FACES,
            message: `Missing required faces: ${missingFaces.join(', ')}`,
            details: { 
                missing: missingFaces,
                required: FACE_NAMES,
                present: Object.keys(cubeState.faces)
            }
        });
    }

    return errors;
}

/**
 * Validate facelet count for a specific cube type
 * @param {Object} cubeState - Cube state to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateFaceletCount(cubeState) {
    const errors = [];
    
    // First validate structure
    const structureErrors = validateCubeStructure(cubeState);
    if (structureErrors.length > 0) {
        return structureErrors;
    }

    const config = getCubeConfig(cubeState.cubeType);

    // Check each face has correct number of facelets
    for (const face of FACE_NAMES) {
        const facelets = cubeState.faces[face];
        
        if (!Array.isArray(facelets)) {
            errors.push({
                type: VALIDATION_ERRORS.INVALID_STRUCTURE,
                message: `Face ${face} must be an array`,
                details: { face, received: typeof facelets }
            });
            continue;
        }

        if (facelets.length !== config.faceletsPerFace) {
            errors.push({
                type: VALIDATION_ERRORS.INVALID_FACELET_COUNT,
                message: `Face ${face} has incorrect facelet count for ${cubeState.cubeType}`,
                details: {
                    face,
                    cubeType: cubeState.cubeType,
                    expected: config.faceletsPerFace,
                    received: facelets.length
                }
            });
        }
    }

    return errors;
}

/**
 * Validate color values in cube state
 * @param {Object} cubeState - Cube state to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateColors(cubeState) {
    const errors = [];

    // First validate structure and counts
    const structureErrors = validateFaceletCount(cubeState);
    if (structureErrors.length > 0) {
        return structureErrors;
    }

    const emptyFacelets = [];
    const invalidColors = [];

    // Check each facelet for valid colors
    for (const face of FACE_NAMES) {
        const facelets = cubeState.faces[face];
        
        for (let i = 0; i < facelets.length; i++) {
            const color = facelets[i];
            
            if (color === '' || color === null || color === undefined) {
                emptyFacelets.push(`${face}[${i}]`);
            } else if (!VALID_COLORS.includes(color)) {
                invalidColors.push({
                    position: `${face}[${i}]`,
                    color: color
                });
            }
        }
    }

    // Report empty facelets
    if (emptyFacelets.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.EMPTY_FACELETS,
            message: `Found ${emptyFacelets.length} empty facelets`,
            details: {
                count: emptyFacelets.length,
                positions: emptyFacelets
            }
        });
    }

    // Report invalid colors
    if (invalidColors.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_COLOR,
            message: `Found ${invalidColors.length} invalid colors`,
            details: {
                invalid: invalidColors,
                validColors: VALID_COLORS
            }
        });
    }

    return errors;
}

// ========================= 3x3x3 SPECIFIC VALIDATION =========================

/**
 * Validate color distribution for 3x3x3 cube
 * @param {Object} cubeState - Cube state to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateColorDistribution3x3x3(cubeState) {
    const errors = [];
    
    // Validate basic structure first
    const basicErrors = validateColors(cubeState);
    if (basicErrors.length > 0) {
        return basicErrors;
    }

    const config = CUBE_CONFIGS['3x3x3'];
    const colorCounts = countColors(cubeState);

    // Check each color has exactly 9 facelets
    const wrongCounts = [];
    for (const color of VALID_COLORS) {
        const count = colorCounts[color];
        if (count !== config.colorsPerType) {
            wrongCounts.push({
                color,
                expected: config.colorsPerType,
                actual: count,
                difference: count - config.colorsPerType
            });
        }
    }

    if (wrongCounts.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_COLOR_DISTRIBUTION,
            message: `3x3x3 cube must have exactly ${config.colorsPerType} of each color`,
            details: {
                cubeType: '3x3x3',
                expectedPerColor: config.colorsPerType,
                wrongCounts,
                totalFacelets: config.totalFacelets,
                actualTotal: Object.values(colorCounts).reduce((sum, count) => sum + count, 0)
            }
        });
    }

    return errors;
}

/**
 * Validate center pieces for 3x3x3 cube
 * Centers should maintain their relative positions for solvability
 * @param {Object} cubeState - Cube state to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateCenters3x3x3(cubeState) {
    const errors = [];
    
    // Get center positions (index 4 for 3x3x3 - middle of 9-facelet face)
    const centers = {};
    for (const face of FACE_NAMES) {
        const centerIndex = 4; // Middle facelet in 3x3 grid (0-8, center is 4)
        centers[face] = cubeState.faces[face][centerIndex];
    }

    // Check that centers are all different colors
    const centerColors = Object.values(centers);
    const uniqueColors = new Set(centerColors);
    
    if (uniqueColors.size !== 6) {
        const duplicateCenters = [];
        const colorCount = {};
        
        for (const [face, color] of Object.entries(centers)) {
            if (!colorCount[color]) {
                colorCount[color] = [];
            }
            colorCount[color].push(face);
        }
        
        for (const [color, faces] of Object.entries(colorCount)) {
            if (faces.length > 1) {
                duplicateCenters.push({ color, faces });
            }
        }
        
        errors.push({
            type: VALIDATION_ERRORS.INVALID_COLOR_DISTRIBUTION,
            message: '3x3x3 cube centers must all be different colors',
            details: {
                centers,
                duplicateCenters,
                uniqueColorCount: uniqueColors.size,
                expectedUniqueColors: 6
            }
        });
    }

    // Validate center colors are valid
    const invalidCenters = [];
    for (const [face, color] of Object.entries(centers)) {
        if (!VALID_COLORS.includes(color)) {
            invalidCenters.push({ face, color });
        }
    }
    
    if (invalidCenters.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_COLOR,
            message: '3x3x3 cube centers have invalid colors',
            details: {
                invalidCenters,
                validColors: VALID_COLORS
            }
        });
    }

    return errors;
}

/**
 * Complete validation for 3x3x3 cube
 * @param {Object} cubeState - Cube state to validate
 * @returns {Object} Validation result with success flag and errors
 */
export function validate3x3x3(cubeState) {
    const errors = [];

    // Step 1: Validate cube type
    if (!cubeState || cubeState.cubeType !== '3x3x3') {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_CUBE_TYPE,
            message: 'Expected 3x3x3 cube type',
            details: { 
                expected: '3x3x3',
                received: cubeState?.cubeType
            }
        });
        return {
            isValid: false,
            errors,
            cubeType: '3x3x3'
        };
    }

    // Step 2: Validate structure
    errors.push(...validateCubeStructure(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '3x3x3'
        };
    }

    // Step 3: Validate facelet counts
    errors.push(...validateFaceletCount(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '3x3x3'
        };
    }

    // Step 4: Validate colors
    errors.push(...validateColors(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '3x3x3'
        };
    }

    // Step 5: Validate color distribution
    errors.push(...validateColorDistribution3x3x3(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '3x3x3'
        };
    }

    // Step 6: Validate centers (3x3x3 specific)
    errors.push(...validateCenters3x3x3(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '3x3x3'
        };
    }

    return {
        isValid: true,
        errors: [],
        cubeType: '3x3x3',
        summary: {
            totalFacelets: CUBE_CONFIGS['3x3x3'].totalFacelets,
            colorsPerType: CUBE_CONFIGS['3x3x3'].colorsPerType,
            colorDistribution: countColors(cubeState),
            centers: {
                U: cubeState.faces.U[4],
                L: cubeState.faces.L[4], 
                F: cubeState.faces.F[4],
                R: cubeState.faces.R[4],
                B: cubeState.faces.B[4],
                D: cubeState.faces.D[4]
            }
        }
    };
}

// ========================= 2x2x2 SPECIFIC VALIDATION =========================

/**
 * Count color distribution in cube state
 * @param {Object} cubeState - Cube state to analyze
 * @returns {Object} Color count mapping
 */
function countColors(cubeState) {
    const colorCounts = {};
    
    // Initialize counts
    for (const color of VALID_COLORS) {
        colorCounts[color] = 0;
    }

    // Count each facelet
    for (const face of FACE_NAMES) {
        for (const color of cubeState.faces[face]) {
            if (color && VALID_COLORS.includes(color)) {
                colorCounts[color]++;
            }
        }
    }

    return colorCounts;
}

/**
 * Validate color distribution for 2x2x2 cube
 * @param {Object} cubeState - Cube state to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export function validateColorDistribution2x2x2(cubeState) {
    const errors = [];
    
    // Validate basic structure first
    const basicErrors = validateColors(cubeState);
    if (basicErrors.length > 0) {
        return basicErrors;
    }

    const config = CUBE_CONFIGS['2x2x2'];
    const colorCounts = countColors(cubeState);

    // Check each color has exactly 4 facelets
    const wrongCounts = [];
    for (const color of VALID_COLORS) {
        const count = colorCounts[color];
        if (count !== config.colorsPerType) {
            wrongCounts.push({
                color,
                expected: config.colorsPerType,
                actual: count,
                difference: count - config.colorsPerType
            });
        }
    }

    if (wrongCounts.length > 0) {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_COLOR_DISTRIBUTION,
            message: `2x2x2 cube must have exactly ${config.colorsPerType} of each color`,
            details: {
                cubeType: '2x2x2',
                expectedPerColor: config.colorsPerType,
                wrongCounts,
                totalFacelets: config.totalFacelets,
                actualTotal: Object.values(colorCounts).reduce((sum, count) => sum + count, 0)
            }
        });
    }

    return errors;
}

/**
 * Complete validation for 2x2x2 cube
 * @param {Object} cubeState - Cube state to validate
 * @returns {Object} Validation result with success flag and errors
 */
export function validate2x2x2(cubeState) {
    const errors = [];

    // Step 1: Validate cube type
    if (!cubeState || cubeState.cubeType !== '2x2x2') {
        errors.push({
            type: VALIDATION_ERRORS.INVALID_CUBE_TYPE,
            message: 'Expected 2x2x2 cube type',
            details: { 
                expected: '2x2x2',
                received: cubeState?.cubeType
            }
        });
        return {
            isValid: false,
            errors,
            cubeType: '2x2x2'
        };
    }

    // Step 2: Validate structure
    errors.push(...validateCubeStructure(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '2x2x2'
        };
    }

    // Step 3: Validate facelet counts
    errors.push(...validateFaceletCount(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '2x2x2'
        };
    }

    // Step 4: Validate colors
    errors.push(...validateColors(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '2x2x2'
        };
    }

    // Step 5: Validate color distribution
    errors.push(...validateColorDistribution2x2x2(cubeState));
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            cubeType: '2x2x2'
        };
    }

    return {
        isValid: true,
        errors: [],
        cubeType: '2x2x2',
        summary: {
            totalFacelets: CUBE_CONFIGS['2x2x2'].totalFacelets,
            colorsPerType: CUBE_CONFIGS['2x2x2'].colorsPerType,
            colorDistribution: countColors(cubeState)
        }
    };
}

// ========================= HELPER FUNCTIONS =========================

/**
 * Check if cube state is completely filled (no empty facelets)
 * @param {Object} cubeState - Cube state to check
 * @returns {boolean} True if all facelets are colored
 */
export function isCompletelyFilled(cubeState) {
    for (const face of FACE_NAMES) {
        if (!cubeState.faces[face]) continue;
        
        for (const color of cubeState.faces[face]) {
            if (!color || color === '' || !VALID_COLORS.includes(color)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Get validation summary for any cube type
 * @param {Object} cubeState - Cube state to summarize
 * @returns {Object} Validation summary
 */
export function getValidationSummary(cubeState) {
    const structureErrors = validateCubeStructure(cubeState);
    if (structureErrors.length > 0) {
        return {
            isValid: false,
            errors: structureErrors,
            cubeType: cubeState?.cubeType || 'unknown'
        };
    }

    // Route to appropriate validator based on cube type
    switch (cubeState.cubeType) {
        case '2x2x2':
            return validate2x2x2(cubeState);
        case '3x3x3':
            return validate3x3x3(cubeState);
        case '4x4x4':
            // Will be implemented in next task
            return {
                isValid: false,
                errors: [{
                    type: 'NOT_IMPLEMENTED', 
                    message: '4x4x4 validation not yet implemented'
                }],
                cubeType: '4x4x4'
            };
        default:
            return {
                isValid: false,
                errors: [{
                    type: VALIDATION_ERRORS.INVALID_CUBE_TYPE,
                    message: `Unsupported cube type: ${cubeState.cubeType}`
                }],
                cubeType: cubeState.cubeType
            };
    }
}

// ========================= EXPORTS =========================

export default {
    // Error types
    VALIDATION_ERRORS,
    
    // General validation functions
    validateCubeStructure,
    validateFaceletCount,
    validateColors,
    
    // 2x2x2 specific validation
    validateColorDistribution2x2x2,
    validate2x2x2,
    
    // 3x3x3 specific validation
    validateColorDistribution3x3x3,
    validateCenters3x3x3,
    validate3x3x3,
    
    // Helper functions
    isCompletelyFilled,
    getValidationSummary,
    countColors: countColors
};