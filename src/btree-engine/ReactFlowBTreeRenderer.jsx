import React, { useEffect, useState } from 'react'
import { ReactFlow, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ELK from 'elkjs/lib/elk.bundled.js'

const elk = new ELK()

function BTreeNodeComponent({ data }) {
  const { keys, highlight = false, message = '', isOverflow = false, isUnderflow = false, isNewRoot = false } = data

  let borderColor = 'rgba(6, 182, 212, 0.6)'
  let bgColor = '#0f172a'
  let glowShadow = '0 12px 35px rgba(0, 0, 0, 0.7)'

  if (highlight) {
    borderColor = 'var(--jvm-cyan)'
    bgColor = 'rgba(6, 182, 212, 0.35)'
    glowShadow = '0 0 35px rgba(6, 182, 212, 0.7)'
  }
  if (isOverflow) {
    borderColor = 'var(--jvm-rose)'
    bgColor = 'rgba(244, 63, 94, 0.4)'
    glowShadow = '0 0 45px rgba(244, 63, 94, 0.9)'
  } else if (isUnderflow) {
    borderColor = 'var(--jvm-amber)'
    bgColor = 'rgba(245, 158, 11, 0.4)'
    glowShadow = '0 0 40px rgba(245, 158, 11, 0.8)'
  } else if (isNewRoot) {
    borderColor = 'var(--jvm-purple)'
    bgColor = 'rgba(168, 85, 247, 0.4)'
    glowShadow = '0 0 40px rgba(168, 85, 247, 0.8)'
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {message && (
        <div style={{
          position: 'absolute',
          top: '-38px',
          whiteSpace: 'nowrap',
          background: isOverflow ? 'var(--jvm-rose)' : isUnderflow ? 'var(--jvm-amber)' : 'var(--jvm-cyan)',
          color: '#000',
          fontWeight: 900,
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          padding: '4px 12px',
          borderRadius: '6px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.85)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          zIndex: 10
        }}>
          {message}
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: bgColor,
        border: `2.5px solid ${borderColor}`,
        borderRadius: '16px',
        boxShadow: glowShadow,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        padding: '4px'
      }}>
        {keys.map((k, idx) => (
          <React.Fragment key={idx}>
            <div style={{
              padding: '16px 28px',
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              fontWeight: 900,
              color: '#ffffff',
              minWidth: '54px',
              textAlign: 'center'
            }}>
              {k}
            </div>
            {idx < keys.length - 1 && (
              <div style={{ width: '2px', height: '44px', background: 'rgba(255, 255, 255, 0.25)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

const nodeTypes = { btreeNode: BTreeNodeComponent }

export default function ReactFlowBTreeRenderer({
  nodeData,
  highlightData = { nodes: {}, edges: {} },
  width = 1800,
  height = 900,
  teachingOverlay = null
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    if (!nodeData || !nodeData.name || !nodeData.name.keys) return

    const elkNodes = []
    const elkEdges = []

    const processNode = (node) => {
      const id = String(node.name.id)
      const keys = node.name.keys || []
      const w = Math.max(120, keys.length * 65 + 40)
      const h = 70

      elkNodes.push({
        id,
        width: w,
        height: h,
        data: { keys, node }
      })

      if (node.children) {
        node.children.forEach(child => {
          const childId = String(child.name.id)
          elkEdges.push({
            id: `e-${id}-${childId}`,
            sources: [id],
            targets: [childId]
          })
          processNode(child)
        })
      }
    }

    processNode(nodeData)

    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'DOWN',
        'elk.spacing.nodeNode': '60',
        'layered.spacing.nodeNodeBetweenLayers': '90',
        'elk.alignment': 'CENTER'
      },
      children: elkNodes,
      edges: elkEdges
    }

    elk.layout(graph).then(layouted => {
      const flowNodes = layouted.children.map(n => {
        const id = n.id
        const nodeHigh = highlightData.nodes && highlightData.nodes[id]
        const fullHighlight = nodeHigh ? nodeHigh.fullHighlight : false
        const nodeMessage = nodeHigh ? nodeHigh.nodeMessage : ''

        return {
          id,
          type: 'btreeNode',
          position: { x: n.x, y: n.y },
          data: {
            keys: n.data.keys,
            highlight: fullHighlight,
            message: nodeMessage,
            isOverflow: nodeMessage.toLowerCase().includes('overflow') || nodeMessage.toLowerCase().includes('split'),
            isUnderflow: nodeMessage.toLowerCase().includes('underflow'),
            isNewRoot: nodeMessage.toLowerCase().includes('root')
          }
        }
      })

      const flowEdges = layouted.edges.map(e => {
        const edgeId = `${e.sources[0]}${e.targets[0]}`
        const isEdgeHigh = highlightData.edges && highlightData.edges[edgeId]

        return {
          id: e.id,
          source: e.sources[0],
          target: e.targets[0],
          type: 'smoothstep',
          style: {
            stroke: isEdgeHigh ? 'var(--jvm-cyan)' : 'rgba(255, 255, 255, 0.35)',
            strokeWidth: isEdgeHigh ? 4.5 : 3
          }
        }
      })

      setNodes(flowNodes)
      setEdges(flowEdges)
    }).catch(err => console.error('ELK Layout error:', err))

  }, [nodeData, highlightData])

  // Semantic status colors for teaching overlay
  const getStatusColor = (type) => {
    switch (type) {
      case 'inspect': return { color: '#06b6d4', bg: 'rgba(6,182,212,0.18)', border: 'rgba(6,182,212,0.5)' }
      case 'safe': return { color: '#10b981', bg: 'rgba(16,185,129,0.18)', border: 'rgba(16,185,129,0.5)' }
      case 'overflow': return { color: '#f43f5e', bg: 'rgba(244,63,94,0.18)', border: 'rgba(244,63,94,0.5)' }
      case 'split': return { color: '#f59e0b', bg: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.5)' }
      case 'updated': return { color: '#a855f7', bg: 'rgba(168,85,247,0.18)', border: 'rgba(168,85,247,0.5)' }
      default: return { color: '#06b6d4', bg: 'rgba(6,182,212,0.18)', border: 'rgba(6,182,212,0.5)' }
    }
  }

  const sc = teachingOverlay ? getStatusColor(teachingOverlay.statusType) : null

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(10,14,24,0.98) 0%, rgba(6,9,16,0.99) 100%)',
      borderRadius: '24px',
      border: '1px solid rgba(6,182,212,0.35)',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 60px rgba(0,0,0,0.85), 0 25px 60px rgba(0,0,0,0.6)'
    }}>
      {/* Floating Canvas Teaching Overlay Card (INSIDE the canvas) */}
      {teachingOverlay && (
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 20,
          width: '410px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(20px)',
          border: `1.5px solid ${sc.border}`,
          borderRadius: '16px',
          padding: '20px 22px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: '11px', color: sc.color, fontWeight: 900, background: sc.bg, padding: '3px 10px', borderRadius: '5px', letterSpacing: '0.05em' }}>
              {teachingOverlay.stepLabel}
            </span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              {teachingOverlay.progressLabel}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '15px', color: '#fff', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              {teachingOverlay.statusTitle}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.55, margin: 0 }}>
              {teachingOverlay.explanation}
            </p>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={false}
        attributionPosition="bottom-left"
      >
        <Background color="rgba(6, 182, 212, 0.08)" gap={36} />
      </ReactFlow>
    </div>
  )
}
