'use client';

import { z } from 'zod';
import PathPlanningForm, {
  pathPlanningFormSchema,
} from '@/components/path-planning-form';
import PathPlanningGrid from '@/components/path-planning-grid';
import { useState } from 'react';
import { TreeEdge, TreeNode } from '@/lib/tree';
import RRTPlanner from '@/planners/rrt';
import RRTStarPlanner from '@/planners/rrtStar';

const planners = {
  RRT: new RRTPlanner(),
  'RRT*': new RRTStarPlanner(),
};

export default function PathPlanningPage() {
  const [startNode, setStartNode] = useState(new TreeNode(24, 24));
  const [goalNode, setGoalNode] = useState(new TreeNode(232, 232));
  const [obstacles, setObstacles] = useState<TreeNode[]>([]);
  const [renderedEdges, setRenderedEdges] = useState<TreeEdge[]>([]);
  const [renderedPath, setRenderedPath] = useState<TreeEdge[]>([]);
  const [stepSize, setStepSize] = useState(16);

  function onSubmit(values: z.infer<typeof pathPlanningFormSchema>) {
    setRenderedEdges([]);
    const currentPlanner = planners[values.algorithm];
    const success = currentPlanner.plan(
      startNode,
      goalNode,
      obstacles,
      values.stepSize,
      values.timeoutMS,
      values.goalBiasEnabled,
      values.goalBias
    );

    setRenderedEdges(currentPlanner.getAllEdges());

    if (success) {
      setRenderedPath(currentPlanner.getShortestPathEdges());
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 w-full max-w-4xl mx-auto">
        <div className="border rounded-lg aspect-square overflow-clip">
          <PathPlanningGrid>
            {renderedEdges.map((edge, index) => (
              <path
                key={index}
                d={`M${edge.from.x} ${edge.from.y} L${edge.to.x} ${edge.to.y}`}
                stroke="currentColor"
                strokeWidth={0.5}
              />
            ))}

            {renderedPath.map((edge, index) => (
              <path
                key={index}
                d={`M${edge.from.x} ${edge.from.y} L${edge.to.x} ${edge.to.y}`}
                stroke="green"
                strokeWidth={2}
              />
            ))}

            <circle cx={startNode.x} cy={startNode.y} r={4} fill="green" />
            <circle cx={goalNode.x} cy={goalNode.y} r={4} fill="red" />
          </PathPlanningGrid>
        </div>
        <div>
          <PathPlanningForm
            planners={Object.keys(planners)}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
