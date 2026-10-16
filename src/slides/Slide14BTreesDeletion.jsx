import React, { useMemo } from 'react'
import BTreeEngineVisualizer from '../btree-engine/BTreeEngineVisualizer.jsx'
import { useBTreeAnimator, PHASES } from '../btree-engine/useBTreeAnimator.js'
import AnimationKeyboardHint from '../components/AnimationKeyboardHint.jsx'

export default function Slide14BTreesDeletion({ isActive, onRegisterAnimation }) {
  // Precompute verified B-Tree states enforcing degree t = 2 invariants
  const steps = useMemo(() => {
    // ════════════ TREE STATES ════════════

    // Base tree matching final verified tree of Slide 13:
    // Root [10, 20], children [5, 6, 7], [12, 17], [30]
    const state0 = {
      name: { id: 3, keys: ['10', '20'] },
      children: [
        { name: { id: 1, keys: ['5', '6', '7'] } },
        { name: { id: 2, keys: ['12', '17'] } },
        { name: { id: 4, keys: ['30'] } }
      ]
    }

    // After deleting 6 from left leaf [5, 6, 7] -> [5, 7] (Case A: Direct Leaf Removal)
    const stateAfter6 = {
      name: { id: 3, keys: ['10', '20'] },
      children: [
        { name: { id: 1, keys: ['5', '7'] } },
        { name: { id: 2, keys: ['12', '17'] } },
        { name: { id: 4, keys: ['30'] } }
      ]
    }

    // After deleting 30 by borrowing from left sibling [12, 17] (Case C: Sibling Borrowing)
    // Sibling 17 moves up to root, parent separator 20 moves down to right leaf [20]
    const stateAfterBorrow30 = {
      name: { id: 3, keys: ['10', '17'] },
      children: [
        { name: { id: 1, keys: ['5', '7'] } },
        { name: { id: 2, keys: ['12'] } },
        { name: { id: 4, keys: ['20'] } }
      ]
    }

    // Case B Stage 1: Predecessor 7 promoted to root replacing 10
    const stateCaseBStage1 = {
      name: { id: 3, keys: ['7', '17'] },
      children: [
        { name: { id: 1, keys: ['5', '7'] } },
        { name: { id: 2, keys: ['12'] } },
        { name: { id: 4, keys: ['20'] } }
      ]
    }

    // Case B Stage 2: Predecessor 7 removed from left child [5, 7] -> [5]
    const stateCaseBStage2 = {
      name: { id: 3, keys: ['7', '17'] },
      children: [
        { name: { id: 1, keys: ['5'] } },
        { name: { id: 2, keys: ['12'] } },
        { name: { id: 4, keys: ['20'] } }
      ]
    }

    // Case D: Deleting 20 from leaf [20]. Underflow! Sibling [12] cannot lend.
    // Separator 17 drops down and merges with [12] into [12, 17]. Root becomes [7].
    const stateAfterMerge = {
      name: { id: 3, keys: ['7'] },
      children: [
        { name: { id: 1, keys: ['5'] } },
        { name: { id: 2, keys: ['12', '17'] } }
      ]
    }

    // Case E: Root Collapse scenario.
    // Starting with Root [7], left [5], right [12].
    const statePreCollapse = {
      name: { id: 3, keys: ['7'] },
      children: [
        { name: { id: 1, keys: ['5'] } },
        { name: { id: 2, keys: ['12'] } }
      ]
    }

    // After collapse: merged child [7, 12] ascends to become the brand-new root!
    const statePostCollapse = {
      name: { id: 2, keys: ['7', '12'] }
    }

    return [
      // ════ STEP 1: SEARCH 17 — ROOT COMPARISON ════
      {
        id: 'search-17-root',
        name: 'Search 17 — Step 1: Inspect Root [10 | 20]',
        durations: { explain: 4000, execute: 3000, result: 4000 },
        treeBefore: state0,
        treeAfter: state0,
        explainTitle: 'SEARCH 17 — STEP 1: INSPECT ROOT [10 | 20]',
        explainText: 'Begin searching for key 17 at root node [10 | 20]. We compare target 17 against root keys: 10 < 17 < 20. Target 17 falls strictly between separator keys 10 and 20.',
        executeTitle: 'TRAVERSING DOWN MIDDLE CHILD POINTER',
        executeText: 'Because 10 < 17 < 20, the search traverses the middle child pointer down to inspect node [12 | 17].',
        resultTitle: 'ARRIVED AT MIDDLE CHILD NODE',
        resultText: 'Traversal complete. Descended to middle child [12 | 17] at depth 1 in 1 pointer dereference.',
        statusExplain: { type: 'cyan', label: 'COMPARE ROOT: 10 < 17 < 20' },
        statusExecute: { type: 'cyan', label: 'TRAVERSING TO CHILD' },
        statusResult: { type: 'cyan', label: 'CHILD REACHED' },
        highlightBefore: {
          nodes: { 3: { statusType: 'cyan', nodeMessage: 'COMPARE: 10 < 17 < 20', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'ROUTE MIDDLE' },
            2: { statusType: 'amber', nodeMessage: 'TARGET CHILD [12, 17]', fullHighlight: true }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            2: { statusType: 'cyan', nodeMessage: 'INSPECTING [12, 17]', fullHighlight: true }
          },
          edges: { '3-2': true }
        }
      },

      // ════ STEP 2: SEARCH 17 — LEAF SCAN & HIT ════
      {
        id: 'search-17-hit',
        name: 'Search 17 — Step 2: Scan Leaf [12 | 17] & Hit',
        durations: { explain: 4000, execute: 3000, result: 4000 },
        treeBefore: state0,
        treeAfter: state0,
        explainTitle: 'SEARCH 17 — STEP 2: SCAN LEAF [12 | 17]',
        explainText: 'In leaf node [12 | 17], scan keys sequentially: 17 > 12, then 17 == 17. Target key 17 matches the key at index 1 exactly!',
        executeTitle: 'KEY FOUND AT INDEX 1',
        executeText: 'Exact match confirmed! Point search finishes in O(log N) time with only 2 node visits across the entire tree.',
        resultTitle: 'SEARCH SUCCESSFUL — KEY 17 LOCATED',
        resultText: 'Key 17 found. B-Trees guarantee O(log N) lookup bound by maintaining balanced, uniform leaf depths.',
        statusExplain: { type: 'cyan', label: 'SCANNING LEAF KEYS' },
        statusExecute: { type: 'green', label: 'KEY 17 MATCHED' },
        statusResult: { type: 'green', label: 'SEARCH SUCCESS' },
        highlightBefore: {
          nodes: {
            2: { statusType: 'cyan', nodeMessage: 'COMPARE: 17 == 17', fullHighlight: true, indexHighlights: [1] }
          },
          edges: { '3-2': true }
        },
        highlightExecute: {
          nodes: {
            2: { statusType: 'green', nodeMessage: 'EXACT MATCH: 17', fullHighlight: true, indexHighlights: [1] }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            2: { statusType: 'green', nodeMessage: 'FOUND KEY 17 (O(log N))', fullHighlight: true, indexHighlights: [1] }
          },
          edges: { '3-2': true }
        }
      },

      // ════ STEP 3: SEARCH 15 — ROOT COMPARISON ════
      {
        id: 'search-15-root',
        name: 'Search 15 — Step 1: Inspect Root [10 | 20]',
        durations: { explain: 4000, execute: 3000, result: 4000 },
        treeBefore: state0,
        treeAfter: state0,
        explainTitle: 'SEARCH 15 — STEP 1: INSPECT ROOT [10 | 20]',
        explainText: 'Searching for absent key 15: Start at root [10 | 20]. Compare 15 with keys: 10 < 15 < 20. Target 15 would belong strictly between separator keys 10 and 20.',
        executeTitle: 'TRAVERSING DOWN MIDDLE CHILD POINTER',
        executeText: 'Because 10 < 15 < 20, follow the middle child pointer to inspect node [12 | 17].',
        resultTitle: 'ARRIVED AT MIDDLE CHILD NODE',
        resultText: 'Descended to middle child [12 | 17] at depth 1 to verify whether key 15 is present.',
        statusExplain: { type: 'cyan', label: 'COMPARE ROOT: 10 < 15 < 20' },
        statusExecute: { type: 'cyan', label: 'TRAVERSING TO CHILD' },
        statusResult: { type: 'cyan', label: 'CHILD REACHED' },
        highlightBefore: {
          nodes: { 3: { statusType: 'cyan', nodeMessage: 'COMPARE: 10 < 15 < 20', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'ROUTE MIDDLE' },
            2: { statusType: 'amber', nodeMessage: 'TARGET CHILD [12, 17]', fullHighlight: true }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            2: { statusType: 'cyan', nodeMessage: 'INSPECTING [12, 17]', fullHighlight: true }
          },
          edges: { '3-2': true }
        }
      },

      // ════ STEP 4: SEARCH 15 — LEAF SCAN & MISS ════
      {
        id: 'search-15-miss',
        name: 'Search 15 — Step 2: Leaf Boundary & Miss',
        durations: { explain: 4000, execute: 3000, result: 4000 },
        treeBefore: state0,
        treeAfter: state0,
        explainTitle: 'SEARCH 15 — STEP 2: LEAF BOUNDARY & MISS',
        explainText: 'In leaf node [12 | 17], compare target 15: 15 > 12 and 15 < 17. The key falls between 12 and 17, but this is a leaf node with NO further child pointers!',
        executeTitle: 'NO DESCENDANTS — SEARCH TERMINATES',
        executeText: 'Because leaf nodes have no child references, the search cannot branch down any deeper path.',
        resultTitle: 'SEARCH TERMINATED — KEY 15 NOT FOUND',
        resultText: 'Key 15 is confirmed absent from the B-Tree. Search completes in O(log N) time with zero false positives.',
        statusExplain: { type: 'cyan', label: 'LEAF INSPECTION: 12 < 15 < 17' },
        statusExecute: { type: 'red', label: 'NO CHILD POINTERS' },
        statusResult: { type: 'red', label: 'TERMINATED: 15 ABSENT' },
        highlightBefore: {
          nodes: {
            2: { statusType: 'cyan', nodeMessage: 'COMPARE: 12 < 15 < 17', fullHighlight: true }
          },
          edges: { '3-2': true }
        },
        highlightExecute: {
          nodes: {
            2: { statusType: 'red', nodeMessage: 'LEAF END: NO CHILD', fullHighlight: true }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            2: { statusType: 'red', nodeMessage: 'KEY 15 NOT IN TREE', fullHighlight: true }
          },
          edges: { '3-2': true }
        }
      },

      // ════ STEP 5: CASE A — DIRECT LEAF DELETION ════
      {
        id: 'delete-6-leaf',
        name: 'Case A: Direct Leaf Deletion — Delete 6',
        durations: { explain: 6000, execute: 4000, result: 4000 },
        treeBefore: state0,
        treeAfter: stateAfter6,
        explainTitle: 'CASE A: DIRECT LEAF DELETION — DELETE 6',
        explainText: 'Target key 6 is in leaf node [5 | 6 | 7]. The node currently holds 3 keys. Minimum degree t = 2 requires at least (t - 1 = 1) key per node. Removing 6 leaves 2 keys [5 | 7], which satisfies the minimum. Direct removal is safe without underflow!',
        executeTitle: 'REMOVING KEY 6 FROM LEAF',
        executeText: 'Key 6 is deleted directly from the leaf node. The remaining keys shift to preserve sorted order.',
        resultTitle: 'LEAF DELETION COMPLETE — NO UNDERFLOW',
        resultText: 'Leaf node is now [5 | 7] (2 keys >= 1). No borrowing or merging needed; all B-Tree invariants remain intact.',
        statusExplain: { type: 'green', label: 'SAFE LEAF DELETION' },
        statusExecute: { type: 'cyan', label: 'REMOVING KEY 6' },
        statusResult: { type: 'green', label: 'LEAF [5, 7] VALID' },
        highlightBefore: {
          nodes: {
            1: { statusType: 'amber', nodeMessage: 'TARGET: DELETE 6 (LEAF)', fullHighlight: true, indexHighlights: [1] }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            1: { statusType: 'cyan', nodeMessage: 'REMOVING KEY 6', fullHighlight: true }
          },
          edges: {}
        },
        highlightResult: {
          nodes: {
            1: { statusType: 'green', nodeMessage: 'LEAF [5, 7] (SAFE >= 1)', fullHighlight: true }
          },
          edges: {}
        }
      },

      // ════ STEP 6: CASE C — UNDERFLOW & SIBLING BORROWING ════
      {
        id: 'delete-30-borrow',
        name: 'Case C: Underflow & Sibling Borrowing — Delete 30',
        durations: { explain: 6000, execute: 5000, result: 4000 },
        treeBefore: stateAfter6,
        treeAfter: stateAfterBorrow30,
        explainTitle: 'CASE C: UNDERFLOW & SIBLING BORROWING — DELETE 30',
        explainText: 'Leaf [30] contains only 1 key. Removing 30 leaves 0 keys — an UNDERFLOW violation! To rebalance, inspect left sibling [12 | 17]. Since it has 2 keys (> 1), it can lend a key. We execute a rotation through the parent root!',
        executeTitle: 'ROTATION: 17 MOVES UP, 20 MOVES DOWN',
        executeText: 'Sibling’s largest key (17) moves UP to parent separator, and parent key (20) moves DOWN into the right leaf.',
        resultTitle: 'BORROWING ROTATION COMPLETE',
        resultText: 'Rebalance succeeded without merging: Sibling is [12], root is [10 | 17], right leaf is [20]. Tree height is preserved!',
        statusExplain: { type: 'red', label: 'UNDERFLOW DETECTED' },
        statusExecute: { type: 'amber', label: 'SIBLING BORROW ROTATION' },
        statusResult: { type: 'green', label: 'REBALANCED VIA ROOT' },
        highlightBefore: {
          nodes: {
            4: { statusType: 'red', nodeMessage: 'UNDERFLOW: REMOVE 30', fullHighlight: true },
            2: { statusType: 'amber', nodeMessage: 'LENDER SIBLING [12, 17]', fullHighlight: true }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'PARENT SEPARATOR ROTATES', fullHighlight: true },
            2: { statusType: 'purple', nodeMessage: 'LENDS 17' },
            4: { statusType: 'purple', nodeMessage: 'RECEIVES 20' }
          },
          edges: { '3-2': true, '3-4': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'ROOT [10, 17]', fullHighlight: true },
            2: { statusType: 'green', nodeMessage: 'SIBLING [12]' },
            4: { statusType: 'green', nodeMessage: 'RIGHT LEAF [20]' }
          },
          edges: { '3-2': true, '3-4': true }
        }
      },

      // ════ STEP 7: CASE B (STAGE 1) — INTERNAL DELETION: PREDECESSOR REPLACEMENT ════
      {
        id: 'delete-10-predecessor',
        name: 'Case B (Stage 1): Internal Deletion — Predecessor Replacement',
        durations: { explain: 6000, execute: 4000, result: 4000 },
        treeBefore: stateAfterBorrow30,
        treeAfter: stateCaseBStage1,
        explainTitle: 'CASE B (STAGE 1): INTERNAL DELETION — PREDECESSOR REPLACEMENT',
        explainText: 'We want to delete key 10 from root [10 | 17]. As an internal key, 10 cannot be simply erased because it separates children. Left child [5 | 7] has 2 keys (>= t). We find the in-order predecessor (the largest key in left subtree: 7) and copy it into the root!',
        executeTitle: 'COPYING PREDECESSOR 7 TO ROOT',
        executeText: 'Key 7 is copied to replace internal key 10 in the root node. Root now contains [7 | 17].',
        resultTitle: 'PREDECESSOR REPLACED INTERNAL KEY',
        resultText: 'Root separator is now 7. The original key 7 in the leaf must now be removed in Stage 2.',
        statusExplain: { type: 'amber', label: 'INTERNAL KEY: PREDECESSOR' },
        statusExecute: { type: 'purple', label: 'PROMOTING 7 TO ROOT' },
        statusResult: { type: 'purple', label: 'STAGE 1 COMPLETE' },
        highlightBefore: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'INTERNAL KEY 10', fullHighlight: true, indexHighlights: [0] },
            1: { statusType: 'cyan', nodeMessage: 'PREDECESSOR: 7', fullHighlight: true, indexHighlights: [1] }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'purple', nodeMessage: 'REPLACED: 7 IN ROOT', fullHighlight: true, indexHighlights: [0] },
            1: { statusType: 'amber', nodeMessage: 'COPIED 7 UP' }
          },
          edges: { '3-1': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'ROOT [7, 17]', fullHighlight: true },
            1: { statusType: 'amber', nodeMessage: 'LEAF STILL HAS 7' }
          },
          edges: { '3-1': true }
        }
      },

      // ════ STEP 8: CASE B (STAGE 2) — REMOVE PREDECESSOR FROM LEAF ════
      {
        id: 'delete-10-leaf-cleanup',
        name: 'Case B (Stage 2): Remove Predecessor from Leaf',
        durations: { explain: 6000, execute: 4000, result: 4000 },
        treeBefore: stateCaseBStage1,
        treeAfter: stateCaseBStage2,
        explainTitle: 'CASE B (STAGE 2): REMOVE PREDECESSOR FROM LEAF',
        explainText: 'With key 7 safely in place as the root separator, we now remove 7 from its original leaf node [5 | 7]. Since the leaf originally had 2 keys, removing 7 leaves 1 key [5] (>= t - 1 = 1). Safe removal without underflow!',
        executeTitle: 'REMOVING PREDECESSOR 7 FROM LEAF',
        executeText: 'Key 7 is deleted from the left leaf node. The left child now holds [5].',
        resultTitle: 'INTERNAL DELETION FULLY RESOLVED',
        resultText: 'Internal key 10 deletion complete! Two clean, verified stages preserved all subtrees and tree invariants.',
        statusExplain: { type: 'cyan', label: 'REMOVE PREDECESSOR LEAF' },
        statusExecute: { type: 'cyan', label: 'REMOVING 7' },
        statusResult: { type: 'green', label: 'CASE B RESOLVED' },
        highlightBefore: {
          nodes: {
            1: { statusType: 'amber', nodeMessage: 'TARGET: REMOVE 7 FROM LEAF', fullHighlight: true, indexHighlights: [1] }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            1: { statusType: 'cyan', nodeMessage: 'REMOVING 7', fullHighlight: true }
          },
          edges: {}
        },
        highlightResult: {
          nodes: {
            1: { statusType: 'green', nodeMessage: 'LEFT CHILD [5] (VALID)', fullHighlight: true },
            3: { statusType: 'green', nodeMessage: 'ROOT [7, 17]' }
          },
          edges: { '3-1': true }
        }
      },

      // ════ STEP 9: CASE D — NODE MERGING ════
      {
        id: 'delete-20-merge',
        name: 'Case D: Node Merging — Siblings Cannot Borrow',
        durations: { explain: 6000, execute: 5000, result: 4000 },
        treeBefore: stateCaseBStage2,
        treeAfter: stateAfterMerge,
        explainTitle: 'CASE D: NODE MERGING — SIBLINGS CANNOT BORROW',
        explainText: 'Delete key 20 from right leaf [20]. Removing 20 causes an underflow (0 keys). Can we borrow? Left sibling [12] has only 1 key (minimum occupancy), so it CANNOT lend! Borrowing is impossible. We must MERGE child [12] and the right leaf by pulling down parent separator 17!',
        executeTitle: 'PULLING DOWN SEPARATOR 17 & MERGING',
        executeText: 'Parent separator 17 drops down between the nodes, combining into single merged child [12 | 17]. Parent root retains [7].',
        resultTitle: 'MERGE COMPLETE — CHILDREN COMBINED',
        resultText: 'Merge resolved! Root is now [7] with 2 valid children [5] and [12 | 17]. No underflow remains; B-Tree invariants preserved.',
        statusExplain: { type: 'red', label: 'UNDERFLOW: CANNOT BORROW' },
        statusExecute: { type: 'amber', label: 'MERGING WITH SEPARATOR' },
        statusResult: { type: 'purple', label: 'MERGE COMPLETE' },
        highlightBefore: {
          nodes: {
            4: { statusType: 'red', nodeMessage: 'UNDERFLOW: REMOVE 20', fullHighlight: true },
            2: { statusType: 'red', nodeMessage: 'SIBLING HAS MIN (1 KEY)' },
            3: { statusType: 'amber', nodeMessage: 'PULL DOWN 17' }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'SEPARATOR 17 DROPS', fullHighlight: true },
            2: { statusType: 'purple', nodeMessage: 'COMBINING INTO [12, 17]', fullHighlight: true }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'ROOT [7]', fullHighlight: true },
            1: { statusType: 'green', nodeMessage: 'LEFT CHILD [5]' },
            2: { statusType: 'green', nodeMessage: 'MERGED CHILD [12, 17]' }
          },
          edges: { '3-1': true, '3-2': true }
        }
      },

      // ════ STEP 10: CASE E — ROOT COLLAPSE ════
      {
        id: 'collapse-root',
        name: 'Case E: Root Collapse & Height Reduction',
        durations: { explain: 6000, execute: 5000, result: 10000, finalResult: 12000 },
        treeBefore: statePreCollapse,
        treeAfter: statePostCollapse,
        explainTitle: 'CASE E: ROOT COLLAPSE & HEIGHT REDUCTION',
        explainText: 'SCENARIO: Consider root [7] with two minimal children [5] and [12]. Removing key 5 causes an underflow where borrowing is impossible. Separator 7 drops down to merge with child [12], leaving the root with 0 keys and a single child!',
        executeTitle: 'COLLAPSING EMPTY ROOT NODE',
        executeText: 'An empty root node cannot remain in a valid B-Tree. The single child node [7 | 12] collapses upward, becoming the brand-new root at depth 0.',
        resultTitle: 'ROOT COLLAPSED — TREE HEIGHT REDUCED',
        resultText: 'Root collapse complete! Merged node [7 | 12] is the new root. Tree height safely shrunk from 2 to 1 while preserving all invariants.',
        statusExplain: { type: 'red', label: 'ROOT HAS 0 KEYS' },
        statusExecute: { type: 'amber', label: 'COLLAPSING UPWARD' },
        statusResult: { type: 'purple', label: 'NEW ROOT [7, 12]' },
        highlightBefore: {
          nodes: {
            3: { statusType: 'red', nodeMessage: 'ROOT EMPTY AFTER DROP', fullHighlight: true },
            1: { statusType: 'red', nodeMessage: 'UNDERFLOW 5' },
            2: { statusType: 'amber', nodeMessage: 'MERGING WITH 7' }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'EMPTY ROOT COLLAPSES', fullHighlight: true },
            2: { statusType: 'purple', nodeMessage: 'ASCENDING TO ROOT' }
          },
          edges: {}
        },
        highlightResult: {
          nodes: {
            2: { statusType: 'green', nodeMessage: 'NEW ROOT [7, 12] (HEIGHT = 1)', fullHighlight: true }
          },
          edges: {}
        }
      }
    ]
  }, [])

  // Hook into deterministic controller with manual stepping
  const { stepIndex, phase, hasStarted } = useBTreeAnimator(steps, isActive, onRegisterAnimation)
  const currentStep = steps[stepIndex] || steps[0]

  // Crucial Rule: Tree MUST remain unchanged during EXPLAIN phase!
  const currentNodeData = phase === PHASES.EXPLAIN ? currentStep.treeBefore : currentStep.treeAfter

  const currentHighlight =
    phase === PHASES.EXPLAIN
      ? currentStep.highlightBefore
      : phase === PHASES.EXECUTE
      ? currentStep.highlightExecute
      : currentStep.highlightResult

  const currentStatus =
    phase === PHASES.EXPLAIN
      ? currentStep.statusExplain
      : phase === PHASES.EXECUTE
      ? currentStep.statusExecute
      : currentStep.statusResult

  // Dynamic explanation text per phase
  const currentTitle =
    phase === PHASES.EXECUTE && currentStep.executeTitle
      ? currentStep.executeTitle
      : phase === PHASES.RESULT
      ? currentStep.resultTitle
      : currentStep.explainTitle

  const currentText =
    phase === PHASES.EXECUTE && currentStep.executeText
      ? currentStep.executeText
      : phase === PHASES.RESULT
      ? currentStep.resultText
      : currentStep.explainText

  // Status color styling map
  const statusColors = {
    cyan: { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.5)' },
    red: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.18)', border: 'rgba(244, 63, 94, 0.6)' },
    amber: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.6)' },
    green: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.18)', border: 'rgba(16, 185, 129, 0.6)' },
    purple: { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.18)', border: 'rgba(192, 132, 252, 0.6)' }
  }
  const sc = statusColors[currentStatus.type] || statusColors.cyan

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div
        className="slide-content-wrapper"
        style={{
          padding: '24px 56px 16px 56px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'flex-start',
          gap: '0'
        }}
      >
        {/* ═══ SLIDE HEADER ═══ */}
        <div
          className="slide-header reveal"
          style={{
            margin: '0 0 16px 0',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 className="slide-title" style={{ margin: 0, fontSize: '40px' }}>
            B-Tree Dynamics — Searching &amp; Deletion
          </h2>
          <div
            className="mono"
            style={{
              fontSize: '12px',
              color: 'var(--text-dim)',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>Degree <strong style={{ color: '#fff' }}>t = 2</strong></span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <span>Search: <strong style={{ color: 'var(--jvm-cyan)' }}>1 Hit, 1 Miss</strong></span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <span>Deletion: <strong style={{ color: 'var(--jvm-amber)' }}>Leaf, Borrow, Internal, Merge, Collapse</strong></span>
          </div>
        </div>

        {/* ═══ MAIN CONTENT — TREE + EXPLANATION ═══ */}
        <div
          className="reveal delay-1"
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '1fr auto',
            gap: '16px',
            minHeight: 0
          }}
        >
          {/* ─── TREE CANVAS ─── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 0,
              background: 'linear-gradient(135deg, rgba(8, 11, 19, 0.96) 0%, rgba(4, 6, 12, 0.98) 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7), 0 12px 40px rgba(0,0,0,0.4)',
              overflow: 'hidden'
            }}
          >
            {/* Subtle grid pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                pointerEvents: 'none'
              }}
            />

            {/* The B-Tree SVG Visualizer */}
            <BTreeEngineVisualizer
              nodeData={currentNodeData}
              highlightData={currentHighlight}
              width={1808}
              height={780}
              centered={true}
              large={true}
            />
          </div>

          {/* ─── EXPLANATION PANEL (bottom strip) ─── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: '24px',
              alignItems: 'center',
              background: 'linear-gradient(145deg, rgba(11, 16, 28, 0.92), rgba(8, 12, 22, 0.98))',
              borderRadius: '16px',
              border: `1.5px solid ${sc.border}`,
              padding: '20px 32px',
              boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 25px ${sc.bg}`,
              transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
              minHeight: '120px'
            }}
          >
            {/* Left column: Step indicator + Status badge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              minWidth: '130px'
            }}>
              {/* Step number */}
              <div
                className="mono"
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  color: sc.color,
                  lineHeight: 1,
                  textShadow: `0 0 20px ${sc.bg}`
                }}
              >
                {stepIndex + 1}<span style={{ fontSize: '16px', color: 'var(--text-dim)', fontWeight: 600 }}> / {steps.length}</span>
              </div>
              {/* Status badge */}
              <div
                className="mono"
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: sc.color,
                  background: sc.bg,
                  border: `1px solid ${sc.border}`,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  textAlign: 'center'
                }}
              >
                {currentStatus.label}
              </div>
            </div>

            {/* Center column: Title + Explanation text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: sc.color,
                  boxShadow: `0 0 12px ${sc.color}`,
                  flexShrink: 0
                }} />
                <span
                  className="mono"
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.02em'
                  }}
                >
                  {currentTitle}
                </span>
              </div>
              <p style={{
                fontSize: '16px',
                color: 'var(--text-main)',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '1100px'
              }}>
                {currentText}
              </p>
            </div>

            {/* Right column: Progress dots */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignItems: 'center'
            }}>
              {steps.map((_, idx) => {
                const isCurrentActive = idx === stepIndex
                const isPast = idx < stepIndex
                return (
                  <div
                    key={idx}
                    style={{
                      width: isCurrentActive ? '10px' : '6px',
                      height: isCurrentActive ? '10px' : '6px',
                      borderRadius: '50%',
                      background: isCurrentActive ? sc.color : isPast ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
                      boxShadow: isCurrentActive ? `0 0 8px ${sc.color}` : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM KEYBOARD HINT ─── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <AnimationKeyboardHint hasStarted={hasStarted} />
        </div>
      </div>
    </section>
  )
}
