import { test } from 'node:test';
import assert from 'node:assert';
import {
  createEmptyTree,
  generateInsertSteps,
  generateDeleteSteps,
  generateSearchSteps,
  rebuildTreeWithDegree,
  validateTree,
  PRESET_EXAMPLES,
  getAllKeys
} from '../src/btree-engine/bTreePlaygroundEngine.js';

test('Empty tree creation and validation', () => {
  const tree = createEmptyTree();
  assert.strictEqual(tree.name.keys.length, 0);
  assert.strictEqual(validateTree(tree, 2).valid, true);
});

test('Sequential insertions t=2 split root and internal nodes', () => {
  let tree = createEmptyTree();
  const keysToInsert = [10, 20, 30, 40, 50, 25, 60, 70, 80];

  for (const k of keysToInsert) {
    const res = generateInsertSteps(tree, k, 2);
    assert.ok(res.steps.length > 0, `Steps generated for key ${k}`);
    tree = res.finalTree;
    const val = validateTree(tree, 2);
    assert.strictEqual(val.valid, true, `Tree valid after inserting ${k}: ${val.reason}`);
  }

  const allKeys = getAllKeys(tree);
  assert.deepStrictEqual(allKeys, [10, 20, 25, 30, 40, 50, 60, 70, 80]);
});

test('Search steps for existing and non-existing keys', () => {
  let tree = createEmptyTree();
  [10, 20, 30, 40].forEach(k => {
    const res = generateInsertSteps(tree, k, 2);
    tree = res.finalTree;
  });

  const hitRes = generateSearchSteps(tree, 30, 2);
  assert.ok(hitRes.steps.length > 0);
  assert.strictEqual(hitRes.steps[hitRes.steps.length - 1].statusLabel, 'SEARCH HIT');

  const missRes = generateSearchSteps(tree, 99, 2);
  assert.ok(missRes.steps.length > 0);
  assert.strictEqual(missRes.steps[missRes.steps.length - 1].statusLabel, 'SEARCH MISS');
});

test('Preset examples validate correctly', () => {
  for (const preset of PRESET_EXAMPLES) {
    const tree = preset.getTree();
    const val = validateTree(tree, preset.degree);
    assert.strictEqual(val.valid, true, `Preset ${preset.id} should be valid under t=${preset.degree}: ${val.reason}`);
  }
});

test('Deletion cases: leaf, borrow, merge, and root collapse', () => {
  // Test Borrowing preset deletion
  const borrowPreset = PRESET_EXAMPLES.find(p => p.id === 'del-borrow');
  const borrowTree = borrowPreset.getTree();
  const borrowRes = generateDeleteSteps(borrowTree, borrowPreset.defaultKey, borrowPreset.degree);
  assert.ok(borrowRes.steps.length > 0);
  assert.strictEqual(validateTree(borrowRes.finalTree, borrowPreset.degree).valid, true);

  // Test Merging preset deletion
  const mergePreset = PRESET_EXAMPLES.find(p => p.id === 'del-merge');
  const mergeTree = mergePreset.getTree();
  const mergeRes = generateDeleteSteps(mergeTree, mergePreset.defaultKey, mergePreset.degree);
  assert.ok(mergeRes.steps.length > 0);
  assert.strictEqual(validateTree(mergeRes.finalTree, mergePreset.degree).valid, true);

  // Test Root collapse preset deletion
  const collapsePreset = PRESET_EXAMPLES.find(p => p.id === 'del-collapse');
  const collapseTree = collapsePreset.getTree();
  const collapseRes = generateDeleteSteps(collapseTree, collapsePreset.defaultKey, collapsePreset.degree);
  assert.ok(collapseRes.steps.length > 0);
  assert.strictEqual(validateTree(collapseRes.finalTree, collapsePreset.degree).valid, true);
});

test('Rebuilding tree with new degree t', () => {
  let tree = createEmptyTree();
  [10, 20, 30, 40, 50, 60, 70, 80].forEach(k => {
    const res = generateInsertSteps(tree, k, 2);
    tree = res.finalTree;
  });

  const t3Tree = rebuildTreeWithDegree(tree, 3);
  assert.strictEqual(validateTree(t3Tree, 3).valid, true);
  assert.deepStrictEqual(getAllKeys(t3Tree), [10, 20, 30, 40, 50, 60, 70, 80]);

  const t4Tree = rebuildTreeWithDegree(tree, 4);
  assert.strictEqual(validateTree(t4Tree, 4).valid, true);
  assert.deepStrictEqual(getAllKeys(t4Tree), [10, 20, 30, 40, 50, 60, 70, 80]);
});
