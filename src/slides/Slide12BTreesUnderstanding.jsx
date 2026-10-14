import React from 'react'

export default function Slide12BTreesUnderstanding({ isActive }) {
  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div
        className="slide-content-wrapper"
        style={{
          padding: '36px 64px 44px 64px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'flex-start',
          gap: '24px'
        }}
      >
        {/* Slide Header */}
        <div className="slide-header reveal" style={{ margin: 0, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              className="mono"
              style={{
                fontSize: '13px',
                color: 'var(--jvm-cyan)',
                fontWeight: 800,
                background: 'rgba(6,182,212,0.15)',
                border: '1px solid rgba(6,182,212,0.3)',
                padding: '4px 12px',
                borderRadius: '6px',
                letterSpacing: '0.08em'
              }}
            >
              DATA STRUCTURES &amp; INDEXING
            </span>
            <span className="mono" style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              CORE THEORY &amp; DEGREE t = 2
            </span>
          </div>
          <h2 className="slide-title" style={{ margin: 0, fontSize: '42px' }}>
            B-Trees: Concept, Degree Rules &amp; Structural Invariants
          </h2>
        </div>

        {/* 2-Column Balanced Master Presentation Grid */}
        <div
          className="reveal delay-1"
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '28px',
            minHeight: 0,
            alignItems: 'stretch'
          }}
        >
          {/* COLUMN 1: What is a B-Tree + Large Node Diagram + Child Ranges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            {/* Box 1: Core Definition & Plain Language Explanation */}
            <div
              className="glass-panel"
              style={{
                padding: '28px 32px',
                borderRadius: '20px',
                background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.75), rgba(11, 17, 29, 0.85))',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--jvm-cyan)', boxShadow: '0 0 10px var(--jvm-cyan)' }} />
                <span className="mono" style={{ fontSize: '13px', color: 'var(--jvm-cyan)', fontWeight: 800, letterSpacing: '0.06em' }}>
                  01 · WHAT IS A B-TREE?
                </span>
              </div>

              <p style={{ fontSize: '17px', color: 'var(--text-main)', lineHeight: '1.65', margin: 0 }}>
                A <strong>B-Tree</strong> is a self-balancing search tree whose nodes store <strong>multiple sorted keys</strong> and can have <strong>multiple children</strong>. Unlike standard binary search trees that grow deep and tall, a B-Tree grows wide and maintains a remarkably shallow height.
              </p>
            </div>

            {/* Box 2: Visual Multi-Key Node Anatomy & Child Ranges Diagram */}
            <div
              className="glass-panel"
              style={{
                flex: 1,
                padding: '28px 32px',
                borderRadius: '20px',
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(9, 14, 26, 0.9))',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="mono" style={{ fontSize: '13px', color: 'var(--jvm-amber)', fontWeight: 800, letterSpacing: '0.06em' }}>
                    NODE ANATOMY &amp; CHILD RANGE PARTITIONING
                  </span>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                    k keys = 3  →  k + 1 children = 4
                  </span>
                </div>
                <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>
                  Three sorted separator keys partition the entire key-space into four distinct child pointer ranges:
                </p>
              </div>

              {/* Large Visual Node with 3 Keys */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '4px 0' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#090e17',
                    border: '3px solid var(--jvm-cyan)',
                    borderRadius: '16px',
                    boxShadow: '0 0 40px rgba(6, 182, 212, 0.35)',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '16px 36px', fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>
                    10
                  </div>
                  <div style={{ width: '2px', height: '48px', background: 'rgba(255, 255, 255, 0.25)' }} />
                  <div style={{ padding: '16px 36px', fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>
                    20
                  </div>
                  <div style={{ width: '2px', height: '48px', background: 'rgba(255, 255, 255, 0.25)' }} />
                  <div style={{ padding: '16px 36px', fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 900, color: '#ffffff' }}>
                    30
                  </div>
                </div>

                {/* 4 Child Range Pointer Boxes */}
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.35)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--jvm-cyan)', fontWeight: 800 }}>CHILD 0</div>
                    <div className="mono" style={{ fontSize: '15px', color: '#fff', fontWeight: 900, marginTop: '2px' }}>key &lt; 10</div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--jvm-emerald)', fontWeight: 800 }}>CHILD 1</div>
                    <div className="mono" style={{ fontSize: '15px', color: '#fff', fontWeight: 900, marginTop: '2px' }}>10 &lt; key &lt; 20</div>
                  </div>
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--jvm-amber)', fontWeight: 800 }}>CHILD 2</div>
                    <div className="mono" style={{ fontSize: '15px', color: '#fff', fontWeight: 900, marginTop: '2px' }}>20 &lt; key &lt; 30</div>
                  </div>
                  <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.35)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--jvm-purple)', fontWeight: 800 }}>CHILD 3</div>
                    <div className="mono" style={{ fontSize: '15px', color: '#fff', fontWeight: 900, marginTop: '2px' }}>key &gt; 30</div>
                  </div>
                </div>
              </div>

              {/* Bottom Insight Note */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '10px 16px', borderLeft: '3px solid var(--jvm-cyan)' }}>
                <span style={{ fontSize: '13.5px', color: 'var(--text-dim)', lineHeight: 1.45 }}>
                  <strong>Key Observation:</strong> A binary tree needs 3 nodes and depth 2 to store 3 keys. A B-Tree stores all 3 in a single contiguous block, eliminating memory pointer hops.
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Degree t = 2 Rules + Essential Invariants + Why B-Trees Matter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            {/* Box 3: Capacity Rules for Degree t = 2 */}
            <div
              className="glass-panel"
              style={{
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'linear-gradient(145deg, rgba(20, 24, 38, 0.75), rgba(12, 16, 27, 0.85))',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--jvm-amber)', boxShadow: '0 0 10px var(--jvm-amber)' }} />
                  <span className="mono" style={{ fontSize: '13px', color: 'var(--jvm-amber)', fontWeight: 800, letterSpacing: '0.06em' }}>
                    02 · MINIMUM DEGREE RULES (t = 2)
                  </span>
                </div>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--jvm-amber)', background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                  2-3-4 Tree Equivalent
                </span>
              </div>

              {/* 4 Large Formula Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span className="mono" style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: 700 }}>MAX KEYS / NODE</span>
                  <div className="mono" style={{ fontSize: '20px', color: '#ffffff', fontWeight: 900, marginTop: '2px' }}>
                    2t − 1 = <span style={{ color: 'var(--jvm-rose)' }}>3 keys</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span className="mono" style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: 700 }}>MIN KEYS (NON-ROOT)</span>
                  <div className="mono" style={{ fontSize: '20px', color: '#ffffff', fontWeight: 900, marginTop: '2px' }}>
                    t − 1 = <span style={{ color: 'var(--jvm-cyan)' }}>1 key</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span className="mono" style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: 700 }}>MAX CHILDREN / NODE</span>
                  <div className="mono" style={{ fontSize: '20px', color: '#ffffff', fontWeight: 900, marginTop: '2px' }}>
                    2t = <span style={{ color: 'var(--jvm-amber)' }}>4 children</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span className="mono" style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: 700 }}>MIN CHILDREN (INTERNAL)</span>
                  <div className="mono" style={{ fontSize: '20px', color: '#ffffff', fontWeight: 900, marginTop: '2px' }}>
                    t = <span style={{ color: 'var(--jvm-emerald)' }}>2 children</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.4, margin: '2px 0 0 0' }}>
                <strong style={{ color: '#fff' }}>Root Special Rule:</strong> The root is exempt from the minimum keys rule. It may have as few as 1 key (and 2 children), or 0 keys if the entire tree is empty.
              </div>
            </div>

            {/* Box 4: Essential Invariants & Systems Applications */}
            <div
              className="glass-panel"
              style={{
                flex: 1,
                padding: '24px 28px',
                borderRadius: '20px',
                background: 'linear-gradient(145deg, rgba(16, 24, 38, 0.75), rgba(10, 15, 26, 0.85))',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--jvm-emerald)', boxShadow: '0 0 10px var(--jvm-emerald)' }} />
                <span className="mono" style={{ fontSize: '13px', color: 'var(--jvm-emerald)', fontWeight: 800, letterSpacing: '0.06em' }}>
                  03 · ESSENTIAL PROPERTIES &amp; REAL-WORLD USAGE
                </span>
              </div>

              {/* Invariants Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--jvm-emerald)', fontWeight: 900, fontSize: '14px' }}>✓</span>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    <strong>Keys Sorted:</strong> Keys within each node are always in strictly ascending order.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--jvm-emerald)', fontWeight: 900, fontSize: '14px' }}>✓</span>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    <strong>k + 1 Children:</strong> An internal node with k keys always has exactly k + 1 children.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--jvm-emerald)', fontWeight: 900, fontSize: '14px' }}>✓</span>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    <strong>Uniform Depth:</strong> Every leaf node resides at the exact same depth (perfect balance).
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--jvm-emerald)', fontWeight: 900, fontSize: '14px' }}>✓</span>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    <strong>Self-Balancing:</strong> Overflow splits upward; underflow borrows or merges siblings.
                  </div>
                </div>
              </div>

              {/* Real World Applications Card */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--jvm-emerald)', fontWeight: 900, letterSpacing: '0.06em' }}>
                    WHY B-TREES MATTER IN PRODUCTION SYSTEMS
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-main)', marginTop: '3px', lineHeight: 1.4 }}>
                    <strong>Databases:</strong> MySQL InnoDB, PostgreSQL, SQLite B+Trees · <strong>File Systems:</strong> XFS, Btrfs, NTFS, APFS
                  </div>
                </div>

                <div
                  className="mono"
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: 'var(--jvm-emerald)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap'
                  }}
                >
                  O(log_t N) Disk I/O
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
