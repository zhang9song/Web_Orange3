import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import Modal from './components/Modal';
import { NodeData, EdgeData, GeminiAnalysisResult } from './types';
import { analyzeWorkflow } from './services/geminiService';
import { Play, Code, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiAnalysisResult | null>(null);
  const [modalMode, setModalMode] = useState<'analysis' | 'code' | 'error'>('analysis');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDragStart = (event: React.DragEvent, widgetType: string) => {
    event.dataTransfer.setData('application/reactflow/type', widgetType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const updateNodeLabel = (id: string, label: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, label } : n));
  };

  const handleRunAnalysis = async () => {
    if (nodes.length === 0) {
      alert("Please add some nodes to the canvas first.");
      return;
    }

    setIsLoading(true);
    setIsModalOpen(true);
    setModalMode('analysis');
    setAnalysisResult(null);

    try {
      const result = await analyzeWorkflow(nodes, edges);
      setAnalysisResult(result);
    } catch (e: any) {
      setModalMode('error');
      setErrorMsg(e.message || "An error occurred while communicating with Gemini.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-lg">
            O3
          </div>
          <h1 className="text-lg font-semibold text-gray-700 tracking-tight">Orange3 <span className="text-gray-400 font-normal">Web GUI</span></h1>
        </div>

        <div className="flex items-center space-x-2">
           <button 
             onClick={handleRunAnalysis}
             className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
           >
             <Play size={16} fill="currentColor" />
             <span>Run & Explain</span>
           </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onDragStart={handleDragStart} />
        
        <Canvas 
          nodes={nodes} 
          edges={edges}
          setNodes={setNodes} 
          setEdges={setEdges}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
        />

        <PropertiesPanel 
          selectedNode={nodes.find(n => n.id === selectedNodeId) || null}
          updateNodeLabel={updateNodeLabel}
        />
      </div>

      {/* Results Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'error' ? 'Error' : 'Workflow Analysis (Gemini)'}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <p className="text-gray-500 animate-pulse">Analyzing workflow topology...</p>
            <p className="text-gray-400 text-sm mt-2">Connecting to Gemini Model...</p>
          </div>
        ) : modalMode === 'error' ? (
          <div className="flex flex-col items-center text-center p-6">
             <AlertTriangle size={48} className="text-red-500 mb-4" />
             <p className="text-red-600 font-medium mb-2">Analysis Failed</p>
             <p className="text-gray-600">{errorMsg}</p>
             {!process.env.API_KEY && (
               <p className="text-xs text-gray-400 mt-4 bg-gray-100 p-2 rounded">
                 Note: Ensure `process.env.API_KEY` is configured in your environment for Gemini access.
               </p>
             )}
          </div>
        ) : analysisResult ? (
          <div className="space-y-8">
            {/* Summary Section */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
                 <Sparkles className="text-yellow-500 mr-2" size={20} />
                 Workflow Summary
               </h3>
               <p className="text-gray-600 leading-relaxed">{analysisResult.summary}</p>
            </section>

            {/* Insights Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisResult.insights?.map((insight, idx) => (
                <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <span className="block text-blue-500 font-bold text-2xl mb-2 opacity-50">0{idx + 1}</span>
                  <p className="text-sm text-blue-900 font-medium">{insight}</p>
                </div>
              ))}
            </section>

            {/* Python Code Section */}
            <section className="bg-slate-900 rounded-lg overflow-hidden shadow-md">
               <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                 <div className="flex items-center text-slate-300 text-sm font-mono">
                   <Code size={16} className="mr-2" />
                   Generated Python Script
                 </div>
               </div>
               <div className="p-4 overflow-x-auto">
                 <pre className="text-sm font-mono text-green-400 leading-relaxed">
                   <code>{analysisResult.pythonCode}</code>
                 </pre>
               </div>
            </section>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default App;
