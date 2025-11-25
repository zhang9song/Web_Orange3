import React from 'react';

interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isDraft?: boolean;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ startX, startY, endX, endY, isDraft }) => {
  // Bezier curve logic
  // Orange3 lines are usually smooth curves
  const dist = Math.abs(endX - startX);
  const controlOffset = Math.max(dist * 0.5, 50);

  const path = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;

  return (
    <g>
      <path
        d={path}
        stroke={isDraft ? "#9ca3af" : "#cbd5e1"} // Gray 400 draft, Gray 300 normal (background stroke)
        strokeWidth="4"
        fill="none"
      />
      <path
        d={path}
        stroke={isDraft ? "#fb923c" : "#64748b"} // Orange 400 draft, Slate 500 normal
        strokeWidth="2"
        fill="none"
        strokeDasharray={isDraft ? "5,5" : "none"}
      />
      {isDraft && (
        <circle cx={endX} cy={endY} r={3} fill="#fb923c" />
      )}
    </g>
  );
};

export default ConnectionLine;
