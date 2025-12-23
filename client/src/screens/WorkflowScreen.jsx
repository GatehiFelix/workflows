import { useState } from 'react';
import { 
  Plus, 
  Save, 
  Play, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Grid3x3,
  MessageSquare,
  HelpCircle,
  Square,
  GitBranch,
  Cloud,
  Clock,
  CheckCircle,
  Settings,
  Trash2,
  Copy,
  ArrowRight,
  X
} from 'lucide-react';

const WorkflowBuilder = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isActive, setIsActive] = useState(false);
  const [showNodeConfig, setShowNodeConfig] = useState(false);

  const nodeTypes = [
    { type: 'message', icon: MessageSquare, label: 'Send Message', color: 'bg-blue-500' },
    { type: 'question', icon: HelpCircle, label: 'Ask Question', color: 'bg-purple-500' },
    { type: 'button', icon: Square, label: 'Button Menu', color: 'bg-green-500' },
    { type: 'condition', icon: GitBranch, label: 'Condition', color: 'bg-orange-500' },
    { type: 'api_call', icon: Cloud, label: 'API Call', color: 'bg-indigo-500' },
    { type: 'delay', icon: Clock, label: 'Delay', color: 'bg-gray-500' },
    { type: 'end', icon: CheckCircle, label: 'End Flow', color: 'bg-red-500' }
  ];

  // Sample nodes for demo
  const [nodes, setNodes] = useState([
    { id: 1, type: 'message', label: 'Welcome Message', x: 100, y: 100, config: { message: 'Hello! Welcome to our bot.' } },
    { id: 2, type: 'question', label: 'Ask Name', x: 100, y: 250, config: { question: 'What is your name?' } },
    { id: 3, type: 'button', label: 'Choose Service', x: 100, y: 400, config: { buttons: ['Support', 'Sales', 'Info'] } }
  ]);

  const [connections, setConnections] = useState([
    { from: 1, to: 2 },
    { from: 2, to: 3 }
  ]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowNodeConfig(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Node Palette */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Node Types</h2>
          <p className="text-xs text-gray-500">Drag & drop to canvas</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {nodeTypes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-500 hover:shadow-md cursor-grab active:cursor-grabbing transition"
                draggable
              >
                <div className={`w-10 h-10 ${node.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{node.label}</h3>
                  <p className="text-xs text-gray-500 truncate">{node.type}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-lg font-semibold text-gray-800 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none px-2 py-1"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  isActive ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Undo">
              <Undo className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Redo">
              <Redo className="w-5 h-5 text-gray-600" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Zoom Out">
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 min-w-[4rem] text-center">{zoom}%</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Zoom In">
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Fit to Screen">
              <Maximize2 className="w-5 h-5 text-gray-600" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">
              <Play className="w-4 h-4" />
              Test Flow
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition">
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          ></div>

          {/* Nodes */}
          <div className="relative w-full h-full">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.x + 100;
                const y1 = fromNode.y + 60;
                const x2 = toNode.x + 100;
                const y2 = toNode.y + 20;

                const path = `M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`;

                return (
                  <g key={idx}>
                    <path
                      d={path}
                      stroke="#10b981"
                      strokeWidth="2"
                      fill="none"
                      className="hover:stroke-emerald-600 cursor-pointer"
                    />
                    <circle cx={x2} cy={y2} r="4" fill="#10b981" />
                  </g>
                );
              })}
            </svg>

            {/* Node Components */}
            {nodes.map((node) => {
              const nodeType = nodeTypes.find(nt => nt.type === node.type);
              const Icon = nodeType?.icon || MessageSquare;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`absolute w-52 bg-white rounded-xl shadow-lg border-2 cursor-pointer transition hover:shadow-xl ${
                    selectedNode?.id === node.id ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200'
                  }`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    zIndex: 10
                  }}
                >
                  {/* Node Header */}
                  <div className={`${nodeType?.color || 'bg-gray-500'} rounded-t-lg px-4 py-2 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">{nodeType?.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-white/20 rounded transition">
                        <Copy className="w-3 h-3 text-white" />
                      </button>
                      <button className="p-1 hover:bg-white/20 rounded transition">
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Node Body */}
                  <div className="px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{node.label}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {node.config?.message || node.config?.question || 'Configure this node'}
                    </p>
                  </div>

                  {/* Connection Ports */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              );
            })}
          </div>

          {/* Mini Map */}
          <div className="absolute bottom-4 right-4 w-48 h-32 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <div className="w-full h-full bg-gray-100 rounded relative overflow-hidden">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="absolute w-4 h-4 bg-emerald-500 rounded-sm"
                  style={{
                    left: `${(node.x / 10)}px`,
                    top: `${(node.y / 10)}px`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Node Configuration */}
      {showNodeConfig && selectedNode && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Node Configuration</h2>
            <button onClick={() => setShowNodeConfig(false)} className="p-1 hover:bg-gray-100 rounded transition">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Node Label</label>
              <input
                type="text"
                value={selectedNode.label}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {selectedNode.type === 'message' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Text</label>
                <textarea
                  value={selectedNode.config?.message}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your message..."
                />
              </div>
            )}

            {selectedNode.type === 'question' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <textarea
                    value={selectedNode.config?.question}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="What would you like to ask?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variable Name</label>
                  <input
                    type="text"
                    placeholder="user_response"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </>
            )}

            {selectedNode.type === 'button' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buttons</label>
                <div className="space-y-2">
                  {selectedNode.config?.buttons?.map((btn, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={btn}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button className="p-2 hover:bg-red-100 text-red-600 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition">
                    <Plus className="w-4 h-4" />
                    Add Button
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg transition">
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;