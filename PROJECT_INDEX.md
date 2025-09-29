# Project Index (Auto-Generated)

Date: 2025-09-29

## Overview
Monorepo style structure (frontend + backend) focusing currently on backend CFOP (Cross, F2L, OLL, PLL) 3x3x3 solver with experimental tooling to obtain 100% success rate.

## Backend Key Domains
- services/solver3x3x3.js: Monolithic CFOP implementation (~3.2K LOC) including:
  - Move parsing & application (face + slice + rotations)
  - Cross detection & solving
  - F2L detection (simplified) & partial solving heuristics
  - OLL pattern extraction, rotation handling, matching and solving loop with safety (stagnation + integrity signature)
  - PLL permutation extraction, rotation handling, matching and solving loop
  - Integrity utilities (makeF2LSignature / verifyF2LIntegrity)
  - Dynamic OLL case registration (registerOLLCase)
  - Complete CFOP pipeline (solveCube3x3) with phase logging

- utils/cubeStructures.js (not read yet here): Cube creation & data shape helpers
- utils/ollUnknownLogger.js: Persistent logging of unknown OLL patterns to backend/logs/oll-unknown.json
- utils/ollPatternMining.js: Reverse mining (derive candidate start patterns by inverting safe OLL algs)
- search/ollSearch.js: Iterative deepening DFS scaffold (needs synthetic start states upgrade)

## OLL Data Flow
1. Pattern acquisition: getOLLPattern (8-bit orientation string)
2. Matching: matchOLLPattern (rotations + enabled filter)
3. Solving loop: solveOLL
   - Tracks orientation progress & stagnation
   - Logs unknown patterns via recordUnknownOLL
   - Applies fallback/emergency pools
   - Integrity rollback for unverified attempts
4. New case promotion: registerOLLCase (replaces placeholder or appends)
5. Mining/Search attempt to populate missing algorithms

## Experimental / TODO Areas
- Synthetic state generator for arbitrary target OLL patterns
- Rotation canonicalization for pattern clustering
- Candidate validation harness (F2L preservation + orientation completion)
- Automated insertion of validated algorithms + provenance registry (proposed file backend/data/oll-derived.json)
- Enhanced PLL reliability & pruning (post OLL completeness milestone)

## Logging & Metrics
- Unknown OLL patterns stored with occurrences & sample cube snapshots
- Success rate measured by test-success-rate.js (not enumerated here, but present)

## Frontend (Currently Minimal in Context)
- Vite + React skeleton (components/, services/, utils/). 3D cube rendering part not yet indexed; focus is backend algorithm maturity.

## Newly Added During Indexing Session
- registerOLLCase helper added to solver3x3x3.js to allow runtime promotion of discovered OLL algorithms.
- This PROJECT_INDEX.md file created for broad context reference.

## Next Recommended Implementation Steps
1. Implement synthetic OLL start state generator (guided orientation scrambling without disturbing F2L baseline).
2. Integrate generator into search/ollSearch.js (replace solved cube root) + add pruning heuristics.
3. Extend mining with additional safe alg variants (conjugates / mirrors) & rotation canonicalization.
4. Build candidate validator: apply alg on logged sample state -> assert: (a) OLL complete, (b) F2L signature unchanged, (c) no regression of oriented pieces relative to sample.
5. Auto-promote first validated algorithm for each placeholder (901–904) using registerOLLCase, persist provenance.
6. Re-run success harness; iterate until 100%.

---
(End of index)
