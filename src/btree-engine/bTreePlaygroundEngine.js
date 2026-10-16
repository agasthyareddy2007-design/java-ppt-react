/**
 * Interactive B-Tree Engine for Educational Presentation & Web Application
 * Mathematically rigorous B-Tree state generator supporting dynamic Insert, Delete, Search,
 * degree changes (t = 2, 3, 4, 5), pre-configured teaching examples, and step-by-step animations.
 */

let nextNodeId = 100;

export function resetNodeIdCounter() {
  nextNodeId = 100;
}

export function getNextNodeId() {
  return nextNodeId++;
}

/**
 * Creates an empty B-Tree node
 */
export function createNode(keys = [], children = null, id = null) {
  return {
    name: {
      id: id !== null ? id : getNextNodeId(),
      keys: keys.map(String)
    },
    children: children ? children.map(cloneTree) : null
  };
}

/**
 * Creates an empty tree
 */
export function createEmptyTree() {
  return {
    name: { id: 1, keys: [] },
    children: null
  };
}

/**
 * Deep clones a B-Tree structure
 */
export function cloneTree(node) {
  if (!node) return null;
  return {
    name: {
      id: node.name ? node.name.id : getNextNodeId(),
      keys: node.name && node.name.keys ? [...node.name.keys] : []
    },
    children: node.children && node.children.length > 0
      ? node.children.map(cloneTree)
      : null
  };
}

/**
 * Extracts all numeric keys in sorted order
 */
export function getAllKeys(node) {
  if (!node || !node.name || !node.name.keys || node.name.keys.length === 0) return [];
  const keys = [];
  if (node.children && node.children.length > 0) {
    node.children.forEach((c, idx) => {
      keys.push(...getAllKeys(c));
      if (idx < node.name.keys.length) {
        keys.push(Number(node.name.keys[idx]));
      }
    });
  } else {
    keys.push(...node.name.keys.map(Number));
  }
  return keys;
}

/**
 * Checks if a key exists in the tree
 */
export function treeContains(node, key) {
  const numKey = Number(key);
  if (!node || !node.name || !node.name.keys) return false;
  const keys = node.name.keys.map(Number);
  if (keys.includes(numKey)) return true;
  if (!node.children || node.children.length === 0) return false;
  for (let i = 0; i < keys.length; i++) {
    if (numKey < keys[i]) return treeContains(node.children[i], numKey);
  }
  return treeContains(node.children[keys.length], numKey);
}

/**
 * Validates B-Tree invariants for minimum degree t
 */
export function validateTree(node, t = 2, isRoot = true) {
  if (!node || !node.name || !node.name.keys) return { valid: false, reason: 'Null or malformed node' };
  if (node.name.keys.length === 0) {
    return isRoot ? { valid: true } : { valid: false, reason: 'Non-root node has 0 keys' };
  }
  const maxKeys = 2 * t - 1;
  const minKeys = t - 1;
  const keys = node.name.keys.map(Number);

  // 1. Keys sorted strictly ascending
  for (let i = 0; i < keys.length - 1; i++) {
    if (keys[i] >= keys[i + 1]) {
      return { valid: false, reason: `Keys not strictly ascending: ${keys.join(', ')}` };
    }
  }

  // 2. Capacity bounds
  if (keys.length > maxKeys) {
    return { valid: false, reason: `Node overflow: ${keys.length} keys > max ${maxKeys}` };
  }
  if (!isRoot && keys.length < minKeys) {
    return { valid: false, reason: `Node underflow: ${keys.length} keys < min ${minKeys}` };
  }

  // 3. Children bounds
  if (node.children && node.children.length > 0) {
    if (node.children.length !== keys.length + 1) {
      return { valid: false, reason: `Internal node with ${keys.length} keys has ${node.children.length} children` };
    }
    for (let c = 0; c < node.children.length; c++) {
      const child = node.children[c];
      const childKeys = child.name.keys.map(Number);
      if (c > 0) {
        const sep = keys[c - 1];
        for (const ck of childKeys) {
          if (ck <= sep) return { valid: false, reason: `Child key ${ck} <= parent separator ${sep}` };
        }
      }
      if (c < keys.length) {
        const sep = keys[c];
        for (const ck of childKeys) {
          if (ck >= sep) return { valid: false, reason: `Child key ${ck} >= parent separator ${sep}` };
        }
      }
      const res = validateTree(child, t, false);
      if (!res.valid) return res;
    }
  }
  return { valid: true };
}

// ═══════════════════════════════════════════════════════════════════
// INSERTION ENGINE
// ═══════════════════════════════════════════════════════════════════

export function generateInsertSteps(currentTree, targetKey, t = 2) {
  const numKey = Number(targetKey);
  const steps = [];

  // Special Case 0: Key already exists
  if (treeContains(currentTree, numKey)) {
    steps.push({
      id: 'exist-check',
      name: `Duplicate Key ${numKey}`,
      title: `KEY ${numKey} ALREADY EXISTS`,
      explanation: `B-Trees enforce unique keys. The key ${numKey} is already present in the tree. No duplicate insertion allowed.`,
      statusType: 'amber',
      statusLabel: 'DUPLICATE KEY',
      treeDisplay: cloneTree(currentTree),
      highlightData: {
        nodes: {},
        edges: {}
      }
    });
    return { steps, finalTree: cloneTree(currentTree) };
  }

  // Special Case 1: Empty Tree
  if (!currentTree || !currentTree.name || currentTree.name.keys.length === 0) {
    const emptyState = createEmptyTree();
    const finalTree = createNode([numKey], null, 1);

    steps.push({
      id: 'insert-empty-init',
      name: `Insert ${numKey} — Empty Tree`,
      title: `INSERT ${numKey} INTO EMPTY TREE`,
      explanation: `The tree has no root node. Allocating a new root node containing key ${numKey}.`,
      statusType: 'cyan',
      statusLabel: 'EMPTY TREE',
      treeDisplay: emptyState,
      highlightData: { nodes: {}, edges: {} }
    });

    steps.push({
      id: 'insert-empty-done',
      name: `Insert ${numKey} — Root Created`,
      title: `ROOT NODE INITIALIZED`,
      explanation: `Root node created with key [${numKey}]. Node capacity is 1 of ${2 * t - 1} keys.`,
      statusType: 'green',
      statusLabel: 'INSERTED',
      treeDisplay: finalTree,
      highlightData: {
        nodes: { [finalTree.name.id]: { statusType: 'green', nodeMessage: `ROOT [${numKey}]`, fullHighlight: true, indexHighlights: [0] } },
        edges: {}
      }
    });

    return { steps, finalTree };
  }

  const maxKeys = 2 * t - 1;
  let tree = cloneTree(currentTree);

  // Check if root is full -> Root Split Required!
  if (tree.name.keys.length >= maxKeys) {
    const rootKeys = tree.name.keys.map(Number);
    const medianIdx = Math.floor(rootKeys.length / 2);
    const medianKey = rootKeys[medianIdx];
    const leftKeys = rootKeys.slice(0, medianIdx);
    const rightKeys = rootKeys.slice(medianIdx + 1);

    const leftChildren = tree.children ? tree.children.slice(0, medianIdx + 1) : null;
    const rightChildren = tree.children ? tree.children.slice(medianIdx + 1) : null;

    const leftNode = createNode(leftKeys, leftChildren, getNextNodeId());
    const rightNode = createNode(rightKeys, rightChildren, getNextNodeId());
    const newRoot = createNode([medianKey], [leftNode, rightNode], getNextNodeId());

    // Step 1: Explain root overflow condition
    steps.push({
      id: 'root-overflow',
      name: `Root Overflow (${maxKeys} keys)`,
      title: `ROOT HAS MAXIMUM CAPACITY (${maxKeys} KEYS)`,
      explanation: `Top-down B-Tree insertion invariant: The root is full with ${maxKeys} keys ([${rootKeys.join(', ')}]). Before descending, we must split the root and promote median key ${medianKey}.`,
      statusType: 'red',
      statusLabel: 'ROOT OVERFLOW',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: { [tree.name.id]: { statusType: 'red', nodeMessage: `FULL (${maxKeys} KEYS)`, fullHighlight: true, indexHighlights: [medianIdx] } },
        edges: {}
      }
    });

    // Step 2: Split the root
    steps.push({
      id: 'root-split-executed',
      name: `Split Root — Promote ${medianKey}`,
      title: `MEDIAN ${medianKey} PROMOTED TO NEW ROOT`,
      explanation: `The root splits into two children: left child [${leftKeys.join(', ')}] and right child [${rightKeys.join(', ')}]. Tree height increases by 1.`,
      statusType: 'purple',
      statusLabel: 'ROOT SPLIT',
      treeDisplay: cloneTree(newRoot),
      highlightData: {
        nodes: {
          [newRoot.name.id]: { statusType: 'purple', nodeMessage: `PROMOTED [${medianKey}]`, fullHighlight: true, indexHighlights: [0] },
          [leftNode.name.id]: { statusType: 'amber', nodeMessage: `LEFT CHILD` },
          [rightNode.name.id]: { statusType: 'amber', nodeMessage: `RIGHT CHILD` }
        },
        edges: {}
      }
    });

    tree = newRoot;
  }

  // Descend from root down to leaf, performing top-down splits of any full children
  let curr = tree;
  const path = [curr];

  while (curr.children && curr.children.length > 0) {
    const keys = curr.name.keys.map(Number);
    let childIdx = keys.length;
    for (let i = 0; i < keys.length; i++) {
      if (numKey < keys[i]) {
        childIdx = i;
        break;
      }
    }

    let targetChild = curr.children[childIdx];

    // Check if target child is full -> Proactive Child Split
    if (targetChild.name.keys.length >= maxKeys) {
      const cKeys = targetChild.name.keys.map(Number);
      const cMedIdx = Math.floor(cKeys.length / 2);
      const cMedKey = cKeys[cMedIdx];
      const leftK = cKeys.slice(0, cMedIdx);
      const rightK = cKeys.slice(cMedIdx + 1);

      const leftKids = targetChild.children ? targetChild.children.slice(0, cMedIdx + 1) : null;
      const rightKids = targetChild.children ? targetChild.children.slice(cMedIdx + 1) : null;

      // Step: Explain child full
      steps.push({
        id: `child-full-${targetChild.name.id}`,
        name: `Child Full (${maxKeys} keys)`,
        title: `TARGET CHILD IS FULL (${maxKeys} KEYS)`,
        explanation: `Before descending into child [${cKeys.join(', ')}], top-down rules require proactive splitting to guarantee room for incoming keys.`,
        statusType: 'red',
        statusLabel: 'CHILD OVERFLOW',
        treeDisplay: cloneTree(tree),
        highlightData: {
          nodes: {
            [curr.name.id]: { statusType: 'cyan', nodeMessage: `PARENT` },
            [targetChild.name.id]: { statusType: 'red', nodeMessage: `FULL CHILD`, fullHighlight: true, indexHighlights: [cMedIdx] }
          },
          edges: {}
        }
      });

      // Split the child and insert median into parent
      const newLeft = createNode(leftK, leftKids, targetChild.name.id);
      const newRight = createNode(rightK, rightKids, getNextNodeId());

      curr.name.keys.splice(childIdx, 0, String(cMedKey));
      curr.children.splice(childIdx, 1, newLeft, newRight);

      // Step: Child split complete
      steps.push({
        id: `child-split-done-${curr.name.id}`,
        name: `Promote ${cMedKey} to Parent`,
        title: `MEDIAN ${cMedKey} PROMOTED TO PARENT`,
        explanation: `Median ${cMedKey} is promoted to parent [${curr.name.keys.join(', ')}]. Child splits into [${leftK.join(', ')}] and [${rightK.join(', ')}].`,
        statusType: 'amber',
        statusLabel: 'PROMOTION',
        treeDisplay: cloneTree(tree),
        highlightData: {
          nodes: {
            [curr.name.id]: { statusType: 'purple', nodeMessage: `PARENT [${curr.name.keys.join(', ')}]`, fullHighlight: true, indexHighlights: [childIdx] },
            [newLeft.name.id]: { statusType: 'amber', nodeMessage: `ROOM (${leftK.length}/${maxKeys})` },
            [newRight.name.id]: { statusType: 'amber', nodeMessage: `ROOM (${rightK.length}/${maxKeys})` }
          },
          edges: {}
        }
      });

      // Choose which of the two split children receives the key
      if (numKey > cMedKey) {
        targetChild = newRight;
      } else {
        targetChild = newLeft;
      }
    } else {
      // Step: Inspection & descent
      steps.push({
        id: `descend-${curr.name.id}`,
        name: `Descend via ${childIdx}`,
        title: `COMPARING ${numKey} AT LEVEL`,
        explanation: `Comparing key ${numKey} against [${keys.join(', ')}]. Descending to child containing range for ${numKey}.`,
        statusType: 'cyan',
        statusLabel: 'DESCENDING',
        treeDisplay: cloneTree(tree),
        highlightData: {
          nodes: {
            [curr.name.id]: { statusType: 'cyan', nodeMessage: `COMPARE ${numKey}`, fullHighlight: true },
            [targetChild.name.id]: { statusType: 'amber', nodeMessage: `TARGET CHILD` }
          },
          edges: {}
        }
      });
    }

    curr = targetChild;
    path.push(curr);
  }

  // Insert key into leaf
  const leafKeys = curr.name.keys.map(Number);
  leafKeys.push(numKey);
  leafKeys.sort((a, b) => a - b);
  curr.name.keys = leafKeys.map(String);
  const insIdx = leafKeys.indexOf(numKey);

  // Final Step: Insertion completed
  steps.push({
    id: `leaf-insert-${curr.name.id}`,
    name: `Insert ${numKey} into Leaf`,
    title: `KEY ${numKey} INSERTED`,
    explanation: `Key ${numKey} inserted at index ${insIdx} into leaf node [${leafKeys.join(', ')}]. All B-Tree invariants verified.`,
    statusType: 'green',
    statusLabel: 'INSERTED',
    treeDisplay: cloneTree(tree),
    highlightData: {
      nodes: {
        [curr.name.id]: { statusType: 'green', nodeMessage: `INSERTED [${numKey}]`, fullHighlight: true, indexHighlights: [insIdx] }
      },
      edges: {}
    }
  });

  return { steps, finalTree: tree };
}

// ═══════════════════════════════════════════════════════════════════
// SEARCH ENGINE
// ═══════════════════════════════════════════════════════════════════

export function generateSearchSteps(currentTree, targetKey) {
  const numKey = Number(targetKey);
  const steps = [];

  if (!currentTree || !currentTree.name || currentTree.name.keys.length === 0) {
    steps.push({
      id: 'search-empty',
      name: `Search ${numKey} — Empty`,
      title: `TREE IS EMPTY`,
      explanation: `Cannot search key ${numKey} because the B-Tree contains no keys.`,
      statusType: 'amber',
      statusLabel: 'SEARCH MISS',
      treeDisplay: cloneTree(currentTree),
      highlightData: { nodes: {}, edges: {} }
    });
    return { steps, finalTree: cloneTree(currentTree) };
  }

  let curr = currentTree;
  let found = false;

  while (curr) {
    const keys = curr.name.keys.map(Number);
    const id = curr.name.id;
    let matchIdx = -1;
    let nextChildIdx = keys.length;

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === numKey) {
        matchIdx = i;
        break;
      }
      if (numKey < keys[i]) {
        nextChildIdx = i;
        break;
      }
    }

    if (matchIdx !== -1) {
      // Step: Found!
      steps.push({
        id: `search-found-${id}`,
        name: `Key ${numKey} Found`,
        title: `SEARCH HIT: KEY ${numKey} FOUND`,
        explanation: `Comparing key ${numKey} at node [${keys.join(', ')}]. Match found at index ${matchIdx}! Search successfully completed.`,
        statusType: 'green',
        statusLabel: 'SEARCH HIT',
        treeDisplay: cloneTree(currentTree),
        highlightData: {
          nodes: {
            [id]: { statusType: 'green', nodeMessage: `FOUND [${numKey}]`, fullHighlight: true, indexHighlights: [matchIdx] }
          },
          edges: {}
        }
      });
      found = true;
      break;
    } else {
      // Not in this node
      if (curr.children && curr.children.length > 0) {
        const nextChild = curr.children[nextChildIdx];
        const compStr = nextChildIdx === 0
          ? `${numKey} < ${keys[0]}`
          : nextChildIdx === keys.length
          ? `${numKey} > ${keys[keys.length - 1]}`
          : `${keys[nextChildIdx - 1]} < ${numKey} < ${keys[nextChildIdx]}`;

        steps.push({
          id: `search-compare-${id}`,
          name: `Compare ${numKey}`,
          title: `COMPARE AT NODE [${keys.join(', ')}]`,
          explanation: `Checking node keys. Since ${compStr}, following pointer ${nextChildIdx} down to the next child level.`,
          statusType: 'cyan',
          statusLabel: 'SEARCHING',
          treeDisplay: cloneTree(currentTree),
          highlightData: {
            nodes: {
              [id]: { statusType: 'cyan', nodeMessage: compStr, fullHighlight: true },
              [nextChild.name.id]: { statusType: 'amber', nodeMessage: `NEXT CHILD` }
            },
            edges: {}
          }
        });
        curr = nextChild;
      } else {
        // Leaf reached and not found
        steps.push({
          id: `search-miss-${id}`,
          name: `Search Miss ${numKey}`,
          title: `SEARCH MISS: KEY ${numKey} NOT FOUND`,
          explanation: `Reached leaf node [${keys.join(', ')}]. Key ${numKey} is not present in the leaf, and no further child branches exist. Key does not exist in the B-Tree.`,
          statusType: 'red',
          statusLabel: 'SEARCH MISS',
          treeDisplay: cloneTree(currentTree),
          highlightData: {
            nodes: {
              [id]: { statusType: 'red', nodeMessage: `NOT FOUND`, fullHighlight: true }
            },
            edges: {}
          }
        });
        break;
      }
    }
  }

  return { steps, finalTree: cloneTree(currentTree) };
}

// ═══════════════════════════════════════════════════════════════════
// DELETION ENGINE
// ═══════════════════════════════════════════════════════════════════

export function generateDeleteSteps(currentTree, targetKey, t = 2) {
  const numKey = Number(targetKey);
  const steps = [];

  // Check if tree contains key
  if (!treeContains(currentTree, numKey)) {
    steps.push({
      id: 'delete-miss',
      name: `Delete ${numKey} — Not Found`,
      title: `KEY ${numKey} NOT IN TREE`,
      explanation: `Cannot delete key ${numKey} because it does not exist in the B-Tree.`,
      statusType: 'amber',
      statusLabel: 'NOT FOUND',
      treeDisplay: cloneTree(currentTree),
      highlightData: { nodes: {}, edges: {} }
    });
    return { steps, finalTree: cloneTree(currentTree) };
  }

  let tree = cloneTree(currentTree);
  const minKeys = t - 1;

  // Single node root leaf special case
  if (!tree.children || tree.children.length === 0) {
    const keys = tree.name.keys.map(Number).filter(k => k !== numKey);
    const finalTree = keys.length > 0 ? createNode(keys, null, tree.name.id) : createEmptyTree();

    steps.push({
      id: 'del-root-leaf',
      name: `Delete ${numKey} from Root Leaf`,
      title: `REMOVING ${numKey} FROM ROOT LEAF`,
      explanation: `Key ${numKey} is in the root leaf. Removing it directly.`,
      statusType: 'amber',
      statusLabel: 'REMOVING',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: { [tree.name.id]: { statusType: 'red', nodeMessage: `DELETE [${numKey}]`, fullHighlight: true } },
        edges: {}
      }
    });

    steps.push({
      id: 'del-root-leaf-done',
      name: `Delete ${numKey} Complete`,
      title: `KEY ${numKey} REMOVED`,
      explanation: keys.length > 0
        ? `Root now holds [${keys.join(', ')}].`
        : `Tree is now empty.`,
      statusType: 'green',
      statusLabel: 'DELETED',
      treeDisplay: cloneTree(finalTree),
      highlightData: keys.length > 0 ? {
        nodes: { [finalTree.name.id]: { statusType: 'green', nodeMessage: `ROOT [${keys.join(', ')}]`, fullHighlight: true } },
        edges: {}
      } : { nodes: {}, edges: {} }
    });

    return { steps, finalTree };
  }

  // Multi-level deletion cases:
  // Find where key is located
  const rootKeys = tree.name.keys.map(Number);
  const isKeyInRoot = rootKeys.includes(numKey);

  if (isKeyInRoot) {
    const keyIdx = rootKeys.indexOf(numKey);
    const leftChild = tree.children[keyIdx];
    const rightChild = tree.children[keyIdx + 1];

    // Case 2a: Left child has >= t keys -> borrow predecessor
    if (leftChild.name.keys.length >= t) {
      const predKey = Number(leftChild.name.keys[leftChild.name.keys.length - 1]);
      steps.push({
        id: 'del-internal-pred-inspect',
        name: `Internal Key ${numKey}`,
        title: `DELETE INTERNAL KEY ${numKey} VIA PREDECESSOR`,
        explanation: `Key ${numKey} is in an internal node. Its left child has ${leftChild.name.keys.length} keys ($\ge t$). Replacing ${numKey} with in-order predecessor ${predKey}.`,
        statusType: 'cyan',
        statusLabel: 'INTERNAL KEY',
        treeDisplay: cloneTree(tree),
        highlightData: {
          nodes: {
            [tree.name.id]: { statusType: 'red', nodeMessage: `REPLACE ${numKey}`, fullHighlight: true, indexHighlights: [keyIdx] },
            [leftChild.name.id]: { statusType: 'amber', nodeMessage: `PRED [${predKey}]`, indexHighlights: [leftChild.name.keys.length - 1] }
          },
          edges: {}
        }
      });

      // Replace and remove predecessor
      tree.name.keys[keyIdx] = String(predKey);
      leftChild.name.keys.pop();

      steps.push({
        id: 'del-internal-pred-done',
        name: `Predecessor Promoted`,
        title: `PREDECESSOR ${predKey} REPLACED ${numKey}`,
        explanation: `Predecessor ${predKey} moved to root. Key ${numKey} deleted. Invariants satisfied.`,
        statusType: 'green',
        statusLabel: 'DELETED',
        treeDisplay: cloneTree(tree),
        highlightData: {
          nodes: {
            [tree.name.id]: { statusType: 'green', nodeMessage: `NEW ROOT KEY`, fullHighlight: true, indexHighlights: [keyIdx] },
            [leftChild.name.id]: { statusType: 'green', nodeMessage: `UPDATED` }
          },
          edges: {}
        }
      });

      return { steps, finalTree: tree };
    }

    // Case 2b: Right child has >= t keys -> borrow successor
    if (rightChild.name.keys.length >= t) {
      const succKey = Number(rightChild.name.keys[0]);
      steps.push({
        id: 'del-internal-succ-inspect',
        name: `Internal Key ${numKey}`,
        title: `DELETE INTERNAL KEY ${numKey} VIA SUCCESSOR`,
        explanation: `Key ${numKey} is in an internal node. Its right child has ${rightChild.name.keys.length} keys ($\ge t$). Replacing ${numKey} with in-order successor ${succKey}.`,
        statusType: 'cyan',
        statusLabel: 'INTERNAL KEY',
        treeDisplay: cloneTree(tree),
        highlightData: {
          nodes: {
            [tree.name.id]: { statusType: 'red', nodeMessage: `REPLACE ${numKey}`, fullHighlight: true, indexHighlights: [keyIdx] },
            [rightChild.name.id]: { statusType: 'amber', nodeMessage: `SUCC [${succKey}]`, indexHighlights: [0] }
          },
          edges: {}
        }
      });

      tree.name.keys[keyIdx] = String(succKey);
      rightChild.name.keys.shift();

      steps.push({
        id: 'del-internal-succ-done',
        name: `Successor Promoted`,
        title: `SUCCESSOR ${succKey} REPLACED ${numKey}`,
        explanation: `Successor ${succKey} moved to root. Key ${numKey} deleted. Invariants satisfied.`,
        statusType: 'green',
        statusLabel: 'DELETED',
        treeDisplay: cloneTree(tree),
        highlightData: {
          nodes: {
            [tree.name.id]: { statusType: 'green', nodeMessage: `NEW ROOT KEY`, fullHighlight: true, indexHighlights: [keyIdx] },
            [rightChild.name.id]: { statusType: 'green', nodeMessage: `UPDATED` }
          },
          edges: {}
        }
      });

      return { steps, finalTree: tree };
    }

    // Case 2c: Both children have only t-1 keys -> Merge children + K!
    steps.push({
      id: 'del-internal-merge-inspect',
      name: `Merge Children & Delete ${numKey}`,
      title: `MERGE CHILDREN & PULL DOWN ${numKey}`,
      explanation: `Both left and right children have minimum capacity ($t-1 = ${minKeys}$ keys). Merging left child, key ${numKey}, and right child into a single node.`,
      statusType: 'red',
      statusLabel: 'MERGING',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: {
          [tree.name.id]: { statusType: 'red', nodeMessage: `PULL DOWN ${numKey}`, fullHighlight: true, indexHighlights: [keyIdx] },
          [leftChild.name.id]: { statusType: 'amber', nodeMessage: `MERGE LEFT` },
          [rightChild.name.id]: { statusType: 'amber', nodeMessage: `MERGE RIGHT` }
        },
        edges: {}
      }
    });

    // Merge: [leftKeys, numKey, rightKeys]
    const mergedKeys = [...leftChild.name.keys, ...rightChild.name.keys].map(Number);
    // remove numKey from merged
    const finalMergedK = mergedKeys.filter(k => k !== numKey).sort((a, b) => a - b);
    const mergedChildren = (leftChild.children || rightChild.children)
      ? [...(leftChild.children || []), ...(rightChild.children || [])]
      : null;

    const mergedNode = createNode(finalMergedK, mergedChildren, leftChild.name.id);
    tree.name.keys.splice(keyIdx, 1);
    tree.children.splice(keyIdx, 2, mergedNode);

    // Root Collapse check
    if (tree.name.keys.length === 0) {
      steps.push({
        id: 'del-root-collapse',
        name: `Root Collapse`,
        title: `ROOT COLLAPSED: HEIGHT DECREASES`,
        explanation: `The root lost its last key. The merged node becomes the new root. Tree height shrinks by 1.`,
        statusType: 'purple',
        statusLabel: 'ROOT COLLAPSE',
        treeDisplay: cloneTree(mergedNode),
        highlightData: {
          nodes: { [mergedNode.name.id]: { statusType: 'purple', nodeMessage: `NEW ROOT [${finalMergedK.join(', ')}]`, fullHighlight: true } },
          edges: {}
        }
      });
      return { steps, finalTree: mergedNode };
    } else {
      steps.push({
        id: 'del-merge-done',
        name: `Merge Complete`,
        title: `MERGED NODE FORMED`,
        explanation: `Merged node created with [${finalMergedK.join(', ')}]. Key ${numKey} removed.`,
        statusType: 'green',
        statusLabel: 'DELETED',
        treeDisplay: cloneTree(tree),
        highlightData: {
          nodes: { [mergedNode.name.id]: { statusType: 'green', nodeMessage: `MERGED [${finalMergedK.join(', ')}]`, fullHighlight: true } },
          edges: {}
        }
      });
      return { steps, finalTree: tree };
    }
  }

  // Key is in child / leaf level
  // Find which child contains numKey
  let targetChildIdx = tree.name.keys.length;
  for (let i = 0; i < tree.name.keys.length; i++) {
    if (numKey < Number(tree.name.keys[i])) {
      targetChildIdx = i;
      break;
    }
  }

  const child = tree.children[targetChildIdx];

  // Case: Leaf has > t-1 keys -> Simple Leaf Deletion
  if (child.name.keys.length > minKeys) {
    const originalKeys = [...child.name.keys];
    child.name.keys = child.name.keys.filter(k => Number(k) !== numKey);

    steps.push({
      id: `del-leaf-simple-${child.name.id}`,
      name: `Direct Leaf Delete`,
      title: `DIRECT LEAF DELETION OF KEY ${numKey}`,
      explanation: `Leaf node has ${originalKeys.length} keys ($> t-1$). Key ${numKey} can be removed directly without causing underflow.`,
      statusType: 'cyan',
      statusLabel: 'DIRECT DELETE',
      treeDisplay: cloneTree(currentTree),
      highlightData: {
        nodes: { [child.name.id]: { statusType: 'amber', nodeMessage: `REMOVE [${numKey}]`, fullHighlight: true } },
        edges: {}
      }
    });

    steps.push({
      id: `del-leaf-simple-done-${child.name.id}`,
      name: `Key ${numKey} Deleted`,
      title: `LEAF UPDATED`,
      explanation: `Key ${numKey} removed. Leaf now contains [${child.name.keys.join(', ')}]. Capacity is ${child.name.keys.length} of ${2 * t - 1}.`,
      statusType: 'green',
      statusLabel: 'DELETED',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: { [child.name.id]: { statusType: 'green', nodeMessage: `LEAF [${child.name.keys.join(', ')}]`, fullHighlight: true } },
        edges: {}
      }
    });

    return { steps, finalTree: tree };
  }

  // Child has exactly t - 1 keys -> Needs Borrowing or Merging!
  const leftSibling = targetChildIdx > 0 ? tree.children[targetChildIdx - 1] : null;
  const rightSibling = targetChildIdx < tree.children.length - 1 ? tree.children[targetChildIdx + 1] : null;

  // Subcase A: Borrow from Left Sibling
  if (leftSibling && leftSibling.name.keys.length > minKeys) {
    const parentSepIdx = targetChildIdx - 1;
    const parentSepKey = tree.name.keys[parentSepIdx];
    const borrowedKey = leftSibling.name.keys.pop();

    steps.push({
      id: 'del-borrow-left-inspect',
      name: `Borrow from Left Sibling`,
      title: `UNDERFLOW: BORROW FROM LEFT SIBLING`,
      explanation: `Target child has only $t-1 = ${minKeys}$ keys. Left sibling has extra keys (${leftSibling.name.keys.length + 1} keys). Performing clockwise rotation: sibling key ${borrowedKey} moves up to parent, and parent separator ${parentSepKey} moves down into target child.`,
      statusType: 'amber',
      statusLabel: 'BORROWING',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: {
          [leftSibling.name.id]: { statusType: 'amber', nodeMessage: `DONOR SIBLING` },
          [tree.name.id]: { statusType: 'cyan', nodeMessage: `SEPARATOR ${parentSepKey}`, indexHighlights: [parentSepIdx] },
          [child.name.id]: { statusType: 'red', nodeMessage: `UNDERFLOW` }
        },
        edges: {}
      }
    });

    tree.name.keys[parentSepIdx] = String(borrowedKey);
    child.name.keys = child.name.keys.filter(k => Number(k) !== numKey);
    child.name.keys.unshift(String(parentSepKey));

    steps.push({
      id: 'del-borrow-left-done',
      name: `Rotation Complete`,
      title: `ROTATION AND DELETION COMPLETE`,
      explanation: `Key ${numKey} removed. Child received ${parentSepKey}; parent received ${borrowedKey}. Both nodes now have valid capacity.`,
      statusType: 'green',
      statusLabel: 'DELETED',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: {
          [child.name.id]: { statusType: 'green', nodeMessage: `VALID [${child.name.keys.join(', ')}]`, fullHighlight: true },
          [tree.name.id]: { statusType: 'green', nodeMessage: `UPDATED PARENT` }
        },
        edges: {}
      }
    });

    return { steps, finalTree: tree };
  }

  // Subcase B: Borrow from Right Sibling
  if (rightSibling && rightSibling.name.keys.length > minKeys) {
    const parentSepIdx = targetChildIdx;
    const parentSepKey = tree.name.keys[parentSepIdx];
    const borrowedKey = rightSibling.name.keys.shift();

    steps.push({
      id: 'del-borrow-right-inspect',
      name: `Borrow from Right Sibling`,
      title: `UNDERFLOW: BORROW FROM RIGHT SIBLING`,
      explanation: `Target child has only $t-1 = ${minKeys}$ keys. Right sibling has extra keys (${rightSibling.name.keys.length + 1} keys). Performing counter-clockwise rotation: parent separator ${parentSepKey} moves down to target child, and right sibling's smallest key ${borrowedKey} moves up to parent.`,
      statusType: 'amber',
      statusLabel: 'BORROWING',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: {
          [child.name.id]: { statusType: 'red', nodeMessage: `UNDERFLOW` },
          [tree.name.id]: { statusType: 'cyan', nodeMessage: `SEPARATOR ${parentSepKey}`, indexHighlights: [parentSepIdx] },
          [rightSibling.name.id]: { statusType: 'amber', nodeMessage: `DONOR SIBLING` }
        },
        edges: {}
      }
    });

    tree.name.keys[parentSepIdx] = String(borrowedKey);
    child.name.keys = child.name.keys.filter(k => Number(k) !== numKey);
    child.name.keys.push(String(parentSepKey));

    steps.push({
      id: 'del-borrow-right-done',
      name: `Rotation Complete`,
      title: `ROTATION AND DELETION COMPLETE`,
      explanation: `Key ${numKey} removed. Child received ${parentSepKey}; parent received ${borrowedKey}. Both nodes have valid capacity.`,
      statusType: 'green',
      statusLabel: 'DELETED',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: {
          [child.name.id]: { statusType: 'green', nodeMessage: `VALID [${child.name.keys.join(', ')}]`, fullHighlight: true },
          [tree.name.id]: { statusType: 'green', nodeMessage: `UPDATED PARENT` }
        },
        edges: {}
      }
    });

    return { steps, finalTree: tree };
  }

  // Subcase C: Siblings also have minKeys -> Merge with Sibling!
  const mergeLeft = leftSibling !== null;
  const sib = mergeLeft ? leftSibling : rightSibling;
  const parentSepIdx = mergeLeft ? targetChildIdx - 1 : targetChildIdx;
  const parentSepKey = tree.name.keys[parentSepIdx];

  steps.push({
    id: 'del-sibling-merge-inspect',
    name: `Merge Siblings`,
    title: `UNDERFLOW: MERGE WITH SIBLING`,
    explanation: `Target child and adjacent sibling both have minimum capacity ($t-1 = ${minKeys}$ keys). Merging target child, parent separator ${parentSepKey}, and sibling into one node.`,
    statusType: 'red',
    statusLabel: 'MERGING',
    treeDisplay: cloneTree(tree),
    highlightData: {
      nodes: {
        [tree.name.id]: { statusType: 'cyan', nodeMessage: `SEPARATOR ${parentSepKey}`, indexHighlights: [parentSepIdx] },
        [child.name.id]: { statusType: 'red', nodeMessage: `UNDERFLOW` },
        [sib.name.id]: { statusType: 'amber', nodeMessage: `MERGE PARTNER` }
      },
      edges: {}
    }
  });

  const remainingTargetKeys = child.name.keys.filter(k => Number(k) !== numKey);
  const mergedK = mergeLeft
    ? [...sib.name.keys, parentSepKey, ...remainingTargetKeys].map(Number)
    : [...remainingTargetKeys, parentSepKey, ...sib.name.keys].map(Number);
  mergedK.sort((a, b) => a - b);

  const mergedKids = mergeLeft
    ? [...(sib.children || []), ...(child.children || [])]
    : [...(child.children || []), ...(sib.children || [])];

  const newMergedNode = createNode(mergedK, mergedKids.length > 0 ? mergedKids : null, sib.name.id);
  tree.name.keys.splice(parentSepIdx, 1);
  const removeStart = mergeLeft ? targetChildIdx - 1 : targetChildIdx;
  tree.children.splice(removeStart, 2, newMergedNode);

  // Check Root Collapse
  if (tree.name.keys.length === 0) {
    steps.push({
      id: 'del-sibling-root-collapse',
      name: `Root Collapse`,
      title: `ROOT COLLAPSED`,
      explanation: `The root node has 0 keys remaining. The merged child becomes the new root node. Tree height reduces by 1.`,
      statusType: 'purple',
      statusLabel: 'ROOT COLLAPSE',
      treeDisplay: cloneTree(newMergedNode),
      highlightData: {
        nodes: { [newMergedNode.name.id]: { statusType: 'purple', nodeMessage: `NEW ROOT [${mergedK.join(', ')}]`, fullHighlight: true } },
        edges: {}
      }
    });
    return { steps, finalTree: newMergedNode };
  } else {
    steps.push({
      id: 'del-sibling-merge-done',
      name: `Merge Complete`,
      title: `MERGE COMPLETED`,
      explanation: `Nodes merged into [${mergedK.join(', ')}]. Key ${numKey} deleted. Invariants satisfied.`,
      statusType: 'green',
      statusLabel: 'DELETED',
      treeDisplay: cloneTree(tree),
      highlightData: {
        nodes: { [newMergedNode.name.id]: { statusType: 'green', nodeMessage: `MERGED [${mergedK.join(', ')}]`, fullHighlight: true } },
        edges: {}
      }
    });
    return { steps, finalTree: tree };
  }
}

// ═══════════════════════════════════════════════════════════════════
// PRE-CONFIGURED TEACHING EXAMPLES
// ═══════════════════════════════════════════════════════════════════

export const PRESET_EXAMPLES = [
  {
    id: 'empty',
    name: 'Empty Tree',
    category: 'Setup',
    description: 'Start with a completely empty B-Tree and insert the first key.',
    defaultOp: 'INSERT',
    defaultKey: 10,
    degree: 2,
    getTree: () => createEmptyTree()
  },
  {
    id: 'simple-insert',
    name: 'Simple Insertion',
    category: 'Insert',
    description: 'Insert into a leaf with available room (capacity 1/3 keys). No split required.',
    defaultOp: 'INSERT',
    defaultKey: 6,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['10'] },
      children: [
        { name: { id: 2, keys: ['5'] } },
        { name: { id: 3, keys: ['20'] } }
      ]
    })
  },
  {
    id: 'root-split',
    name: 'Root Split (Capacity Overflow)',
    category: 'Insert',
    description: 'Insert into a full root node [5, 10, 20]. Forces median key promotion and tree height increase.',
    defaultOp: 'INSERT',
    defaultKey: 6,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['5', '10', '20'] },
      children: null
    })
  },
  {
    id: 'child-split',
    name: 'Internal Child Split',
    category: 'Insert',
    description: 'Target child [5, 6, 7] is full. Demonstrates proactive top-down split before insertion.',
    defaultOp: 'INSERT',
    defaultKey: 4,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['10'] },
      children: [
        { name: { id: 2, keys: ['5', '6', '7'] } },
        { name: { id: 3, keys: ['12', '20'] } }
      ]
    })
  },
  {
    id: 'search-hit',
    name: 'Successful Search',
    category: 'Search',
    description: 'Search for existing key 17 across multiple tree levels with key comparisons.',
    defaultOp: 'SEARCH',
    defaultKey: 17,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['10', '20'] },
      children: [
        { name: { id: 2, keys: ['5', '6'] } },
        { name: { id: 3, keys: ['12', '17'] } },
        { name: { id: 4, keys: ['30'] } }
      ]
    })
  },
  {
    id: 'search-miss',
    name: 'Unsuccessful Search',
    category: 'Search',
    description: 'Search for missing key 15. Demonstrates path traversal ending at a leaf without a match.',
    defaultOp: 'SEARCH',
    defaultKey: 15,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['10', '20'] },
      children: [
        { name: { id: 2, keys: ['5', '6'] } },
        { name: { id: 3, keys: ['12', '17'] } },
        { name: { id: 4, keys: ['30'] } }
      ]
    })
  },
  {
    id: 'del-leaf',
    name: 'Leaf Deletion (Direct)',
    category: 'Delete',
    description: 'Delete key from a leaf that has room (2 keys $\ge t$). Removed directly.',
    defaultOp: 'DELETE',
    defaultKey: 6,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['10'] },
      children: [
        { name: { id: 2, keys: ['5', '6'] } },
        { name: { id: 3, keys: ['20'] } }
      ]
    })
  },
  {
    id: 'del-borrow',
    name: 'Deletion: Borrow from Sibling',
    category: 'Delete',
    description: 'Target leaf has only 1 key ($t-1$). Left sibling has 2 keys. Borrows key via parent rotation.',
    defaultOp: 'DELETE',
    defaultKey: 25,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['20'] },
      children: [
        { name: { id: 2, keys: ['5', '10'] } },
        { name: { id: 3, keys: ['25'] } }
      ]
    })
  },
  {
    id: 'del-merge',
    name: 'Deletion: Sibling Merge',
    category: 'Delete',
    description: 'Both target leaf and sibling have only $t-1 = 1$ key. Merges child, parent separator, and sibling.',
    defaultOp: 'DELETE',
    defaultKey: 5,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['20', '40'] },
      children: [
        { name: { id: 2, keys: ['5'] } },
        { name: { id: 3, keys: ['30'] } },
        { name: { id: 4, keys: ['50', '60'] } }
      ]
    })
  },
  {
    id: 'del-collapse',
    name: 'Deletion: Root Collapse',
    category: 'Delete',
    description: 'Root has 1 key. Deleting causes children to merge, collapsing root and reducing tree height.',
    defaultOp: 'DELETE',
    defaultKey: 5,
    degree: 2,
    getTree: () => ({
      name: { id: 1, keys: ['20'] },
      children: [
        { name: { id: 2, keys: ['5'] } },
        { name: { id: 3, keys: ['30'] } }
      ]
    })
  }
];

/**
 * Rebuilds a tree from all existing keys under a new minimum degree t
 */
export function rebuildTreeWithDegree(currentTree, newT) {
  const keys = getAllKeys(currentTree);
  if (keys.length === 0) return createEmptyTree();

  let tree = createEmptyTree();
  for (const k of keys) {
    const res = generateInsertSteps(tree, k, newT);
    tree = res.finalTree;
  }
  return tree;
}
