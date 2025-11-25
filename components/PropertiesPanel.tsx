import React from 'react';
import { NodeData } from '../types';
import { WIDGETS } from '../constants';

interface PropertiesPanelProps {
  selectedNode: NodeData | null;
  updateNodeLabel: (id: string, label: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNode, updateNodeLabel }) => {
  if (!selectedNode) {
    return (
      <div className="w-64 bg-white border-l border-gray-200 p-6 text-center text-gray-400">
        <p>Select a widget to edit its properties.</p>
      </div>
    );
  }

  const definition = WIDGETS[selectedNode.type];

  return (
    <div className="w-72 bg-white border-l border-gray-200 p-4 flex flex-col shadow-lg z-20">
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
        Properties
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={selectedNode.label || definition?.name || ''}
          onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Info</h3>
        <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 border border-gray-100">
          <p className="mb-2"><strong>Type:</strong> {definition?.name}</p>
          <p className="mb-2"><strong>Category:</strong> {definition?.category}</p>
          <p><strong>Desc:</strong> {definition?.description}</p>
        </div>
      </div>

      {definition?.type === 'file' && (
         <div className="mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-1">Source File</label>
           <div className="flex items-center space-x-2">
             <input type="file" className="text-xs text-gray-500" disabled />
           </div>
           <p className="text-xs text-gray-400 mt-1">File upload simulated for demo.</p>
         </div>
      )}

      {definition?.type === 'data-table' && (
         <div className="mb-6">
            <p className="text-sm text-gray-600">Rows: 150 (Iris)</p>
            <p className="text-sm text-gray-600">Columns: 5</p>
         </div>
      )}
      
      {/* Placeholder for specific widget settings */}
      <div className="flex-1"></div>

      <div className="text-xs text-gray-400 text-center">
        ID: {selectedNode.id}
      </div>
    </div>
  );
};

export default PropertiesPanel;
