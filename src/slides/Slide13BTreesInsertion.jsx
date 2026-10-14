import React, { useMemo } from 'react'
import BTree from '../btree-engine/BTree.js'
import BTreeRenderer from '../btree-engine/BTreeRenderer.jsx'
import { useBTreeAnimator, PHASES } from '../btree-engine/useBTreeAnimator.js'

export default function Slide13BTreesInsertion({ isActive }) {
  // Build step definitions with verified before and after trees, highlights, and timings
  const steps = useMemo(() => {
    const keys = [10, 20, 5, 6, 12, 30, 7, 17]

    // Precompute exact BTree states
    const states = []
    for (let i = 0; i <= keys.length; i++) {
      const tree = new BTree(3)
      for (let j = 0; j < i; j++) tree.add(keys[j])
      states.push(tree.toNodeData())
    }

    return [
      {
        key: 10,
        name: 'Step 1: Insert Key 10',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[0],
        treeAfter: states[1],
        explainText: 'Insert key 10 into an empty tree. Key 10 becomes the first key in our root node.',
        resultText: 'Key 10 successfully placed in root node. Occupancy is 1 / 3 keys (well within capacity).',
        highlightBefore: {
          nodes: {},
          edges: {}
        },
        highlightExecute: {
          nodes: { 1: { statusType: 'cyan', nodeMessage: 'INSERTING 10', fullHighlight: true, indexHighlights: [0] } },
          edges: {}
        },
        highlightResult: {
          nodes: { 1: { statusType: 'green', nodeMessage: 'ROOT INITIALIZED', fullHighlight: true, indexHighlights: [0] } },
          edges: {}
        }
      },
      {
        key: 20,
        name: 'Step 2: Insert Key 20',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[1],
        treeAfter: states[2],
        explainText: 'Insert key 20. Keys within every node must stay strictly sorted in ascending order: 10 < 20.',
        resultText: 'Key 20 added to root. Root now contains [10 | 20]. Node occupancy is 2 / 3 keys.',
        highlightBefore: {
          nodes: { 1: { statusType: 'cyan', nodeMessage: 'TARGET: ROOT', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: { 1: { statusType: 'amber', nodeMessage: 'SORTING KEYS', fullHighlight: true, indexHighlights: [1] } },
          edges: {}
        },
        highlightResult: {
          nodes: { 1: { statusType: 'green', nodeMessage: 'KEYS SORTED [10, 20]', fullHighlight: true } },
          edges: {}
        }
      },
      {
        key: 5,
        name: 'Step 3: Insert Key 5',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[2],
        treeAfter: states[3],
        explainText: 'Insert key 5. Since 5 < 10, it is inserted at the front of the node in sorted position: [5 | 10 | 20].',
        resultText: 'Root now holds [5 | 10 | 20]. Maximum capacity (2t - 1 = 3 keys) reached! Node is completely FULL.',
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
      {
        key: 6,
        name: 'Step 4: Insert Key 6 (Root Split & Promotion)',
        durations: { explain: 6000, execute: 5000, result: 4000 },
        isSplit: true,
        treeBefore: states[3],
        treeAfter: states[4],
        explainText: 'OVERFLOW! Root [5 | 10 | 20] is already full. Key 6 cannot fit. The node splits: median key 10 is PROMOTED to create a new root, while [5, 6] and [20] become child nodes!',
        resultText: 'Tree height increases to 2! Root is now [10], left child is [5 | 6], right child is [20]. All invariants hold.',
        highlightBefore: {
          nodes: { 1: { statusType: 'red', nodeMessage: 'OVERFLOW: SPLIT REQUIRED', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'PROMOTING MEDIAN 10', fullHighlight: true },
            1: { statusType: 'purple', nodeMessage: 'LEFT SPLIT [5, 6]' },
            2: { statusType: 'purple', nodeMessage: 'RIGHT SPLIT [20]' }
          },
          edges: { '3-1': true, '3-2': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'purple', nodeMessage: 'NEW ROOT LEVEL', fullHighlight: true },
            1: { statusType: 'green', nodeMessage: 'VALID CHILD' },
            2: { statusType: 'green', nodeMessage: 'VALID CHILD' }
          },
          edges: { '3-1': true, '3-2': true }
        }
      },
      {
        key: 12,
        name: 'Step 5: Insert Key 12',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[4],
        treeAfter: states[5],
        explainText: 'Insert key 12: Compare with root [10]. Since 12 > 10, route right to child node [20]. Insert 12 in sorted order.',
        resultText: 'Key 12 inserted into right leaf. Node becomes [12 | 20]. Tree height remains 2.',
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'COMPARE: 12 > 10' },
            2: { statusType: 'amber', nodeMessage: 'ROUTE RIGHT CHILD' }
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
            2: { statusType: 'green', nodeMessage: 'LEAF [12, 20] (2/3 KEYS)', fullHighlight: true }
          },
          edges: {}
        }
      },
      {
        key: 30,
        name: 'Step 6: Insert Key 30',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[5],
        treeAfter: states[6],
        explainText: 'Insert key 30: Compare with root [10]. Since 30 > 10, route to right child [12 | 20]. Insert 30 in sorted position.',
        resultText: 'Right leaf now holds [12 | 20 | 30] and reaches MAXIMUM capacity (3 keys).',
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'COMPARE: 30 > 10' },
            2: { statusType: 'amber', nodeMessage: 'ROUTE RIGHT CHILD' }
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
            2: { statusType: 'red', nodeMessage: 'RIGHT LEAF FULL (3/3)', fullHighlight: true }
          },
          edges: {}
        }
      },
      {
        key: 7,
        name: 'Step 7: Insert Key 7',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[6],
        treeAfter: states[7],
        explainText: 'Insert key 7: Compare with root [10]. Since 7 < 10, route to left child [5 | 6]. Insert 7 in sorted position.',
        resultText: 'Left leaf now holds [5 | 6 | 7] and reaches MAXIMUM capacity (3 keys). Both children are now full!',
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'COMPARE: 7 < 10' },
            1: { statusType: 'amber', nodeMessage: 'ROUTE LEFT CHILD' }
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
            1: { statusType: 'red', nodeMessage: 'LEFT LEAF FULL (3/3)', fullHighlight: true }
          },
          edges: {}
        }
      },
      {
        key: 17,
        name: 'Step 8: Insert Key 17 (Leaf Split & Promotion)',
        durations: { explain: 6000, execute: 5000, result: 10000, finalResult: 10000 },
        isSplit: true,
        treeBefore: states[7],
        treeAfter: states[8],
        explainText: 'OVERFLOW ON LEAF! Key 17 > 10 routes to right child [12 | 20 | 30], which is full. The leaf splits: median key 20 is PROMOTED to the root, while [12, 17] and [30] become children!',
        resultText: 'FINAL TREE VERIFIED: Root is [10 | 20]. Three children: [5 | 6 | 7], [12 | 17], and [30]. Perfect balance at depth 2!',
        highlightBefore: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'ROOT: 17 > 10' },
            2: { statusType: 'red', nodeMessage: 'OVERFLOW: SPLIT REQUIRED', fullHighlight: true }
          },
          edges: { '3-2': true }
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'PROMOTING 20 TO ROOT', fullHighlight: true },
            2: { statusType: 'purple', nodeMessage: 'LEFT SPLIT [12, 17]' },
            4: { statusType: 'purple', nodeMessage: 'RIGHT SPLIT [30]' }
          },
          edges: { '3-2': true, '3-4': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'FINAL ROOT [10, 20]', fullHighlight: true },
            1: { statusType: 'green', nodeMessage: 'CHILD [5, 6, 7]' },
            2: { statusType: 'green', nodeMessage: 'CHILD [12, 17]' },
            4: { statusType: 'green', nodeMessage: 'CHILD [30]' }
          },
          edges: { '3-1': true, '3-2': true, '3-4': true }
        }
      }
    ]
  }, [])

  const { stepIndex, phase, isPaused, togglePause, restart, nextStep, prevStep, jumpToStep } = useBTreeAnimator(steps, isActive)
  const currentStep = steps[stepIndex]

  // Crucial Rule: Tree MUST remain unchanged during EXPLAIN phase!
  // Only transition into EXECUTE starts mutation/animation.
  const currentNodeData = phase === PHASES.EXPLAIN ? currentStep.treeBefore : currentStep.treeAfter

  const currentHighlight =
    phase === PHASES.EXPLAIN
      ? currentStep.highlightBefore
      : phase === PHASES.EXECUTE
      ? currentStep.highlightExecute
      : currentStep.highlightResult

  // Teaching overlay configuration
  const teachingOverlay = {
    stepLabel: `STEP ${stepIndex + 1} OF ${steps.length}`,
    statusType:
      phase === PHASES.EXPLAIN
        ? currentStep.isSplit
          ? 'overflow'
          : 'inspect'
        : phase === PHASES.EXECUTE
        ? currentStep.isSplit
          ? 'promotion'
          : 'amber'
        : currentStep.isSplit
        ? 'purple'
        : 'safe',
    statusBadgeText:
      phase === PHASES.EXPLAIN
        ? currentStep.isSplit
          ? 'SPLIT REQUIRED'
          : 'EXPLANATION PHASE'
        : phase === PHASES.EXECUTE
        ? currentStep.isSplit
          ? 'SPLIT & PROMOTION'
          : 'EXECUTING INSERT'
        : 'RESULT VERIFIED',
    statusTitle: currentStep.name,
    explanation: phase === PHASES.RESULT ? currentStep.resultText : currentStep.explainText,
    resultNote:
      phase === PHASES.RESULT
        ? `Status: ${phase} · Invariants Preserved · Height: ${stepIndex >= 3 ? 2 : 1}`
        : null,
    progressLabel: `${phase} (${currentStep.durations[phase.toLowerCase()] / 1000}s)`
  }

  const controls = {
    isPaused,
    onTogglePause: togglePause,
    onRestart: restart,
    onPrev: prevStep,
    onNext: nextStep,
    onJumpToStep: jumpToStep,
    currentStepIndex: stepIndex,
    totalSteps: steps.length,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === steps.length - 1
  }

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div
        className="slide-content-wrapper"
        style={{
          padding: '24px 44px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'flex-start',
          gap: '12px'
        }}
      >
        {/* Slide Header */}
        <div
          className="slide-header reveal"
          style={{
            margin: 0,
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                className="mono"
                style={{
                  fontSize: '11px',
                  color: 'var(--jvm-cyan)',
                  fontWeight: 800,
                  background: 'rgba(6,182,212,0.15)',
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}
              >
                ANIMATED INSERTION · DEGREE t = 2
              </span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Sequence: 10, 20, 5, 6, 12, 30, 7, 17
              </span>
            </div>
            <h2 className="slide-title" style={{ margin: '4px 0 0 0', fontSize: '36px' }}>
              Building a B-Tree: Step-by-Step Insertion &amp; Splits
            </h2>
          </div>

          {/* Quick Info Badge */}
          <div
            className="mono"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '12px',
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span>
              Target: <strong style={{ color: '#fff' }}>[10, 20]</strong> with 3 leaves
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span>
              Splits: <strong style={{ color: 'var(--jvm-rose)' }}>2 Splits (Step 4 &amp; 8)</strong>
            </span>
          </div>
        </div>

        {/* Tree Canvas with In-Canvas Teaching Overlay and Controls */}
        <div className="reveal delay-1" style={{ flex: 1, minHeight: 0 }}>
          <BTreeRenderer
            nodeData={currentNodeData}
            highlightData={currentHighlight}
            width={1830}
            height={820}
            teachingOverlay={teachingOverlay}
            controls={controls}
          />
        </div>
      </div>
    </section>
  )
}
