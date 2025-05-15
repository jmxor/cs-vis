export type TreeNode = {
  x: number;
  y: number;
};

export type TreeEdge = {
  from: TreeNode;
  to: TreeNode;
};

export class Tree {
  nodes: Array<TreeNode> = [];
  edges: Array<TreeEdge> = [];

  addNode(node: TreeNode) {
    this.nodes.push(node);
  }

  addEdge(from: TreeNode, to: TreeNode) {
    this.edges.push({ from, to });
  }

  step(from: TreeNode, to: TreeNode, stepSize: number): TreeNode {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < stepSize) {
      return to;
    }
    const ratio = stepSize / distance;
    return {
      x: from.x + dx * ratio,
      y: from.y + dy * ratio,
    };
  }

  clear() {
    this.nodes = [];
    this.edges = [];
  }

  getNearestNode(node: TreeNode): TreeNode | null {
    let nearestNode: TreeNode | null = null;
    let minDistance = Infinity;
    for (const n of this.nodes) {
      if (n !== node) {
        const distance = this.getDistance(node, n);
        if (distance < minDistance) {
          minDistance = distance;
          nearestNode = n;
        }
      }
    }
    return nearestNode;
  }

  getDistance(nodeA: TreeNode, nodeB: TreeNode): number {
    return Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
  }
}
