import test from 'node:test'
import assert from 'node:assert/strict'
import BTree from '../src/btree-engine/BTree.js'

// Helper to validate B-Tree invariants for degree t = 2 (maxKeys = 3)
function validateBTreeInvariants(node, isRoot = true, minDegree = 2) {
  const maxKeys = 2 * minDegree - 1 // 3
  const minKeys = minDegree - 1 // 1
  const keys = node.name.keys.map(Number)

  // 1. Keys sorted in ascending order
  for (let i = 0; i < keys.length - 1; i++) {
    assert.ok(keys[i] < keys[i + 1], `Keys must be strictly ascending: ${keys.join(', ')}`)
  }

  // 2. Capacity bounds
  assert.ok(keys.length <= maxKeys, `Node has ${keys.length} keys, exceeding max ${maxKeys}`)
  if (!isRoot) {
    assert.ok(keys.length >= minKeys, `Non-root node has ${keys.length} keys, below min ${minKeys}`)
  }

  // 3. Children bounds
  if (node.children && node.children.length > 0) {
    assert.equal(
      node.children.length,
      keys.length + 1,
      `Internal node with ${keys.length} keys must have ${keys.length + 1} children`
    )

    // Check separator keys partition child values
    node.children.forEach((child, cIdx) => {
      const childKeys = child.name.keys.map(Number)
      if (cIdx > 0) {
        const lowerBound = keys[cIdx - 1]
        childKeys.forEach(ck => {
          assert.ok(ck > lowerBound, `Child key ${ck} must be > parent separator ${lowerBound}`)
        })
      }
      if (cIdx < keys.length) {
        const upperBound = keys[cIdx]
        childKeys.forEach(ck => {
          assert.ok(ck < upperBound, `Child key ${ck} must be < parent separator ${upperBound}`)
        })
      }
      validateBTreeInvariants(child, false, minDegree)
    })
  }
}

// Helper to check uniform leaf depth
function getLeafDepths(node, currentDepth = 0) {
  if (!node.children || node.children.length === 0) {
    return [currentDepth]
  }
  return node.children.flatMap(c => getLeafDepths(c, currentDepth + 1))
}

test('B-Tree (t = 2): Insertion Sequence 10, 20, 5, 6, 12, 30, 7, 17', () => {
  const tree = new BTree(3)
  const keys = [10, 20, 5, 6, 12, 30, 7, 17]

  // Step 1: Insert 10
  tree.add(10)
  assert.deepEqual(tree.toNodeData().name.keys, ['10'])

  // Step 2: Insert 20
  tree.add(20)
  assert.deepEqual(tree.toNodeData().name.keys, ['10', '20'])

  // Step 3: Insert 5
  tree.add(5)
  assert.deepEqual(tree.toNodeData().name.keys, ['5', '10', '20'])

  // Step 4: Insert 6 -> Root split! Median 10 promoted to new root
  tree.add(6)
  const data4 = tree.toNodeData()
  assert.deepEqual(data4.name.keys, ['10'], 'Median 10 must be promoted to root')
  assert.equal(data4.children.length, 2, 'Root must have 2 children')
  assert.deepEqual(data4.children[0].name.keys, ['5', '6'])
  assert.deepEqual(data4.children[1].name.keys, ['20'])

  // Step 5: Insert 12
  tree.add(12)
  const data5 = tree.toNodeData()
  assert.deepEqual(data5.name.keys, ['10'])
  assert.deepEqual(data5.children[1].name.keys, ['12', '20'])

  // Step 6: Insert 30
  tree.add(30)
  const data6 = tree.toNodeData()
  assert.deepEqual(data6.children[1].name.keys, ['12', '20', '30'], 'Right leaf should be full (3 keys)')

  // Step 7: Insert 7
  tree.add(7)
  const data7 = tree.toNodeData()
  assert.deepEqual(data7.children[0].name.keys, ['5', '6', '7'], 'Left leaf should be full (3 keys)')

  // Step 8: Insert 17 -> Leaf split! Median 20 promoted into root
  tree.add(17)
  const finalData = tree.toNodeData()

  // Verify Expected Final Tree:
  // Root: [10 | 20]
  // Children: [5 | 6 | 7], [12 | 17], [30]
  assert.deepEqual(finalData.name.keys, ['10', '20'], 'Final root must be [10, 20]')
  assert.equal(finalData.children.length, 3, 'Final root must have exactly 3 children')
  assert.deepEqual(finalData.children[0].name.keys, ['5', '6', '7'])
  assert.deepEqual(finalData.children[1].name.keys, ['12', '17'])
  assert.deepEqual(finalData.children[2].name.keys, ['30'])

  // Invariant validation
  validateBTreeInvariants(finalData, true, 2)

  // Verify uniform leaf depth
  const depths = getLeafDepths(finalData)
  assert.ok(depths.every(d => d === depths[0]), 'All leaves must reside at the exact same depth')
  assert.equal(depths[0], 1, 'All leaves must be at depth 1')
})

test('B-Tree (t = 2): Search Operations', () => {
  const tree = new BTree(3)
  ;[10, 20, 5, 6, 12, 30, 7, 17].forEach(k => tree.add(k))

  assert.equal(tree.contains(17), true, 'Key 17 must be found')
  assert.equal(tree.contains(10), true, 'Root key 10 must be found')
  assert.equal(tree.contains(30), true, 'Leaf key 30 must be found')
  assert.equal(tree.contains(25), false, 'Key 25 must NOT be found')
  assert.equal(tree.contains(1), false, 'Key 1 must NOT be found')
})

test('B-Tree (t = 2): Deletion Cases (Direct, Borrowing, Merging)', () => {
  const tree = new BTree(3)
  ;[10, 20, 5, 6, 12, 30, 7, 17].forEach(k => tree.add(k))

  // Case 1: Direct leaf deletion (Remove 6 from [5, 6, 7])
  tree.remove(6)
  const d1 = tree.toNodeData()
  assert.deepEqual(d1.children[0].name.keys, ['5', '7'])
  validateBTreeInvariants(d1, true, 2)

  // Case 2: Borrowing from sibling (Remove 30 from leaf [30])
  // Underflow: borrows from [12, 17] via root rotation
  tree.remove(30)
  const d2 = tree.toNodeData()
  assert.deepEqual(d2.name.keys, ['10', '17'], 'Root updated by rotation')
  assert.deepEqual(d2.children[1].name.keys, ['12'], 'Sibling lent 17')
  assert.deepEqual(d2.children[2].name.keys, ['20'], 'Right leaf received root key 20')
  validateBTreeInvariants(d2, true, 2)

  // Case 3: Internal key deletion with child merging (Remove 17 from root [10, 17])
  // Children [12] and [20] merge with 17 into [12, 20]
  tree.remove(17)
  const d3 = tree.toNodeData()
  assert.deepEqual(d3.name.keys, ['10'], 'Root now has 1 key')
  assert.equal(d3.children.length, 2, 'Root has 2 children')
  assert.deepEqual(d3.children[0].name.keys, ['5', '7'])
  assert.deepEqual(d3.children[1].name.keys, ['12', '20'], 'Merged child')
  validateBTreeInvariants(d3, true, 2)
})

test('B-Tree (t = 2): Slide 14 Searching and Deletion Sequence Invariants', () => {
  // 1. Initial State (Slide 13 final tree)
  const state0 = {
    name: { id: 3, keys: ['10', '20'] },
    children: [
      { name: { id: 1, keys: ['5', '6', '7'] } },
      { name: { id: 2, keys: ['12', '17'] } },
      { name: { id: 4, keys: ['30'] } }
    ]
  }
  validateBTreeInvariants(state0, true, 2)

  // 2. Case A: Direct Leaf Removal of 6
  const stateAfter6 = {
    name: { id: 3, keys: ['10', '20'] },
    children: [
      { name: { id: 1, keys: ['5', '7'] } },
      { name: { id: 2, keys: ['12', '17'] } },
      { name: { id: 4, keys: ['30'] } }
    ]
  }
  validateBTreeInvariants(stateAfter6, true, 2)

  // 3. Case C: Sibling Borrowing (Remove 30)
  const stateAfterBorrow30 = {
    name: { id: 3, keys: ['10', '17'] },
    children: [
      { name: { id: 1, keys: ['5', '7'] } },
      { name: { id: 2, keys: ['12'] } },
      { name: { id: 4, keys: ['20'] } }
    ]
  }
  validateBTreeInvariants(stateAfterBorrow30, true, 2)

  // 4. Case B Stage 2: After Predecessor 7 removed from left child
  const stateCaseBStage2 = {
    name: { id: 3, keys: ['7', '17'] },
    children: [
      { name: { id: 1, keys: ['5'] } },
      { name: { id: 2, keys: ['12'] } },
      { name: { id: 4, keys: ['20'] } }
    ]
  }
  validateBTreeInvariants(stateCaseBStage2, true, 2)

  // 5. Case D: Merge nodes (Remove 20, pull down 17)
  const stateAfterMerge = {
    name: { id: 3, keys: ['7'] },
    children: [
      { name: { id: 1, keys: ['5'] } },
      { name: { id: 2, keys: ['12', '17'] } }
    ]
  }
  validateBTreeInvariants(stateAfterMerge, true, 2)

  // 6. Case E: Root Collapse scenario
  const statePreCollapse = {
    name: { id: 3, keys: ['7'] },
    children: [
      { name: { id: 1, keys: ['5'] } },
      { name: { id: 2, keys: ['12'] } }
    ]
  }
  validateBTreeInvariants(statePreCollapse, true, 2)

  const statePostCollapse = {
    name: { id: 2, keys: ['7', '12'] }
  }
  validateBTreeInvariants(statePostCollapse, true, 2)
})

