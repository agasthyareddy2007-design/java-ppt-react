import React, { useMemo } from 'react'
import BTree from '../btree-engine/BTree.js'
import BTreeEngineVisualizer from '../btree-engine/BTreeEngineVisualizer.jsx'
import { useBTreeAnimator, PHASES } from '../btree-engine/useBTreeAnimator.js'

export default function Slide13BTreesInsertion({ isActive }) {
  // Build step definitions with verified before/after trees, highlights, and timings
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
        name: 'Insert 10 — First Key',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[0],
        treeAfter: states[1],
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
      {
        key: 20,
        name: 'Insert 20 — Sorted Order',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[1],
        treeAfter: states[2],
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
      {
        key: 5,
        name: 'Insert 5 — Root Fills Up',
        durations: { explain: 5000, execute: 3000, result: 5000 },
        isSplit: false,
        treeBefore: states[2],
        treeAfter: states[3],
        explainTitle: 'INSERT 5 — ROOT FILLS UP',
        explainText: 'Key 5 is smaller than 10, so it goes at the front of the root in sorted position. This will bring the root to its maximum capacity of 3 keys.',
        executeTitle: 'SHIFTING AND INSERTING AT INDEX 0',
        executeText: 'Key 5 < 10: shifting existing keys right to make room and placing 5 at index 0.',
        resultTitle: 'ROOT IS NOW FULL',
        resultText: 'The root holds [5 | 10 | 20] — all 3 slots are occupied. The next insertion will force a split!',
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
      {
        key: 6,
        name: 'Insert 6 — Root Split & Promotion',
        durations: { explain: 6500, execute: 5000, result: 5000 },
        isSplit: true,
        treeBefore: states[3],
        treeAfter: states[4],
        explainTitle: 'INSERT 6 — THE ROOT IS FULL',
        explainText: 'The root contains [5 | 10 | 20], which is already at its three-key limit. Before descending, we must split the root.',
        executeTitle: 'SPLIT AND PROMOTE',
        executeText: 'Promote median key 10 to become the new root. The remaining keys form two children: [5] and [20], and 6 is inserted into the left child.',
        resultTitle: 'INSERT 6 INTO THE LEFT CHILD',
        resultText: 'The left child has room. Key 6 was inserted in sorted order to produce [5 | 6]. Key 10 is the new root. Tree height is now 2.',
        statusExplain: { type: 'red', label: 'NODE FULL — SPLIT REQUIRED' },
        statusExecute: { type: 'amber', label: 'SPLIT & PROMOTE' },
        statusResult: { type: 'purple', label: 'STRUCTURAL UPDATE COMPLETE' },
        highlightBefore: {
          nodes: { 1: { statusType: 'red', nodeMessage: 'OVERFLOW: SPLIT REQUIRED', fullHighlight: true } },
          edges: {}
        },
        highlightExecute: {
          nodes: {
            3: { statusType: 'amber', nodeMessage: 'PROMOTING MEDIAN 10', fullHighlight: true },
            1: { statusType: 'purple', nodeMessage: 'LEFT [5, 6]' },
            2: { statusType: 'purple', nodeMessage: 'RIGHT [20]' }
          },
          edges: { '3-1': true, '3-2': true }
        },
        highlightResult: {
          nodes: {
            3: { statusType: 'purple', nodeMessage: 'NEW ROOT [10]', fullHighlight: true },
            1: { statusType: 'green', nodeMessage: 'LEFT CHILD [5, 6]' },
            2: { statusType: 'green', nodeMessage: 'RIGHT CHILD [20]' }
          },
          edges: { '3-1': true, '3-2': true }
        }
      },
      {
        key: 12,
        name: 'Insert 12 — Route Right',
        durations: { explain: 5000, execute: 3000, result: 4000 },
        isSplit: false,
        treeBefore: states[4],
        treeAfter: states[5],
        explainTitle: 'INSERT 12 — ROUTE RIGHT',
        explainText: 'Compare 12 with root key 10. Since 12 > 10, we follow the right child pointer to the node containing [20]. Insert 12 before 20 in sorted order.',
        executeTitle: 'ROUTING RIGHT CHILD',
        executeText: 'Following pointer to right child [20]. Placing 12 in sorted order at index 0.',
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
          edges: {}
        }
      },
      {
        key: 30,
        name: 'Insert 30 — Right Child Fills',
        durations: { explain: 5000, execute: 3000, result: 5000 },
        isSplit: false,
        treeBefore: states[5],
        treeAfter: states[6],
        explainTitle: 'INSERT 30 — RIGHT CHILD FILLS UP',
        explainText: 'Key 30 > 10, so we route right. The right child [12 | 20] has room. Insert 30 after 20 in sorted order. This fills the right child to capacity.',
        executeTitle: 'INSERTING AT END OF RIGHT CHILD',
        executeText: 'Appending 30 after 20 in the right child. All 3 slots in this leaf node are now filled.',
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
          edges: {}
        }
      },
      {
        key: 7,
        name: 'Insert 7 — Route Left',
        durations: { explain: 5000, execute: 3000, result: 5000 },
        isSplit: false,
        treeBefore: states[6],
        treeAfter: states[7],
        explainTitle: 'INSERT 7 — ROUTE LEFT',
        explainText: 'Key 7 < 10, so we follow the left child pointer. The left child [5 | 6] has room. Insert 7 after 6 in sorted order. This fills the left child to capacity too.',
        executeTitle: 'INSERTING INTO LEFT LEAF',
        executeText: 'Appending 7 after 6 in the left leaf [5 | 6 | 7]. Both leaf nodes are now at max capacity.',
        resultTitle: 'LEFT CHILD IS NOW FULL',
        resultText: 'The left child holds [5 | 6 | 7] — all 3 slots full. Both leaf nodes are now at maximum capacity!',
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
          edges: {}
        }
      },
      {
        key: 17,
        name: 'Insert 17 — Leaf Split & Promotion',
        durations: { explain: 7000, execute: 5000, result: 12000, finalResult: 12000 },
        isSplit: true,
        treeBefore: states[7],
        treeAfter: states[8],
        explainTitle: 'INSERT 17 — LEAF SPLIT REQUIRED',
        explainText: 'Key 17 > 10, so we route to the right child [12 | 20 | 30]. But that leaf is already full! It must split: median key 20 is promoted up to the root, creating two new children: [12 | 17] and [30].',
        executeTitle: 'SPLIT LEAF & PROMOTE MEDIAN 20',
        executeText: 'Promoting 20 into the root to form [10 | 20]. The leaf splits into [12 | 17] and [30]. All 3 children are now linked.',
        resultTitle: 'FINAL TREE — ALL 8 KEYS INSERTED',
        resultText: 'Root is [10 | 20] with three children: [5 | 6 | 7], [12 | 17], and [30]. Every node satisfies the B-Tree rules. Perfect balance at depth 2!',
        statusExplain: { type: 'red', label: 'NODE FULL — SPLIT REQUIRED' },
        statusExecute: { type: 'amber', label: 'SPLIT & PROMOTE' },
        statusResult: { type: 'green', label: 'CONSTRUCTION COMPLETE ✓' },
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
            2: { statusType: 'purple', nodeMessage: 'LEFT [12, 17]' },
            4: { statusType: 'purple', nodeMessage: 'RIGHT [30]' }
          },
          edges: { '3-2': true, '3-4': true }
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

  const { stepIndex, phase } = useBTreeAnimator(steps, isActive)
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
          padding: '32px 56px 28px 56px',
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
              gap: '20px',
              alignItems: 'center',
              background: 'linear-gradient(145deg, rgba(11, 16, 28, 0.9), rgba(8, 12, 22, 0.95))',
              borderRadius: '16px',
              border: `1px solid ${sc.border}`,
              padding: '20px 28px',
              boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${sc.bg}`,
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
                const isActive = idx === stepIndex
                const isPast = idx < stepIndex
                return (
                  <div
                    key={idx}
                    style={{
                      width: isActive ? '10px' : '6px',
                      height: isActive ? '10px' : '6px',
                      borderRadius: '50%',
                      background: isActive ? sc.color : isPast ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
                      boxShadow: isActive ? `0 0 8px ${sc.color}` : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
