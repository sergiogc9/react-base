import { TreeUtils, TreeNode } from '@src/class/Tree';

type FakeType = { id: string };

const nodeAA: TreeNode<FakeType> = { data: { id: "AA" } };
const nodeAB: TreeNode<FakeType> = { data: { id: "AB" } };
const nodeA: TreeNode<FakeType> = { data: { id: "A" }, children: [nodeAA, nodeAB] };
nodeAA.parent = nodeA;
nodeAB.parent = nodeA;

const nodeBBA: TreeNode<FakeType> = { data: { id: "BBA" } };
const nodeBA: TreeNode<FakeType> = { data: { id: "BA" } };
const nodeBB: TreeNode<FakeType> = { data: { id: "BB" }, children: [nodeBBA] };
const nodeB: TreeNode<FakeType> = { data: { id: "B" }, children: [nodeBA, nodeBB] };
nodeBBA.parent = nodeBB;
nodeBA.parent = nodeB;
nodeBB.parent = nodeB;

const rootNodes = [nodeA, nodeB];
const tree = { rootNodes };

describe('Tree class', () => {

	it('should create an empty tree', () => {
		const t = TreeUtils.createTree([]);
		expect(t.rootNodes).toEqual([]);
	});

	it('should create a tree', () => {
		const t = TreeUtils.createTree(rootNodes);
		expect(t.rootNodes).toEqual(rootNodes);
	});

	it('should get root nodes attributes values', () => {
		const values = TreeUtils.getRootNodesAttributeValues(tree, 'id');
		expect(values).toEqual(["A", "B"]);
	});

	it('should get node children values', () => {
		let values = TreeUtils.getNodeChildrenAttributeValues(nodeB, 'id');
		expect(values).toEqual(["BA", "BB"]);
		values = TreeUtils.getNodeChildrenAttributeValues(nodeBBA, 'id');
		expect(values).toEqual([]);
	});

	it('should get node parents values', () => {
		let values = TreeUtils.getNodeParentsAttributeValues(nodeBBA, 'id');
		expect(values).toEqual(["BB", "B"]);
		values = TreeUtils.getNodeParentsAttributeValues(nodeA, 'id');
		expect(values).toEqual([]);
	});

	it('should get node parents values', () => {
		let values = TreeUtils.getNodeDescendentsAttributeValues(nodeA, 'id', false);
		expect(values).toEqual(["AA", "AB"]);
		values = TreeUtils.getNodeDescendentsAttributeValues(nodeB, 'id', false);
		expect(values).toEqual(["BA", "BB", "BBA"]);
		values = TreeUtils.getNodeDescendentsAttributeValues(nodeAA, 'id', false);
		expect(values).toEqual([]);
	});

});
