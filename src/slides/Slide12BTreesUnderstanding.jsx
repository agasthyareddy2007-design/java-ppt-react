import React from 'react'

export default function Slide12BTreesUnderstanding({ isActive }) {
  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div
        className="slide-content-wrapper"
        style={{
          padding: '40px 64px 36px 64px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'flex-start',
          gap: '0'
        }}
      >
        {/* Slide Header */}
        <div className="slide-header reveal" style={{ margin: '0 0 28px 0', flexShrink: 0 }}>
          <h2 className="slide-title" style={{ margin: 0, fontSize: '44px' }}>
            B-Trees: How They Work
          </h2>
        </div>

        {/* Main Content — Three Sections */}
        <div
          className="reveal delay-1"
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '24px',
            minHeight: 0
          }}
        >
          {/* ──────────────────────────────────────────────── */}
          {/* SECTION 1 — What is a B-Tree? (Top Left)        */}
          {/* ──────────────────────────────────────────────── */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 36px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.72), rgba(11, 17, 29, 0.82))',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px'
            }}
          >
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: 'var(--jvm-cyan)',
                boxShadow: '0 0 12px var(--jvm-cyan)'
              }} />
              <span className="mono" style={{
                fontSize: '13px', color: 'var(--jvm-cyan)',
                fontWeight: 800, letterSpacing: '0.06em'
              }}>
                WHAT IS A B-TREE?
              </span>
            </div>

            {/* Plain-language explanation */}
            <p style={{
              fontSize: '18px', color: 'var(--text-main)',
              lineHeight: '1.7', margin: 0
            }}>
              A B-Tree is a search tree that stores <strong>several sorted keys</strong> in
              each node. Each node can also have <strong>multiple children</strong>. This
              helps the tree stay short and organized, even when it stores lots of data.
            </p>

            {/* Large visual node: [10 | 20 | 30] */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '10px'
            }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center',
                  background: '#090e17',
                  border: '3px solid var(--jvm-cyan)',
                  borderRadius: '16px',
                  boxShadow: '0 0 32px rgba(6, 182, 212, 0.3)',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  padding: '16px 40px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '28px', fontWeight: 900, color: '#ffffff'
                }}>10</div>
                <div style={{
                  width: '2px', height: '48px',
                  background: 'rgba(255, 255, 255, 0.25)'
                }} />
                <div style={{
                  padding: '16px 40px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '28px', fontWeight: 900, color: '#ffffff'
                }}>20</div>
                <div style={{
                  width: '2px', height: '48px',
                  background: 'rgba(255, 255, 255, 0.25)'
                }} />
                <div style={{
                  padding: '16px 40px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '28px', fontWeight: 900, color: '#ffffff'
                }}>30</div>
              </div>
              <span style={{
                fontSize: '14px', color: 'var(--text-dim)',
                fontStyle: 'italic'
              }}>
                One node holding three keys — sorted from smallest to largest
              </span>
            </div>
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/* SECTION 2 — What does t = 2 mean? (Top Right)   */}
          {/* ──────────────────────────────────────────────── */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 36px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(20, 24, 38, 0.72), rgba(12, 16, 27, 0.82))',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: 'var(--jvm-amber)',
                boxShadow: '0 0 12px var(--jvm-amber)'
              }} />
              <span className="mono" style={{
                fontSize: '13px', color: 'var(--jvm-amber)',
                fontWeight: 800, letterSpacing: '0.06em'
              }}>
                WHAT DOES t = 2 MEAN?
              </span>
            </div>

            {/* Explanation */}
            <p style={{
              fontSize: '16px', color: 'var(--text-main)',
              lineHeight: '1.6', margin: 0
            }}>
              <strong style={{ color: 'var(--jvm-amber)' }}>t</strong> is the{' '}
              <strong>minimum degree</strong>. It controls how many keys and children
              each node can hold. For <strong>t&nbsp;=&nbsp;2</strong>:
            </p>

            {/* Four prominent rules */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '12px', flex: 1
            }}>
              {/* Rule 1 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '16px 20px', borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: '4px'
              }}>
                <span className="mono" style={{
                  color: 'var(--text-dim)', fontSize: '11px',
                  fontWeight: 700, letterSpacing: '0.04em'
                }}>MAX KEYS PER NODE</span>
                <div className="mono" style={{
                  fontSize: '24px', color: '#ffffff', fontWeight: 900
                }}>
                  2 × 2 − 1 = <span style={{ color: 'var(--jvm-rose)' }}>3</span>
                </div>
              </div>

              {/* Rule 2 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '16px 20px', borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: '4px'
              }}>
                <span className="mono" style={{
                  color: 'var(--text-dim)', fontSize: '11px',
                  fontWeight: 700, letterSpacing: '0.04em'
                }}>MIN KEYS (NON-ROOT)</span>
                <div className="mono" style={{
                  fontSize: '24px', color: '#ffffff', fontWeight: 900
                }}>
                  2 − 1 = <span style={{ color: 'var(--jvm-cyan)' }}>1</span>
                </div>
              </div>

              {/* Rule 3 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '16px 20px', borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: '4px'
              }}>
                <span className="mono" style={{
                  color: 'var(--text-dim)', fontSize: '11px',
                  fontWeight: 700, letterSpacing: '0.04em'
                }}>MAX CHILDREN</span>
                <div className="mono" style={{
                  fontSize: '24px', color: '#ffffff', fontWeight: 900
                }}>
                  2 × 2 = <span style={{ color: 'var(--jvm-amber)' }}>4</span>
                </div>
              </div>

              {/* Rule 4 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '16px 20px', borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: '4px'
              }}>
                <span className="mono" style={{
                  color: 'var(--text-dim)', fontSize: '11px',
                  fontWeight: 700, letterSpacing: '0.04em'
                }}>MIN CHILDREN (NON-ROOT)</span>
                <div className="mono" style={{
                  fontSize: '24px', color: '#ffffff', fontWeight: 900
                }}>
                  t = <span style={{ color: 'var(--jvm-emerald)' }}>2</span>
                </div>
              </div>
            </div>

            {/* Root special note */}
            <div style={{
              fontSize: '14px', color: 'var(--text-dim)',
              lineHeight: 1.5, marginTop: '2px'
            }}>
              <strong style={{ color: '#fff' }}>Root exception:</strong> The root
              does not need the same minimum. It can hold as few as 1 key, or 0 if the
              tree is empty.
            </div>
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/* SECTION 3 — Why B-Trees Matter (Full Bottom)    */}
          {/* ──────────────────────────────────────────────── */}
          <div
            className="glass-panel reveal delay-2"
            style={{
              gridColumn: '1 / -1',
              padding: '28px 40px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(16, 24, 38, 0.72), rgba(10, 15, 26, 0.82))',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: 'var(--jvm-emerald)',
                boxShadow: '0 0 12px var(--jvm-emerald)'
              }} />
              <span className="mono" style={{
                fontSize: '13px', color: 'var(--jvm-emerald)',
                fontWeight: 800, letterSpacing: '0.06em'
              }}>
                WHY B-TREES MATTER
              </span>
            </div>

            {/* Three properties in a row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px'
            }}>
              {/* Property 1 — Sorted Keys */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '14px', padding: '22px 24px',
                display: 'flex', flexDirection: 'column', gap: '8px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <span style={{
                    color: 'var(--jvm-emerald)', fontWeight: 900,
                    fontSize: '20px', lineHeight: 1
                  }}>✓</span>
                  <strong style={{ fontSize: '17px', color: '#fff' }}>
                    Keys are always sorted
                  </strong>
                </div>
                <p style={{
                  fontSize: '15px', color: 'var(--text-dim)',
                  lineHeight: 1.55, margin: 0
                }}>
                  Every node keeps its keys in order from smallest to largest. This
                  makes searching fast — you always know which child to follow.
                </p>
              </div>

              {/* Property 2 — Balanced */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '14px', padding: '22px 24px',
                display: 'flex', flexDirection: 'column', gap: '8px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <span style={{
                    color: 'var(--jvm-emerald)', fontWeight: 900,
                    fontSize: '20px', lineHeight: 1
                  }}>✓</span>
                  <strong style={{ fontSize: '17px', color: '#fff' }}>
                    The tree stays balanced
                  </strong>
                </div>
                <p style={{
                  fontSize: '15px', color: 'var(--text-dim)',
                  lineHeight: 1.55, margin: 0
                }}>
                  Every leaf lives at the same depth. When a node overflows, it splits
                  upward. When it underflows, it borrows or merges with a sibling.
                </p>
              </div>

              {/* Property 3 — Real-world usage */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '14px', padding: '22px 24px',
                display: 'flex', flexDirection: 'column', gap: '8px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <span style={{
                    color: 'var(--jvm-emerald)', fontWeight: 900,
                    fontSize: '20px', lineHeight: 1
                  }}>✓</span>
                  <strong style={{ fontSize: '17px', color: '#fff' }}>
                    Used everywhere
                  </strong>
                </div>
                <p style={{
                  fontSize: '15px', color: 'var(--text-dim)',
                  lineHeight: 1.55, margin: 0
                }}>
                  Databases like MySQL, PostgreSQL, and SQLite use B-Trees for
                  indexing. File systems such as NTFS, Btrfs, and APFS rely on them too.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
