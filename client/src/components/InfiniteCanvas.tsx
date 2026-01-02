/**
 * Infinite Canvas Component
 * Manages draggable nodes for multi-model API responses
 * Design: Cyberpunk Minimalism - Luxury Terminal Aesthetic
 */

import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Trash2, Plus, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponseNode } from './ResponseNode';

interface CanvasResponse {
  id: string;
  provider: string;
  prompt: string;
  response: string;
  timestamp: number;
  status: 'loading' | 'success' | 'error';
}

const nodeTypes = {
  response: ResponseNode,
};

export function InfiniteCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [responses, setResponses] = useState<CanvasResponse[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const addResponseNode = useCallback((response: CanvasResponse) => {
    setResponses((prev) => [...prev, response]);

    const newNode: Node = {
      id: response.id,
      data: {
        provider: response.provider,
        prompt: response.prompt,
        response: response.response,
        status: response.status,
        onDelete: () => deleteNode(response.id),
      },
      position: {
        x: Math.random() * 500 - 250,
        y: Math.random() * 500 - 250,
      },
      type: 'response',
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setResponses((prev) => prev.filter((r) => r.id !== nodeId));
  }, [setNodes, setEdges]);

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setResponses([]);
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Canvas Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-neon-cyan/10 bg-card/50 backdrop-blur-sm"
      >
        <div>
          <h2 className="text-sm font-mono text-neon-cyan uppercase tracking-wider">
            INFINITE CANVAS
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {responses.length} response{responses.length !== 1 ? 's' : ''} • {edges.length} connection{edges.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 font-mono text-xs"
            onClick={clearCanvas}
            disabled={nodes.length === 0}
          >
            <Trash2 size={14} className="mr-1" />
            Clear
          </Button>
        </div>
      </motion.div>

      {/* React Flow Canvas */}
      <div ref={canvasRef} className="flex-1 relative bg-black">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background
            color="#1A1A1A"
            gap={32}
            size={1}
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          <Controls
            style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              borderRadius: '2px',
            }}
          />
          <MiniMap
            style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid rgba(0, 255, 255, 0.2)',
            }}
            maskColor="rgba(0, 255, 255, 0.1)"
          />
        </ReactFlow>

        {/* Empty State */}
        {nodes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <div className="text-neon-cyan/30 font-mono text-sm mb-2">
                CANVAS_EMPTY
              </div>
              <div className="text-muted-foreground font-mono text-xs">
                Send a prompt to populate the canvas
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Export for use in other components */}
      <div style={{ display: 'none' }}>
        <div data-testid="canvas-add-response" onClick={() => {
          // This is used by parent components to add responses
        }} />
      </div>
    </div>
  );
}

// Export helper to add responses from outside
export const canvasHelpers = {
  addResponseNode: (response: CanvasResponse) => {
    // This will be called from the parent component
    return response;
  },
};
