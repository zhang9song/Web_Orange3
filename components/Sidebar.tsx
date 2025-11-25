import React, { useMemo } from 'react';
import { WIDGETS, CATEGORY_COLORS } from '../constants';
import { WidgetCategory, WidgetDefinition } from '../types';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, widgetType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  // Group widgets by category
  const groupedWidgets = useMemo(() => {
    const groups: Partial<Record<WidgetCategory, WidgetDefinition[]>> = {};
    Object.values(WIDGETS).forEach((widget) => {
      if (!groups[widget.category]) {
        groups[widget.category] = [];
      }
      groups[widget.category]!.push(widget);
    });
    return groups;
  }, []);

  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 h-full flex flex-col shadow-lg z-10">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-gray-700 text-lg flex items-center">
          <span className="w-4 h-4 rounded-full bg-orange-500 mr-2"></span>
          Widgets
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {(Object.keys(groupedWidgets) as WidgetCategory[]).map((category) => (
          <div key={category} className="mb-4">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded text-white ${CATEGORY_COLORS[category]}`}>
              {category}
            </h3>
            <div className="space-y-1">
              {groupedWidgets[category]?.map((widget) => (
                <div
                  key={widget.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, widget.type)}
                  className="flex items-center p-2 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing border border-transparent hover:border-gray-200 transition-colors"
                >
                  <div className={`p-1.5 rounded mr-3 ${widget.color.split(' ')[0]} ${widget.color.split(' ')[2]}`}>
                    <widget.icon size={16} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{widget.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 text-xs text-gray-400 text-center border-t">
        Drag items to canvas
      </div>
    </div>
  );
};

export default Sidebar;
