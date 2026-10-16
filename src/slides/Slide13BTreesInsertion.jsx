import React, { useMemo } from 'react'
import BTreeEngineVisualizer from '../btree-engine/BTreeEngineVisualizer.jsx'
import { useBTreeAnimator, PHASES } from '../btree-engine/useBTreeAnimator.js'
import AnimationKeyboardHint from '../components/AnimationKeyboardHint.jsx'

export default function Slide13BTreesInsertion({ isActive, onRegisterAnimation }) {
  // Build 10 discrete steps enforcing top-down B-Tree invariants:
  // Split operations and subsequent insertions are strictly separate steps.
  const steps = useMemo(() => {
    const state0 = { name: { id: 0, keys: [] } }
    const state1 = { name: { id: 1, keys: ['10'] } }
    const state2 = { name: { id: 1, keys: ['10', '20'] } }
    const state3 = { name: { id: 1, keys: ['5', '10', '20'] } }

    // Split 1 intermediate state: Root [10], children [5] and [20]
    // Distinct step BEFORE key 6 is inserted!
    const stateSplitRoot = {
      name: { id: 3, keys: ['10'] },
      children: [
        { name: { id: 1, keys: ['5'] } },
        { name: { id: 2, keys: ['20'] } }
      ]
    }

    // After key 6 is inserted into left child [5] -> [5, 6]
    const stateAfter6 = {
      name: { id: 3, keys: ['10'] },
      children: [
        { name: { id: 1, keys: ['5', '6'] } },
        { name: { id: 2, keys: ['20'] } }
      ]
    }

    // After key 12 is inserted into right child [20] -> [12, 20]
    const stateAfter12 = {
      name: { id: 3, keys: ['10'] },
      children: [
        { name: { id: 1, keys: ['5', '6'] } },
        { name: { id: 2, keys: ['12', '20'] } }
      ]
    }

    // After key 30 is inserted into right child [12, 20] -> [12, 20, 30]
    const stateAfter30 = {
      name: { id: 3, keys: ['10'] },
      children: [
        { name: { id: 1, keys: ['5', '6'] } },
        { name: { id: 2, keys: ['12', '20', '30'] } }
      ]
    }

    // After key 7 is inserted into left child [5, 6] -> [5, 6, 7]
    const stateAfter7 = {
      name: { id: 3, keys: ['10'] },
      children: [
        { name: { id: 1, keys: ['5', '6', '7'] } },
        { name: { id: 2, keys: ['12', '20', '30'] } }
      ]
    }

    // Split 2 intermediate state: Root [10, 20], children [5, 6, 7], [12], [30]
    // Distinct step BEFORE key 17 is inserted!
    const stateSplitLeaf = {
      name: { id: 3, keys: ['10', '20'] },
      children: [
        { name: { id: 1, keys: ['5', '6', '7'] } },
        { name: { id: 2, keys: ['12'] } },
        { name: { id: 4, keys: ['30'] } }
      ]
    }

    // Final state: After key 17 is inserted into middle child [12] -> [12, 17]
    const stateAfter17 = {
      name: { id: 3, keys: ['10', '20'] },
      children: [
        { name: { id: 1, keys: ['5', '6', '7'] } },
        { name: { id: 2, keys: ['12', '17'] } },
        { name: { id: 4, keys: ['30'] } }
      ]
    }

    return [
      // ════ STEP 1: INSERT 10 ════
      {
        id: 'insert-10',
        name: 'Insert 10 — First Key',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: state0,
        treeAfter: state1,
        explainTitle: 'INSERT 10 — FIRST KEY',
        explainText: 'The tree is empty. Key 10 becomes the first entry in a brand-new root node.',
        executeTitle: 'CREATING ROOT NODE',
        executeText: 'Allocating the root node and inserting key 10 at index 0.',
        resultTitle: 'ROOT INITIALIZED',
        resultText: 'The root now holds [10]. Capacity is 1 out of 3 keys — plenty of room.',
        statusExplain: { type: 'cyan', label: 'EMPTY TREE' },
        statusExecute: { type: 'cyan', label: 'INSERTING' },
        statusResult: { type: 'green', label: 'INSERTED' },
        highlightBefore: { nodes: {}, edges: {} },
        highlightExecute: {
          nodes: { 1: { statusType: 'cyan', nodeMessage: 'INSERTING 10', fullHighlight: true, indexHighlights: [0] } },
          edges: {}
        },
        highlightResult: {
          nodes: { 1: { statusType: 'green', nodeMessage: 'ROOT [10]', fullHighlight: true } },
          edges: {}
        }
      },

      // ════ STEP 2: INSERT 20 ════
      {
        id: 'insert-20',
        name: 'Insert 20 — Sorted Order',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: state1,
        treeAfter: state2,
        explainTitle: 'INSERT 20 — SORTED ORDER',
        explainText: 'Key 20 is greater than 10, so it goes after 10 in the root. Keys within a node are always kept sorted.',
        executeTitle: 'APPENDING KEY IN ROOT',
        executeText: 'Comparing 20 > 10. Placing key 20 in slot 1 of the root.',
        resultTitle: 'ROOT UPDATED',
        resultText: 'The root now holds [10 | 20]. That is 2 out of 3 keys — still room for one more.',
        statusExplain: { type: 'cyan', label: 'COMPARING KEYS' },
        statusExecute: { type: 'cyan', label: 'INSERTING' },
        statusResult: { type: 'green', label: 'INSERTED' },
        highlightBefore: {
          nodes: { 1: { statusType: 'cyan', nodeMessage: 'TARGET: ROOT', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: { 1: { statusType: 'amber', nodeMessage: 'SORTING KEYS', fullHighlight: true, indexHighlights: [1] } },
          edges: {}
        },
        highlightResult: {
          nodes: { 1: { statusType: 'green', nodeMessage: 'ROOT [10, 20]', fullHighlight: true } },
          edges: {}
        }
      },

      // ════ STEP 3: INSERT 5 ════
      {
        id: 'insert-5',
        name: 'Insert 5 — Root Fills Up',
        durations: { explain: 5000, execute: 3000, result: 5000 },
        isSplit: false,
        treeBefore: state2,
        treeAfter: state3,
        explainTitle: 'INSERT 5 — ROOT FILLS UP',
        explainText: 'Key 5 is smaller than 10, so it goes at the front of the root in sorted position. This brings the root to its maximum capacity of 3 keys.',
        executeTitle: 'SHIFTING AND INSERTING AT INDEX 0',
        executeText: 'Key 5 < 10: shifting existing keys right to make room and placing 5 at index 0.',
        resultTitle: 'ROOT IS NOW FULL',
        resultText: 'The root holds [5 | 10 | 20] — all 3 slots are occupied. The next insertion will require a split!',
        statusExplain: { type: 'cyan', label: 'COMPARING KEYS' },
        statusExecute: { type: 'amber', label: 'PLACING AT FRONT' },
        statusResult: { type: 'red', label: 'NODE FULL — 3/3 KEYS' },
        highlightBefore: {
          nodes: { 1: { statusType: 'cyan', nodeMessage: 'INSERTION TARGET', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: { 1: { statusType: 'amber', nodeMessage: 'PLACING AT INDEX 0', fullHighlight: true, indexHighlights: [0] } },
          edges: {}
        },
        highlightResult: {
          nodes: { 1: { statusType: 'red', nodeMessage: 'CAPACITY FULL (3/3 KEYS)', fullHighlight: true } },
          edges: {}
        }
      },

      // ════ STEP 4: SPLIT ROOT (BEFORE INSERTING 6) ════
      {
        id: 'split-root',
        name: 'Split Root — Promote Median 10',
        durations: { explain: 6500, execute: 5000, result: 6000 },
        isSplit: true,
        treeBefore: state3,
        treeAfter: stateSplitRoot,
        explainTitle: 'SPLIT REQUIRED — THE ROOT IS FULL',
        explainText: 'The root already contains three keys [5 | 10 | 20], the maximum for t = 2. We must split it before descending to insert 6.',
        executeTitle: 'SPLIT ROOT — PROMOTE 10',
        executeText: 'Promote the middle key, 10, to become the new root. The remaining keys become two children: [5] and [20].',
        resultTitle: 'ROOT SPLIT COMPLETE — TWO CHILDREN CREATED',
        resultText: 'The tree now has two children: [5] and [20]. Since 6 is less than 10, we will descend into the left child next.',
        statusExplain: { type: 'red', label: 'NODE FULL — SPLIT REQUIRED' },
        statusExecute: { type: 'amber', label: 'SPLIT ROOT — PROMOTE 10' },
        statusResult: { type: 'purple', label: 'SPLIT COMPLETE — 2 CHILDREN' },
        highlightBefore: {
          nodes: { 1: { statusType: 'red', nodeMessage: 'OVERFLOW: SPLIT REQUIRED', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'PROMOTING MEDIAN 10', fullHighlight: true },
            1: { statusType: 'purple', nodeMessage: 'LEFT [5]' },
            2: { statusType: 'purple', nodeMessage: 'RIGHT [20]' }
          },
          edges: { '3-1': true, '3-2': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'purple', nodeMessage: 'NEW ROOT [10]', fullHighlight: true },
            1: { statusType: 'cyan', nodeMessage: 'TARGET: LEFT [5]' },
            2: { statusType: 'green', nodeMessage: 'RIGHT [20]' }
          },
          edges: { '3-1': true, '3-2': true }
        }
      },

      // ════ STEP 5: INSERT 6 INTO LEFT CHILD ════
      {
        id: 'insert-6',
        name: 'Insert 6 — Left Child',
        durations: { explain: 5000, execute: 3000, result: 4500 },
        isSplit: false,
        treeBefore: stateSplitRoot,
        treeAfter: stateAfter6,
        explainTitle: 'ROUTE 6 INTO LEFT CHILD',
        explainText: 'The left child contains [5] and has space for another key (1 out of 3 keys). Since 6 < 10, insert 6 here in sorted order.',
        executeTitle: 'INSERT 6 IN SORTED ORDER',
        executeText: 'The left child has space for another key. Insert 6 in sorted order to produce [5 | 6].',
        resultTitle: 'KEY 6 INSERTED',
        resultText: 'The root remains [10], with left child [5 | 6] and right child [20]. Both children are valid leaves with available capacity.',
        statusExplain: { type: 'green', label: 'LEFT CHILD HAS ROOM' },
        statusExecute: { type: 'green', label: 'INSERTING 6' },
        statusResult: { type: 'green', label: 'INSERTED [5 | 6]' },
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'COMPARE: 6 < 10' },
            1: { statusType: 'green', nodeMessage: 'LEFT CHILD HAS ROOM', fullHighlight: true }
          },
          edges: { '3-1': true }
        },
        highlightExecute: {
          nodes: {
            1: { statusType: 'green', nodeMessage: 'INSERTING 6', fullHighlight: true, indexHighlights: [1] }
          },
          edges: { '3-1': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'ROOT [10]' },
            1: { statusType: 'green', nodeMessage: 'LEFT [5, 6]', fullHighlight: true },
            2: { statusType: 'green', nodeMessage: 'RIGHT [20]' }
          },
          edges: { '3-1': true, '3-2': true }
        }
      },

      // ════ STEP 6: INSERT 12 ════
      {
        id: 'insert-12',
        name: 'Insert 12 — Route Right',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: stateAfter6,
        treeAfter: stateAfter12,
        explainTitle: 'INSERT 12 — ROUTE RIGHT',
        explainText: 'Compare 12 with root key 10. Since 12 > 10, follow the right child pointer to node [20]. Insert 12 before 20 in sorted order.',
        executeTitle: 'INSERTING 12 INTO RIGHT LEAF',
        executeText: 'Right child [20] has room. Placing 12 before 20 in sorted order to produce [12 | 20].',
        resultTitle: 'INSERTED INTO RIGHT CHILD',
        resultText: 'The right child now holds [12 | 20]. It has 2 out of 3 keys — still within capacity.',
        statusExplain: { type: 'cyan', label: 'SEARCHING — 12 > 10' },
        statusExecute: { type: 'cyan', label: 'INSERTING INTO LEAF' },
        statusResult: { type: 'green', label: 'INSERTED' },
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'COMPARE: 12 > 10' },
            2: { statusType: 'amber', nodeMessage: 'ROUTE RIGHT' }
          },
          edges: { '3-2': true }
        },
        highlightExecute: {
          nodes: {
            2: { statusType: 'cyan', nodeMessage: 'INSERTING 12', fullHighlight: true, indexHighlights: [0] }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            2: { statusType: 'green', nodeMessage: 'RIGHT [12, 20]', fullHighlight: true }
          },
          edges: { '3-2': true }
        }
      },

      // ════ STEP 7: INSERT 30 ════
      {
        id: 'insert-30',
        name: 'Insert 30 — Right Child Fills',
        durations: { explain: 5000, execute: 3000, result: 5000 },
        isSplit: false,
        treeBefore: stateAfter12,
        treeAfter: stateAfter30,
        explainTitle: 'INSERT 30 — RIGHT CHILD FILLS UP',
        explainText: 'Key 30 > 10, so route right. The right child [12 | 20] has room. Insert 30 after 20 in sorted order. This fills the right child to capacity.',
        executeTitle: 'APPENDING 30 IN RIGHT LEAF',
        executeText: 'Appending 30 after 20 in the right leaf [12 | 20 | 30]. All 3 slots in this leaf node are now full.',
        resultTitle: 'RIGHT CHILD IS NOW FULL',
        resultText: 'The right child holds [12 | 20 | 30] — all 3 slots full. The next key routed here will force another split.',
        statusExplain: { type: 'cyan', label: 'SEARCHING — 30 > 10' },
        statusExecute: { type: 'cyan', label: 'INSERTING INTO LEAF' },
        statusResult: { type: 'red', label: 'NODE FULL — 3/3 KEYS' },
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'COMPARE: 30 > 10' },
            2: { statusType: 'amber', nodeMessage: 'ROUTE RIGHT' }
          },
          edges: { '3-2': true }
        },
        highlightExecute: {
          nodes: {
            2: { statusType: 'cyan', nodeMessage: 'INSERTING 30', fullHighlight: true, indexHighlights: [2] }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            2: { statusType: 'red', nodeMessage: 'RIGHT CHILD FULL (3/3)', fullHighlight: true }
          },
          edges: { '3-2': true }
        }
      },

      // ════ STEP 8: INSERT 7 ════
      {
        id: 'insert-7',
        name: 'Insert 7 — Route Left',
        durations: { explain: 5000, execute: 3000, result: 5000 },
        isSplit: false,
        treeBefore: stateAfter30,
        treeAfter: stateAfter7,
        explainTitle: 'INSERT 7 — ROUTE LEFT',
        explainText: 'Key 7 < 10, so follow the left child pointer. The left child [5 | 6] has room. Insert 7 after 6 in sorted order. This fills the left child to capacity too.',
        executeTitle: 'INSERTING 7 INTO LEFT LEAF',
        executeText: 'Appending 7 after 6 in the left leaf [5 | 6 | 7]. Both leaf nodes in the tree are now at maximum capacity.',
        resultTitle: 'LEFT CHILD IS NOW FULL',
        resultText: 'The left child holds [5 | 6 | 7] — all 3 slots full. Both leaf nodes in the tree are now completely full!',
        statusExplain: { type: 'cyan', label: 'SEARCHING — 7 < 10' },
        statusExecute: { type: 'cyan', label: 'INSERTING INTO LEAF' },
        statusResult: { type: 'red', label: 'BOTH LEAVES FULL' },
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'COMPARE: 7 < 10' },
            1: { statusType: 'amber', nodeMessage: 'ROUTE LEFT' }
          },
          edges: { '3-1': true }
        },
        highlightExecute: {
          nodes: {
            1: { statusType: 'cyan', nodeMessage: 'INSERTING 7', fullHighlight: true, indexHighlights: [2] }
          },
          edges: { '3-1': true }
        },
        highlightResult: {
          nodes: {
            1: { statusType: 'red', nodeMessage: 'LEFT CHILD FULL (3/3)', fullHighlight: true }
          },
          edges: { '3-1': true }
        }
      },

      // ════ STEP 9: SPLIT RIGHT CHILD (BEFORE INSERTING 17) ════
      {
        id: 'split-leaf',
        name: 'Split Right Child — Promote 20',
        durations: { explain: 6500, execute: 5000, result: 6000 },
        isSplit: true,
        treeBefore: stateAfter7,
        treeAfter: stateSplitLeaf,
        explainTitle: 'SPLIT REQUIRED — RIGHT CHILD IS FULL',
        explainText: 'Key 17 > 10, so we route to the right child [12 | 20 | 30]. But that child already contains 3 keys (the maximum for t = 2). It must be split before 17 can be inserted.',
        executeTitle: 'SPLIT LEAF & PROMOTE MEDIAN 20',
        executeText: 'Split [12 | 20 | 30]: promote median key 20 up into the root to form [10 | 20]. The remaining keys form two leaves: [12] and [30].',
        resultTitle: 'LEAF SPLIT COMPLETE — THREE CHILDREN CREATED',
        resultText: 'The root now holds [10 | 20] with three children: [5 | 6 | 7], [12], and [30]. Since 10 < 17 < 20, key 17 belongs in the middle child [12].',
        statusExplain: { type: 'red', label: 'NODE FULL — SPLIT REQUIRED' },
        statusExecute: { type: 'amber', label: 'SPLIT LEAF — PROMOTE 20' },
        statusResult: { type: 'purple', label: 'SPLIT COMPLETE — 3 CHILDREN' },
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'COMPARE: 17 > 10' },
            2: { statusType: 'red', nodeMessage: 'OVERFLOW: SPLIT REQUIRED', fullHighlight: true }
          },
          edges: { '3-2': true }
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'PROMOTING 20 TO ROOT', fullHighlight: true },
            2: { statusType: 'purple', nodeMessage: 'LEFT [12]' },
            4: { statusType: 'purple', nodeMessage: 'RIGHT [30]' }
          },
          edges: { '3-2': true, '3-4': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'ROOT [10, 20]', fullHighlight: true },
            1: { statusType: 'green', nodeMessage: '[5, 6, 7]' },
            2: { statusType: 'cyan', nodeMessage: 'TARGET: [12]' },
            4: { statusType: 'green', nodeMessage: '[30]' }
          },
          edges: { '3-1': true, '3-2': true, '3-4': true }
        }
      },

      // ════ STEP 10: INSERT 17 INTO MIDDLE CHILD ════
      {
        id: 'insert-17',
        name: 'Insert 17 — Middle Child',
        durations: { explain: 5000, execute: 3000, result: 12000, finalResult: 12000 },
        isSplit: false,
        treeBefore: stateSplitLeaf,
        treeAfter: stateAfter17,
        explainTitle: 'ROUTE 17 INTO MIDDLE CHILD',
        explainText: 'Compare 17 with root [10 | 20]: since 10 < 17 < 20, route down to the middle child. The middle child contains [12] and has room for another key.',
        executeTitle: 'INSERT 17 IN SORTED ORDER',
        executeText: 'The middle child contains [12] and has room. Insert 17 after 12 to produce [12 | 17].',
        resultTitle: 'FINAL B-TREE — ALL 8 KEYS INSERTED',
        resultText: 'Root is [10 | 20] with three children: [5 | 6 | 7], [12 | 17], and [30]. Every node satisfies the B-Tree invariants. Perfectly balanced at depth 2!',
        statusExplain: { type: 'green', label: 'MIDDLE CHILD HAS ROOM' },
        statusExecute: { type: 'green', label: 'INSERTING 17' },
        statusResult: { type: 'green', label: 'CONSTRUCTION COMPLETE ✓' },
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: '10 < 17 < 20' },
            2: { statusType: 'green', nodeMessage: 'MIDDLE CHILD HAS ROOM', fullHighlight: true }
          },
          edges: { '3-2': true }
        },
        highlightExecute: {
          nodes: {
            2: { statusType: 'green', nodeMessage: 'INSERTING 17', fullHighlight: true, indexHighlights: [1] }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'ROOT [10, 20]', fullHighlight: true },
            1: { statusType: 'green', nodeMessage: '[5, 6, 7]' },
            2: { statusType: 'green', nodeMessage: '[12, 17]' },
            4: { statusType: 'green', nodeMessage: '[30]' }
          },
          edges: { '3-1': true, '3-2': true, '3-4': true }
        }
      }
    ]
  }, [])

  const { stepIndex, phase, hasStarted } = useBTreeAnimator(steps, isActive, onRegisterAnimation)
  const currentStep = steps[stepIndex]

  // Tree state: unchanged during EXPLAIN, mutated during EXECUTE/RESULT
  const currentNodeData = phase === PHASES.EXPLAIN ? currentStep.treeBefore : currentStep.treeAfter

  // Highlight state per phase
  const currentHighlight =
    phase === PHASES.EXPLAIN
      ? currentStep.highlightBefore
      : phase === PHASES.EXECUTE
      ? currentStep.highlightExecute
      : currentStep.highlightResult

  // Current status indicator
  const currentStatus =
    phase === PHASES.EXPLAIN
      ? currentStep.statusExplain
      : phase === PHASES.EXECUTE
      ? currentStep.statusExecute
      : currentStep.statusResult

  // Explanation text per phase
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

  // Status color map
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
            Building a B-Tree — Step-by-Step
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
            <span>Keys: <strong style={{ color: 'var(--jvm-cyan)' }}>10, 20, 5, 6, 12, 30, 7, 17</strong></span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <span>Splits: <strong style={{ color: 'var(--jvm-amber)' }}>2 Proactive Splits</strong></span>
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
          {/* ─── TREE CANVAS (fills available space) ─── */}
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
