import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NodeData, EdgeData } from '../types';
import NodeComponent from './NodeComponent';
import ConnectionLine from './ConnectionLine';
import { WIDGETS } from '../constants';

interface CanvasProps {
  nodes: NodeData[];
  edges: EdgeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setEdges: React.Dispatch<React.SetStateAction<EdgeData[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  onNodesChange?: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  nodes, edges, setNodes, setEdges, selectedNodeId, setSelectedNodeId 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Connection Draft State
  const [draftConnection, setDraftConnection] = useState<{
    sourceNodeId: string;
    sourceHandle: string;
    startX: number;
    startY: number;
    currX: number;
    currY: number;
  } | null>(null);

  // --- Helper to get handle position relative to canvas ---
  const getHandlePosition = useCallback((node: NodeData, handleId: string, type: 'input' | 'output') => {
    // This is an approximation. Ideally we measure the DOM. 
    // Given the fixed styles in NodeComponent, we can calculate.
    const definition = WIDGETS[node.type];
    if (!definition) return { x: node.x, y: node.y };

    const width = 120;
    const height = 100; // rough guess of node height, better to measure but approximation works for demo
    // Actually, let's look at NodeComponent logic: 
    // Inputs are on left (-6px), Outputs on right (width - 6px approx? No, width + ?).
    // Node width is 120px. 
    // Input x = node.x - 6. Output x = node.x + 120 + 6 (approx).
    
    // We need to re-calc specific handle Y. 
    const ports = type === 'input' ? definition.inputs : definition.outputs;
    const index = ports.findIndex(p => p.id === handleId);
    const count = ports.length;
    const topPercent = count === 1 ? 0.5 : (index + 1) / (count + 1);
    
    // We need the ACTUAL height of the DOM element to be precise.
    // For this demo, let's assume a base height + per-port height or just use a dynamic lookup if possible.
    // Simpler: Let's assume the node body is ~80px + padding.
    // Let's rely on the DOM for start connection, but for drawing existing edges, we need a stable calc.
    // We will use a standard height of 90px for calculation.
    
    const nodeBodyHeight = 90; 
    const yOffset = nodeBodyHeight * topPercent; 

    return {
      x: type === 'input' ? node.x : node.x + 120,
      y: node.y + yOffset + 35 // +35 for header offset
    };
  }, []);

  // --- Drag and Drop from Sidebar ---
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow/type');
    if (!type || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const newNode: NodeData = {
      id: `node_${Date.now()}`,
      type,
      x: x - 60, // center
      y: y - 40,
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // --- Node Moving ---
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return; // Only left click
    setSelectedNodeId(id);
    
    const node = nodes.find(n => n.id === id);
    if (!node || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    setDraggingNodeId(id);
    setDragOffset({ x: mouseX - node.x, y: mouseY - node.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    if (draggingNodeId) {
      setNodes(prev => prev.map(n => {
        if (n.id === draggingNodeId) {
          return { ...n, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y };
        }
        return n;
      }));
    }

    if (draftConnection) {
      setDraftConnection(prev => prev ? { ...prev, currX: mouseX, currY: mouseY } : null);
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setDraftConnection(null); // Cancel draft if released on empty space
  };

  // --- Connection Logic ---
  const onStartConnection = (nodeId: string, handleId: string, type: 'input' | 'output', clientX: number, clientY: number) => {
    if (type !== 'output') return; // Only start from output for now (simplify)
    
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const startX = clientX - bounds.left;
    const startY = clientY - bounds.top;

    setDraftConnection({
      sourceNodeId: nodeId,
      sourceHandle: handleId,
      startX,
      startY,
      currX: startX,
      currY: startY
    });
  };

  const onCompleteConnection = (targetNodeId: string, targetHandleId: string, type: 'input' | 'output') => {
    if (!draftConnection) return;
    if (type !== 'input') return; // Must end on input
    if (draftConnection.sourceNodeId === targetNodeId) return; // No self loops

    // Check if edge exists
    const exists = edges.some(e => 
      e.sourceId === draftConnection.sourceNodeId && 
      e.targetId === targetNodeId &&
      e.targetHandle === targetHandleId // Usually one input accepts one connection in simple model, Orange allows multiple sometimes but let's limit to 1 for simplicity or allow many.
    );

    if (!exists) {
      const newEdge: EdgeData = {
        id: `edge_${Date.now()}`,
        sourceId: draftConnection.sourceNodeId,
        sourceHandle: draftConnection.sourceHandle,
        targetId: targetNodeId,
        targetHandle: targetHandleId
      };
      setEdges(prev => [...prev, newEdge]);
    }
    setDraftConnection(null);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.sourceId !== id && e.targetId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-dot-pattern cursor-default"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={() => setSelectedNodeId(null)} // Deselect on bg click
    >
      <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-0">
        {edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.sourceId);
          const targetNode = nodes.find(n => n.id === edge.targetId);
          if (!sourceNode || !targetNode) return null;

          const start = getHandlePosition(sourceNode, edge.sourceHandle, 'output');
          const end = getHandlePosition(targetNode, edge.targetHandle, 'input');

          return (
            <ConnectionLine 
              key={edge.id} 
              startX={start.x} 
              startY={start.y} 
              endX={end.x} 
              endY={end.y} 
            />
          );
        })}
        {draftConnection && (
          <ConnectionLine 
            startX={draftConnection.startX} 
            startY={draftConnection.startY} 
            endX={draftConnection.currX} 
            endY={draftConnection.currY} 
            isDraft
          />
        )}
      </svg>

      {nodes.map(node => (
        <NodeComponent
          key={node.id}
          node={node}
          selected={selectedNodeId === node.id}
          onMouseDown={handleNodeMouseDown}
          onDelete={deleteNode}
          onStartConnection={onStartConnection}
          onCompleteConnection={onCompleteConnection}
        />
      ))}
    </div>
  );
};

export default Canvas;
