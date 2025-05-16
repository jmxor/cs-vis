import { Tree, TreeEdge, TreeNode } from '@/lib/tree';
import { Dispatch, SetStateAction } from 'react';

export default class RRTStarPlanner {
  tree: Tree;
  start: TreeNode | null = null;
  goal: TreeNode | null = null;

  constructor() {
    this.tree = new Tree();
  }

  plan(
    start: TreeNode,
    goal: TreeNode,
    obstacles: TreeNode[],
    stepSize: number,
    timeoutMS: number,
    goalBiasEnabled: boolean,
    goalBias: number
  ) {
    start.cost = 0;
    this.start = start;
    this.goal = goal;
    this.tree.clear();
    this.tree.addNode(start);

    let goalFound = false;
    const startMS = performance.now();
    let qRand: TreeNode;
    while (performance.now() - startMS < timeoutMS) {
      if (goalBiasEnabled && Math.random() < goalBias) {
        qRand = goal;
      } else {
        qRand = new TreeNode(Math.random() * 256, Math.random() * 256);
      }
      const qNearest = this.tree.getNearestNode(qRand);
      if (!qNearest) return goalFound;

      const qNew = this.tree.step(qNearest, qRand, stepSize);
      qNew.cost = qNearest.cost + this.tree.getDistance(qNearest, qNew);

      try {
        this.tree.addEdge(qNew, qNearest);
        this.tree.addNode(qNew);
      } catch (e) {
        continue;
      }

      this.tree.checkAndReconnect(qNew, stepSize);

      if (!goalFound && this.tree.getDistance(qNew, goal) < stepSize) {
        this.tree.addEdge(goal, qNew);
        this.tree.addNode(goal);
        goalFound = true;
      }
    }

    return goalFound;
  }

  getAllEdges() {
    return this.tree.edges;
  }

  getShortestPathEdges() {
    const pathEdges: TreeEdge[] = [];
    let currentEdge = this.tree.edges.find(edge =>
      edge.from.areCoordinatesEqual(this.goal!)
    );
    while (currentEdge?.to !== this.start) {
      pathEdges.push(currentEdge!);
      currentEdge = this.tree.edges.find(edge =>
        edge.from.areCoordinatesEqual(currentEdge!.to)
      );
    }
    pathEdges.push(currentEdge!);
    return pathEdges;
  }
}
