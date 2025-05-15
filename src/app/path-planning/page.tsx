'use client';

import { z } from 'zod';
import PathPlanningForm, {
  pathPlanningFormSchema,
} from '@/components/ui/path-planning-form';
import PathPlanningGrid from '@/components/path-planning-grid';
import { useState } from 'react';
import { Tree, TreeEdge, TreeNode } from '@/lib/tree';
import RRTPlanner from '@/planners/rrt';

const planners = {
  RRT: new RRTPlanner(),
  'RRT*': new RRTPlanner(),
};

export default function PathPlanningPage() {
  const [startNode, setStartNode] = useState<TreeNode>({ x: 24, y: 24 });
  const [goalNode, setGoalNode] = useState<TreeNode>({ x: 232, y: 232 });
  const [obstacles, setObstacles] = useState<{ x: number; y: number }[]>([]);
  const [renderedEdges, setRenderedEdges] = useState<TreeEdge[]>([]);
  const [stepSize, setStepSize] = useState(16);

  function onSubmit(values: z.infer<typeof pathPlanningFormSchema>) {
    const currentPlanner = planners[values.algorithm];
    const success = currentPlanner.plan(
      startNode,
      goalNode,
      obstacles,
      stepSize
    );
    setRenderedEdges(currentPlanner.getAllEdges());

    // if (success) {
    //   display shortest path
    // }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 p-4 w-full max-w-4xl mx-auto">
        <div
          className="border rounded-lg aspect-square overflow-clip cursor-pointer"
          // onClick={e => handleGridClick(e)}
        >
          <PathPlanningGrid grid>
            {renderedEdges.map((edge, index) => (
              <path
                key={index}
                d={`M${edge.from.x} ${edge.from.y} L${edge.to.x} ${edge.to.y}`}
                stroke="black"
                strokeWidth={1}
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
