import React from 'react';

export enum WidgetCategory {
  DATA = 'Data',
  PREPROCESS = 'Preprocess',
  VISUALIZE = 'Visualize',
  MODEL = 'Model',
  EVALUATE = 'Evaluate',
  UNSUPERVISED = 'Unsupervised',
}

export interface PortDefinition {
  id: string;
  label: string;
  type: 'input' | 'output';
}

export interface WidgetDefinition {
  type: string;
  name: string;
  category: WidgetCategory;
  icon: React.FC<any>; // Lucide icon component
  color: string;
  description: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
}

export interface NodeData {
  id: string;
  type: string;
  x: number;
  y: number;
  label?: string; // User custom label
}

export interface EdgeData {
  id: string;
  sourceId: string;
  sourceHandle: string;
  targetId: string;
  targetHandle: string;
}

export interface GeminiAnalysisResult {
  summary: string;
  pythonCode: string;
  insights: string[];
}