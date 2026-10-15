import React from 'react'

/**
 * Bulletproof Native React & SVG B-Tree Visualizer
 * Mathematically calculates node coordinates, renders cubic bezier connections,
 * and displays rich semantic indicators for B-Tree operations.
 */
export default function BTreeEngineVisualizer({
  nodeData,
  highlightData = { nodes: {}, edges: {} },
  width = 1760,
  height = 800,
  centered = false,
  large = false
}) {
  if (!nodeData || !nodeData.name || !nodeData.name.keys || nodeData.name.keys.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: '32px', opacity: 0.3 }}>∅</div>
        <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em' }}>EMPTY B-TREE</div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>No keys stored · Awaiting insertion</div>
      </div>
    )
  }

  // 1. Traverse tree to compute depth and levels
  const levels = []
  const traverse = (node, depth = 0) => {
    if (!levels[depth]) levels[depth] = []
    levels[depth].push(node)
    if (node.children) {
      node.children.forEach(c => traverse(c, depth + 1))
    }
  }
  traverse(nodeData, 0)

  const totalLevels = levels.length

  // Calculate vertical positions:
  const getYForDepth = (depth) => {
    if (large) {
      if (totalLevels === 1) return Math.round(height * 0.46)
      if (totalLevels === 2) return depth === 0 ? Math.round(height * 0.25) : Math.round(height * 0.70)
      return Math.round(height * 0.16 + depth * (height * 0.35))
    }
    if (totalLevels === 1) return height * 0.45
    if (totalLevels === 2) return depth === 0 ? 160 : 480
    return 130 + depth * 230
  }

  // 2. Assign coordinates to nodes
  const nodes = []
  const nodeCoords = {}

  levels.forEach((lvlNodes, depth) => {
    const y = getYForDepth(depth)
    const count = lvlNodes.length

    // Center nodes horizontally
    let positions = []
    if (centered) {
      if (count === 1) {
        positions = [width * 0.50]
      } else if (count === 2) {
        positions = [width * 0.35, width * 0.65]
      } else if (count === 3) {
        positions = [width * 0.22, width * 0.50, width * 0.78]
      } else {
        const margin = width * 0.12
        const available = width - margin * 2
        const step = available / (count - 1 || 1)
        positions = lvlNodes.map((_, i) => margin + i * step)
      }
    } else {
      if (count === 1) {
        positions = [width * 0.52] // slightly right to balance overlay on left
      } else if (count === 2) {
        positions = [width * 0.38, width * 0.66]
      } else if (count === 3) {
        positions = [width * 0.30, width * 0.52, width * 0.74]
      } else {
        const margin = width * 0.18
        const available = width - margin * 2
        const step = available / (count - 1 || 1)
        positions = lvlNodes.map((_, i) => margin + i * step)
      }
    }

    lvlNodes.forEach((n, idx) => {
      const x = positions[idx]
      const id = String(n.name.id)
      nodeCoords[id] = { x, y, node: n }
      nodes.push({ x, y, id, node: n })
    })
  })

  // 3. Build edges between parent and children
  const edges = []
  const buildEdges = (node) => {
    const parentCoord = nodeCoords[String(node.name.id)]
    if (node.children) {
      node.children.forEach((child) => {
        const childCoord = nodeCoords[String(child.name.id)]
        if (childCoord && parentCoord) {
          edges.push({
            x1: parentCoord.x,
            y1: parentCoord.y + (large ? 38 : 30),
            x2: childCoord.x,
            y2: childCoord.y - (large ? 40 : 32),
            fromId: String(node.name.id),
            toId: String(child.name.id)
          })
        }
        buildEdges(child)
      })
    }
  }
  buildEdges(nodeData)

  // Semantic styles for nodes
  const getSemanticNodeStyle = (type, isDefaultHighlight) => {
    switch (type) {
      case 'cyan':
      case 'inspect':
      case 'compare':
        return {
          borderColor: 'var(--jvm-cyan)',
          bgColor: 'rgba(6, 182, 212, 0.22)',
          glow: '0 0 35px rgba(6, 182, 212, 0.7)',
          badgeBg: 'var(--jvm-cyan)',
          badgeText: '#000'
        }
      case 'red':
      case 'overflow':
      case 'split-required':
        return {
          borderColor: 'var(--jvm-rose)',
          bgColor: 'rgba(244, 63, 94, 0.28)',
          glow: '0 0 40px rgba(244, 63, 94, 0.85)',
          badgeBg: 'var(--jvm-rose)',
          badgeText: '#fff'
        }
      case 'amber':
      case 'split':
      case 'promotion':
      case 'borrow':
      case 'merge':
      case 'underflow':
        return {
          borderColor: 'var(--jvm-amber)',
          bgColor: 'rgba(245, 158, 11, 0.26)',
          glow: '0 0 35px rgba(245, 158, 11, 0.75)',
          badgeBg: 'var(--jvm-amber)',
          badgeText: '#000'
        }
      case 'green':
      case 'safe':
      case 'success':
        return {
          borderColor: 'var(--jvm-emerald)',
          bgColor: 'rgba(16, 185, 129, 0.24)',
          glow: '0 0 30px rgba(16, 185, 129, 0.7)',
          badgeBg: 'var(--jvm-emerald)',
          badgeText: '#000'
        }
      case 'purple':
      case 'updated':
      case 'structural':
        return {
          borderColor: 'var(--jvm-purple)',
          bgColor: 'rgba(168, 85, 247, 0.26)',
          glow: '0 0 35px rgba(168, 85, 247, 0.75)',
          badgeBg: 'var(--jvm-purple)',
          badgeText: '#fff'
        }
      default:
        if (isDefaultHighlight) {
          return {
            borderColor: 'var(--jvm-cyan)',
            bgColor: 'rgba(6, 182, 212, 0.22)',
            glow: '0 0 35px rgba(6, 182, 212, 0.7)',
            badgeBg: 'var(--jvm-cyan)',
            badgeText: '#000'
          }
        }
        return {
          borderColor: 'rgba(255, 255, 255, 0.16)',
          bgColor: 'rgba(15, 23, 42, 0.85)',
          glow: '0 10px 25px rgba(0, 0, 0, 0.6)',
          badgeBg: 'transparent',
          badgeText: 'transparent'
        }
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: `${height}px`, overflow: 'hidden' }}>
      {/* SVG Connecting Curves */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <filter id="glow-curve" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {edges.map((e, idx) => {
          const isEdgeHigh = highlightData.edges && (
            highlightData.edges[`${e.fromId}-${e.toId}`] ||
            highlightData.edges[`${e.fromId}${e.toId}`]
          )
          const midY = (e.y1 + e.y2) / 2
          const pathD = `M ${e.x1} ${e.y1} C ${e.x1} ${midY}, ${e.x2} ${midY}, ${e.x2} ${e.y2}`
          return (
            <path
              key={idx}
              d={pathD}
              fill="none"
              stroke={isEdgeHigh ? 'var(--jvm-cyan)' : 'rgba(255, 255, 255, 0.22)'}
              strokeWidth={isEdgeHigh ? 4 : 2}
              filter={isEdgeHigh ? 'url(#glow-curve)' : 'none'}
              style={{ transition: 'all 0.4s ease' }}
            />
          )
        })}
      </svg>

      {/* Render B-Tree Nodes */}
      {nodes.map((pos) => {
        const id = pos.id
        const keys = pos.node.name.keys || []
        const nodeHigh = (highlightData.nodes && (highlightData.nodes[id] || highlightData.nodes[Number(id)])) || null
        const fullHighlight = nodeHigh ? nodeHigh.fullHighlight : false
        const nodeMessage = nodeHigh ? nodeHigh.nodeMessage : ''
        const indexHighlights = (nodeHigh && nodeHigh.indexHighlights) || []
        const highlightedKeys = (nodeHigh && nodeHigh.highlightedKeys) || []

        // Infer semantic type if not explicitly provided
        let semanticType = nodeHigh ? nodeHigh.statusType : null
        if (!semanticType && nodeMessage) {
          const msg = nodeMessage.toLowerCase()
          if (msg.includes('overflow') || msg.includes('full')) semanticType = 'red'
          else if (msg.includes('split') || msg.includes('promotion') || msg.includes('borrow') || msg.includes('underflow')) semanticType = 'amber'
          else if (msg.includes('root') || msg.includes('structural')) semanticType = 'purple'
          else if (msg.includes('safe') || msg.includes('success')) semanticType = 'green'
          else if (msg.includes('inspect') || msg.includes('search') || msg.includes('found')) semanticType = 'cyan'
        }

        const style = getSemanticNodeStyle(semanticType, fullHighlight)

        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: fullHighlight || nodeMessage ? 20 : 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Status Message Badge Above Node */}
            {nodeMessage && (
              <div
                style={{
                  position: 'absolute',
                  top: large ? '-40px' : '-36px',
                  whiteSpace: 'nowrap',
                  background: style.badgeBg,
                  color: style.badgeText,
                  fontWeight: 900,
                  fontSize: large ? '12px' : '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: large ? '5px 14px' : '4px 12px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.85)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {nodeMessage}
              </div>
            )}

            {/* Unified B-Tree Node Box Containing Key Compartments */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: style.bgColor,
                border: `${large ? 3 : 2.5}px solid ${style.borderColor}`,
                borderRadius: large ? '16px' : '14px',
                boxShadow: style.glow,
                backdropFilter: 'blur(16px)',
                overflow: 'hidden',
                padding: '2px',
                transition: 'all 0.4s ease'
              }}
            >
              {keys.map((k, kIdx) => {
                const isKeyHigh = indexHighlights.includes(kIdx) || highlightedKeys.includes(k) || highlightedKeys.includes(Number(k))
                return (
                  <React.Fragment key={kIdx}>
                    <div
                      style={{
                        padding: large ? '16px 32px' : '14px 28px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: large ? '26px' : '22px',
                        fontWeight: 900,
                        color: isKeyHigh ? 'var(--jvm-amber)' : '#ffffff',
                        background: isKeyHigh ? 'rgba(245, 158, 11, 0.35)' : 'transparent',
                        minWidth: large ? '58px' : '50px',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: isKeyHigh ? 'inset 0 0 14px rgba(245, 158, 11, 0.4)' : 'none'
                      }}
                    >
                      {k}
                    </div>
                    {kIdx < keys.length - 1 && (
                      <div
                        style={{
                          width: '2px',
                          height: large ? '48px' : '42px',
                          background: 'rgba(255, 255, 255, 0.25)'
                        }}
                      />
                    )}
                  </React.Fragment>
                )
              })}
            </div>

            {/* Capacity Indicator below node (shows occupancy e.g. "3 / 3 keys [FULL]") */}
            <div
              className="mono"
              style={{
                marginTop: large ? '8px' : '6px',
                fontSize: large ? '11px' : '10px',
                color: keys.length === 3 ? 'var(--jvm-rose)' : 'var(--text-dim)',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              {keys.length} / 3 keys {keys.length === 3 ? '· FULL' : ''}
            </div>
          </div>
        )
      })}
    </div>
  )
}
