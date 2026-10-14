import React, { useMemo } from 'react'
import BTree from '../btree-engine/BTree.js'
import BTreeRenderer from '../btree-engine/BTreeRenderer.jsx'
import { useBTreeAnimator, PHASES } from '../btree-engine/useBTreeAnimator.js'

export default function Slide14BTreesDeletion({ isActive }) {
  // Precompute verified BTree states for search and deletion operations
  const steps = useMemo(() => {
    // Base tree matching final tree of Slide 13:
    // Root [10, 20], children [5, 6, 7], [12, 17], [30]
    const makeBase = () => {
      const t = new BTree(3)
      ;[10, 20, 5, 6, 12, 30, 7, 17].forEach(k => t.add(k))
      return t
    }

    const tBase = makeBase()
    const state0 = tBase.toNodeData()

    // State after removing 6
    const tAfter6 = makeBase()
    tAfter6.remove(6)
    const stateAfter6 = tAfter6.toNodeData()

    // State after removing 30 (borrowing)
    const tAfter30 = makeBase()
    tAfter30.remove(6)
    tAfter30.remove(30)
    const stateAfter30 = tAfter30.toNodeData()

    // State after removing 17 (internal deletion + merge)
    const tAfter17 = makeBase()
    tAfter17.remove(6)
    tAfter17.remove(30)
    tAfter17.remove(17)
    const stateAfter17 = tAfter17.toNodeData()

    return [
      {
        name: 'Operation 1: Point Search — Key 17 (Hit)',
        type: 'search',
        durations: { explain: 4000, execute: 3000, result: 4000 },
        treeBefore: state0,
        treeAfter: state0,
        explainText: 'Search for target key 17: Inspect root [10 | 20]. Since 10 < 17 < 20, route down the middle child pointer.',
        resultText: 'Found key 17 at index 1 in leaf [12 | 17]! Fast logarithmic search requiring only 2 node comparisons.',
        highlightBefore: {
          nodes: { 3: { statusType: 'cyan', nodeMessage: 'COMPARE: 10 < 17 < 20', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'ROUTE MIDDLE CHILD' },
            2: { statusType: 'amber', nodeMessage: 'SEARCHING LEAF [12, 17]', fullHighlight: true, indexHighlights: [1] }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            2: { statusType: 'green', nodeMessage: 'KEY 17 FOUND! (O(log N))', fullHighlight: true, indexHighlights: [1] }
          },
          edges: { '3-2': true }
        }
      },
      {
        name: 'Operation 2: Point Search — Key 25 (Miss)',
        type: 'search',
        durations: { explain: 4000, execute: 3000, result: 4000 },
        treeBefore: state0,
        treeAfter: state0,
        explainText: 'Search for target key 25: Inspect root [10 | 20]. Since 25 > 20, follow the rightmost child pointer to node [30].',
        resultText: 'Leaf [30] inspected: 25 < 30, but leaf has no further children. Search terminates: key 25 is NOT in tree.',
        highlightBefore: {
          nodes: { 3: { statusType: 'cyan', nodeMessage: 'COMPARE: 25 > 20', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'cyan', nodeMessage: 'ROUTE RIGHT CHILD' },
            4: { statusType: 'amber', nodeMessage: 'INSPECTING [30]', fullHighlight: true }
          },
          edges: { '3-4': true }
        },
        highlightResult: {
          nodes: {
            4: { statusType: 'red', nodeMessage: 'TERMINATE: 25 NOT FOUND', fullHighlight: true }
          },
          edges: { '3-4': true }
        }
      },
      {
        name: 'Operation 3: Direct Leaf Deletion — Key 6',
        type: 'deletion',
        durations: { explain: 6000, execute: 5000, result: 4000 },
        treeBefore: state0,
        treeAfter: stateAfter6,
        explainText: 'Delete key 6 from left leaf [5 | 6 | 7]. The leaf has 3 keys. After deletion, 2 keys remain, which is >= (t - 1 = 1). Direct removal is safe without underflow!',
        resultText: 'Key 6 removed directly. Left leaf is now [5 | 7]. All node occupancies and tree invariants perfectly preserved.',
        highlightBefore: {
          nodes: {
            1: { statusType: 'amber', nodeMessage: 'TARGET: REMOVE 6', fullHighlight: true, indexHighlights: [1] }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            1: { statusType: 'cyan', nodeMessage: 'DIRECT LEAF REMOVAL', fullHighlight: true }
          },
          edges: {}
        },
        highlightResult: {
          nodes: {
            1: { statusType: 'green', nodeMessage: 'LEAF [5, 7] (SAFE)', fullHighlight: true }
          },
          edges: {}
        }
      },
      {
        name: 'Operation 4: Underflow & Sibling Borrowing — Key 30',
        type: 'deletion',
        durations: { explain: 6000, execute: 5000, result: 4000 },
        treeBefore: stateAfter6,
        treeAfter: stateAfter30,
        explainText: 'UNDERFLOW! Removing key 30 from leaf [30] leaves 0 keys (< t - 1 = 1). Rebalance by BORROWING from left sibling [12 | 17]: median 17 moves UP to root, root key 20 drops DOWN!',
        resultText: 'Borrowing rotation complete: Sibling is [12], root updated to [10 | 17], right node is [20]. Tree height preserved without merging!',
        highlightBefore: {
          nodes: {
            4: { statusType: 'red', nodeMessage: 'UNDERFLOW: REMOVING 30', fullHighlight: true },
            2: { statusType: 'amber', nodeMessage: 'BORROW FROM SIBLING [12, 17]' }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'ROTATING THROUGH ROOT', fullHighlight: true },
            2: { statusType: 'purple', nodeMessage: 'SIBLING LENDS 17' },
            4: { statusType: 'purple', nodeMessage: 'RECEIVES ROOT KEY 20' }
          },
          edges: { '3-2': true, '3-4': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'NEW ROOT KEYS [10, 17]', fullHighlight: true },
            2: { statusType: 'green', nodeMessage: 'VALID [12]' },
            4: { statusType: 'green', nodeMessage: 'VALID [20]' }
          },
          edges: { '3-2': true, '3-4': true }
        }
      },
      {
        name: 'Operation 5: Internal Key Deletion & Merging — Key 17',
        type: 'deletion',
        durations: { explain: 6000, execute: 5000, result: 10000, finalResult: 10000 },
        treeBefore: stateAfter30,
        treeAfter: stateAfter17,
        explainText: 'INTERNAL DELETION & MERGE! Remove internal key 17 from root [10 | 17]. Both adjacent children [12] and [20] have only 1 key (minimum capacity), so neither can borrow. They MERGE together with 17 into [12 | 20]!',
        resultText: 'MERGE COMPLETE: Root is now [10], with two valid children [5 | 7] and [12 | 20]. The tree remains balanced with full structural integrity!',
        highlightBefore: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'INTERNAL KEY: REMOVE 17', fullHighlight: true, indexHighlights: [1] },
            2: { statusType: 'red', nodeMessage: 'MIN OCCUPANCY [12]' },
            4: { statusType: 'red', nodeMessage: 'MIN OCCUPANCY [20]' }
          },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'FUSING SIBLINGS & 17', fullHighlight: true },
            2: { statusType: 'purple', nodeMessage: 'MERGING INTO [12, 20]' }
          },
          edges: { '3-2': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'green', nodeMessage: 'FINAL ROOT [10]', fullHighlight: true },
            1: { statusType: 'green', nodeMessage: 'LEFT CHILD [5, 7]' },
            2: { statusType: 'green', nodeMessage: 'MERGED CHILD [12, 20]' }
          },
          edges: { '3-1': true, '3-2': true }
        }
      }
    ]
  }, [])

  const { stepIndex, phase, isPaused, togglePause, restart, nextStep, prevStep, jumpToStep } = useBTreeAnimator(steps, isActive)
  const currentStep = steps[stepIndex]

  // Crucial Rule: Tree MUST remain unchanged during EXPLAIN phase!
  const currentNodeData = phase === PHASES.EXPLAIN ? currentStep.treeBefore : currentStep.treeAfter

  const currentHighlight =
    phase === PHASES.EXPLAIN
      ? currentStep.highlightBefore
      : phase === PHASES.EXECUTE
      ? currentStep.highlightExecute
      : currentStep.highlightResult

  const teachingOverlay = {
    stepLabel: `OPERATION ${stepIndex + 1} OF ${steps.length}`,
    statusType:
      phase === PHASES.EXPLAIN
        ? currentStep.type === 'search'
          ? 'inspect'
          : stepIndex === 3 || stepIndex === 4
          ? 'underflow'
          : 'amber'
        : phase === PHASES.EXECUTE
        ? currentStep.type === 'search'
          ? 'inspect'
          : 'amber'
        : 'safe',
    statusBadgeText:
      phase === PHASES.EXPLAIN
        ? currentStep.type === 'search'
          ? 'SEARCH QUERY'
          : stepIndex === 3
          ? 'UNDERFLOW DETECTED'
          : stepIndex === 4
          ? 'INTERNAL MERGE REQUIRED'
          : 'DIRECT LEAF REMOVAL'
        : phase === PHASES.EXECUTE
        ? currentStep.type === 'search'
          ? 'TRAVERSING PATH'
          : 'REBALANCING'
        : 'RESULT VERIFIED',
    statusTitle: currentStep.name,
    explanation: phase === PHASES.RESULT ? currentStep.resultText : currentStep.explainText,
    resultNote:
      phase === PHASES.RESULT
        ? `Status: ${phase} · Invariants Verified · Degree: t = 2 (min 1 key)`
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
                  color: 'var(--jvm-emerald)',
                  fontWeight: 800,
                  background: 'rgba(16,185,129,0.15)',
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}
              >
                OPERATIONS · SEARCHING &amp; DELETION
              </span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Demonstrating: Leaf Deletion, Borrowing Rotation, and Merging
              </span>
            </div>
            <h2 className="slide-title" style={{ margin: '4px 0 0 0', fontSize: '36px' }}>
              B-Tree Dynamics: Searching, Deletion &amp; Rebalancing
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
              Operations: <strong style={{ color: '#fff' }}>2 Searches + 3 Deletions</strong>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span>
              Cases: <strong style={{ color: 'var(--jvm-amber)' }}>Direct, Borrow, Merge</strong>
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
