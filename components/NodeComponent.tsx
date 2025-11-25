import React, { memo } from 'react';
import { NodeData } from '../types';
import { WIDGETS } from '../constants';
import { XCircle } from 'lucide-react';

interface NodeComponentProps {
  node: NodeData;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onDelete: (id: string) => void;
  onStartConnection: (nodeId: string, handleId: string, type: 'input' | 'output', x: number, y: number) => void;
  onCompleteConnection: (nodeId: string, handleId: string, type: 'input' | 'output') => void;
}

const NodeComponent: React.FC<NodeComponentProps> = memo(({
  node,
  selected,
  onMouseDown,
  onDelete,
  onStartConnection,
  onCompleteConnection
}) => {
  const definition = WIDGETS[node.type];
  if (!definition) return null;

  const Icon = definition.icon;
  const baseColorClasses = definition.color; 
  // e.g. "bg-red-100 border-red-300 text-red-700"

  // Handle styles
  const handleStyle = (isInput: boolean) => 
    `w-3 h-3 bg-gray-400 hover:bg-orange-500 rounded-full border border-white absolute cursor-crosshair z-20 transition-colors`;

  const handleMouseDown = (e: React.MouseEvent, handleId: string, type: 'input' | 'output') => {
    e.stopPropagation();
    // Calculate absolute position of the handle for the line start
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    // We need coordinates relative to the canvas container, but rect is viewport.
    // The parent calling this will handle coordinate translation if we pass the clientX/Y
    onStartConnection(node.id, handleId, type, e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent, handleId: string, type: 'input' | 'output') => {
    e.stopPropagation();
    onCompleteConnection(node.id, handleId, type);
  };

  return (
    <div
      className={`absolute flex flex-col items-center select-none group`}
      style={{ 
        left: node.x, 
        top: node.y,
        width: '120px',
        touchAction: 'none'
      }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      {/* Selection outline */}
      <div 
        className={`
          relative w-full bg-white rounded-lg shadow-sm border 
          ${selected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'}
          transition-all duration-200 overflow-visible
        `}
      >
        {/* Header / Icon */}
        <div className={`flex flex-col items-center justify-center p-3 rounded-t-lg ${baseColorClasses.split(' ')[0]}`}>
           <Icon size={24} className={baseColorClasses.split(' ')[2]} />
        </div>
        
        {/* Title */}
        <div className="px-2 py-2 text-center">
          <p className="text-xs font-semibold text-gray-700 truncate">{node.label || definition.name}</p>
        </div>

        {/* Inputs (Left side) */}
        {definition.inputs.map((input, index) => {
          // Distribute handles evenly vertically if multiple? For now just stack or center.
          // Orange3 usually puts inputs on the left, outputs on right.
          const topPercent = definition.inputs.length === 1 ? 50 : (100 / (definition.inputs.length + 1)) * (index + 1);
          return (
            <div
              key={input.id}
              className={handleStyle(true)}
              style={{ left: '-6px', top: `${topPercent}%`, transform: 'translateY(-50%)' }}
              title={input.label}
              onMouseDown={(e) => handleMouseDown(e, input.id, 'input')}
              onMouseUp={(e) => handleMouseUp(e, input.id, 'input')}
            />
          );
        })}

        {/* Outputs (Right side) */}
        {definition.outputs.map((output, index) => {
          const topPercent = definition.outputs.length === 1 ? 50 : (100 / (definition.outputs.length + 1)) * (index + 1);
          return (
            <div
              key={output.id}
              className={handleStyle(false)}
              style={{ right: '-6px', top: `${topPercent}%`, transform: 'translateY(-50%)' }}
              title={output.label}
              onMouseDown={(e) => handleMouseDown(e, output.id, 'output')}
              onMouseUp={(e) => handleMouseUp(e, output.id, 'output')}
            />
          );
        })}
        
        {/* Delete Button (Visible on Hover/Selected) */}
        {(selected) && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
            className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow border border-gray-200 p-0.5 z-30"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>
    </div>
  );
});

export default NodeComponent;
