import { Tree, TreeNode } from '@/lib/tree';

export default class RRTPlanner {
  tree: Tree;

  constructor() {
    this.tree = new Tree();
  }

  plan(
    start: TreeNode,
    goal: TreeNode,
    obstacles: TreeNode[],
    stepSize: number
  ) {
    const startMS = performance.now();
    this.tree.clear();
    this.tree.addNode(start);

    while (performance.now() - startMS < 5000) {
      // TODO add goal bias
      const qRand = { x: Math.random() * 256, y: Math.random() * 256 };
      const qNearest = this.tree.getNearestNode(qRand);
      if (!qNearest) return false;

      const qNew = this.tree.step(qNearest, qRand, stepSize);

      try {
        this.tree.addEdge(qNew, qNearest);
        this.tree.addNode(qNew);
      } catch (e) {
        continue;
      }

      if (this.tree.getDistance(qNew, goal) < stepSize) {
        this.tree.addEdge(qNew, goal);
        this.tree.addNode(goal);
        return true;
      }
    }

    return false;
  }

  getAllEdges() {
    return this.tree.edges;
  }

  getPathEdges() {
    // TODO: Implement this method to return the path edges
  }
}
