import { WidgetCategory, WidgetDefinition } from './types';
import { 
  FileText, Table, Filter, BarChart, ScatterChart, PieChart, 
  Binary, GitBranch, Target, Zap, Activity, Grid,
  Sliders, Wand2, Scissors, RefreshCw
} from 'lucide-react';

export const WIDGETS: Record<string, WidgetDefinition> = {
  // --- DATA ---
  'file': {
    type: 'file',
    name: 'File',
    category: WidgetCategory.DATA,
    icon: FileText,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Reads data from a file (csv, tab, xlsx).',
    inputs: [],
    outputs: [{ id: 'out_data', label: 'Data', type: 'output' }]
  },
  'data-table': {
    type: 'data-table',
    name: 'Data Table',
    category: WidgetCategory.DATA,
    icon: Table,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Displays attribute-value data in a spreadsheet.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_selected', label: 'Selected Data', type: 'output' }]
  },
  'select-columns': {
    type: 'select-columns',
    name: 'Select Columns',
    category: WidgetCategory.DATA,
    icon: Filter,
    color: 'bg-red-100 border-red-300 text-red-700',
    description: 'Select features and target variable manually.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_data', label: 'Data', type: 'output' }]
  },

  // --- PREPROCESS ---
  'preprocess': {
    type: 'preprocess',
    name: 'Preprocess',
    category: WidgetCategory.PREPROCESS,
    icon: Sliders,
    color: 'bg-pink-100 border-pink-300 text-pink-700',
    description: 'Preprocesses data with selected methods.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_pre_data', label: 'Preprocessed Data', type: 'output' }]
  },
  'impute': {
    type: 'impute',
    name: 'Impute',
    category: WidgetCategory.PREPROCESS,
    icon: Wand2,
    color: 'bg-pink-100 border-pink-300 text-pink-700',
    description: 'Impute missing values in the data.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_data', label: 'Data', type: 'output' }]
  },
  'discretize': {
    type: 'discretize',
    name: 'Discretize',
    category: WidgetCategory.PREPROCESS,
    icon: Scissors,
    color: 'bg-pink-100 border-pink-300 text-pink-700',
    description: 'Discretize continuous attributes.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_data', label: 'Data', type: 'output' }]
  },
  'continuize': {
    type: 'continuize',
    name: 'Continuize',
    category: WidgetCategory.PREPROCESS,
    icon: RefreshCw,
    color: 'bg-pink-100 border-pink-300 text-pink-700',
    description: 'Turn discrete attributes into continuous.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_data', label: 'Data', type: 'output' }]
  },

  // --- VISUALIZE ---
  'scatter-plot': {
    type: 'scatter-plot',
    name: 'Scatter Plot',
    category: WidgetCategory.VISUALIZE,
    icon: ScatterChart,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: '2D scatter plot visualization.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_selection', label: 'Selected Data', type: 'output' }]
  },
  'distributions': {
    type: 'distributions',
    name: 'Distributions',
    category: WidgetCategory.VISUALIZE,
    icon: BarChart,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Displays value distributions for a single attribute.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_selection', label: 'Selected Data', type: 'output' }]
  },
  'pie-chart': {
    type: 'pie-chart',
    name: 'Pie Chart',
    category: WidgetCategory.VISUALIZE,
    icon: PieChart,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    description: 'Proportion of instances for a categorical attribute.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_selection', label: 'Selected Data', type: 'output' }]
  },

  // --- MODEL ---
  'logistic-regression': {
    type: 'logistic-regression',
    name: 'Logistic Regression',
    category: WidgetCategory.MODEL,
    icon: Activity,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'Logistic regression classification algorithm.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_learner', label: 'Learner', type: 'output' }, { id: 'out_model', label: 'Model', type: 'output' }]
  },
  'tree': {
    type: 'tree',
    name: 'Tree',
    category: WidgetCategory.MODEL,
    icon: GitBranch,
    color: 'bg-green-100 border-green-300 text-green-700',
    description: 'A simple tree learning algorithm.',
    inputs: [{ id: 'in_data', label: 'Data', type: 'input' }],
    outputs: [{ id: 'out_learner', label: 'Learner', type: 'output' }, { id: 'out_model', label: 'Model', type: 'output' }]
  },

  // --- EVALUATE ---
  'test-and-score': {
    type: 'test-and-score',
    name: 'Test & Score',
    category: WidgetCategory.EVALUATE,
    icon: Target,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Cross-validation of learning algorithms.',
    inputs: [
      { id: 'in_data', label: 'Data', type: 'input' },
      { id: 'in_learner', label: 'Learner', type: 'input' }
    ],
    outputs: [{ id: 'out_results', label: 'Evaluation Results', type: 'output' }]
  },
  'predictions': {
    type: 'predictions',
    name: 'Predictions',
    category: WidgetCategory.EVALUATE,
    icon: Zap,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    description: 'Shows predictions of models for input data.',
    inputs: [
      { id: 'in_data', label: 'Data', type: 'input' },
      { id: 'in_model', label: 'Model', type: 'input' }
    ],
    outputs: [{ id: 'out_predictions', label: 'Predictions', type: 'output' }]
  },
};

export const CATEGORY_COLORS: Record<WidgetCategory, string> = {
  [WidgetCategory.DATA]: 'bg-red-500',
  [WidgetCategory.PREPROCESS]: 'bg-pink-500',
  [WidgetCategory.VISUALIZE]: 'bg-blue-500',
  [WidgetCategory.MODEL]: 'bg-green-500',
  [WidgetCategory.EVALUATE]: 'bg-yellow-500',
  [WidgetCategory.UNSUPERVISED]: 'bg-purple-500',
};