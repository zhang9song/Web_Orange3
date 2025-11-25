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

  // Handle styles
  const handleStyle = (isInput: boolean) => 
    `w-3 h-3 bg-gray-400 hover:bg-orange-500 rounded-full border border-white absolute cursor-crosshair z-20 transition-colors`;

  const handleMouseDown = (e: React.MouseEvent, handleId: string, type: 'input' | 'output') => {
    e.stopPropagation();
    // We pass client coordinates to start the drag visually from the mouse pointer
    // The Canvas will calculate the line start.
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
      {/* Selection outline & Main Card */}
      <div 
        className={`
          relative w-full bg-white rounded-lg shadow-sm border 
          ${selected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'}
          transition-all duration-200 overflow-visible
          h-[100px] flex flex-col
        `}
      >
        {/* Header / Icon */}
        <div className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-t-lg ${baseColorClasses.split(' ')[0]}`}>
           <Icon size={24} className={baseColorClasses.split(' ')[2]} />
        </div>
        
        {/* Title */}
        <div className="px-2 py-2 text-center flex-1 flex items-center justify-center overflow-hidden">
          <p className="text-xs font-semibold text-gray-700 truncate w-full" title={node.label || definition.name}>
            {node.label || definition.name}
          </p>
        </div>

        {/* Inputs (Left side) */}
        {definition.inputs.map((input, index) => {
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