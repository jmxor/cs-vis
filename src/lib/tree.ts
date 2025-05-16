export class TreeNode {
  x: number;
  y: number;
  cost: number;

  constructor(x: number, y: number, cost?: number) {
    this.x = x;
    this.y = y;
    this.cost = cost || 0;
  }

  areCoordinatesEqual(node: TreeNode): boolean {
    return this.x === node.x && this.y === node.y;
  }
}

export class TreeEdge {
  from: TreeNode;
  to: TreeNode;

  constructor(from: TreeNode, to: TreeNode) {
    this.from = from;
    this.to = to;
  }
  equals(edge: TreeEdge): boolean {
    return (
      this.from.areCoordinatesEqual(edge.from) &&
      this.to.areCoordinatesEqual(edge.to)
    );
  }
}

export class Tree {
  nodes: Array<TreeNode> = [];
  edges: Array<TreeEdge> = [];

  addNode(node: TreeNode) {
    this.nodes.push(node);
  }

  addEdge(from: TreeNode, to: TreeNode) {
    this.edges.push(new TreeEdge(from, to));
  }

  step(from: TreeNode, to: TreeNode, stepSize: number): TreeNode {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < stepSize) {
      return to;
    }
    const ratio = stepSize / distance;
    return new TreeNode(from.x + dx * ratio, from.y + dy * ratio);
  }

  clear() {
    this.nodes = [];
    this.edges = [];
  }

  getNearestNode(node: TreeNode): TreeNode | null {
    let nearestNode: TreeNode | null = null;
    let minDistance = Infinity;
    for (const n of this.nodes) {
      if (!n.areCoordinatesEqual(node)) {
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

  checkAndReconnect(node: TreeNode, stepSize: number) {
    // function to examine all nodes within stepSize of the new node and connect to the lowest cost node if not already connected
    const nearbyNodes = this.nodes.filter(
      n => this.getDistance(node, n) < stepSize
    );
    if (nearbyNodes.length > 1) {
      const lowestCostNode = nearbyNodes.reduce((prev, curr) =>
        prev.cost < curr.cost ? prev : curr
      );
      this.edges = this.edges.filter(
        edge => !edge.from.areCoordinatesEqual(node)
      );
      this.addEdge(node, lowestCostNode);
    }
  }
}
