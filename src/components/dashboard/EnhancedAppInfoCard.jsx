// AppInfoCard.jsx
import React, { useState } from 'react';
import { 
  CheckCircle, Award, Shield, ChevronDown, ExternalLink, 
  Save, X, Edit, DollarSign, BarChart2, Clock, FileText
} from 'lucide-react';

const AppInfoCard = ({ 
  solution, 
  onSave,
  expanded = false,
  onToggleExpand,
  onDemo
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSolution, setEditedSolution] = useState(solution);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setEditedSolution(solution);
    setIsEditing(false);
  };
  
  const handleSave = () => {
    onSave(editedSolution);
    setIsEditing(false);
  };
  
  const handleChange = (field, value) => {
    setEditedSolution(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleImplementationChange = (field, value) => {
    setEditedSolution(prev => ({
      ...prev,
      implementation: {
        ...prev.implementation,
        [field]: value
      }
    }));
  };
  
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...editedSolution.keyFeatures];
    updatedFeatures[index] = value;
    
    setEditedSolution(prev => ({
      ...prev,
      keyFeatures: updatedFeatures
    }));
  };
  
  const addFeature = () => {
    setEditedSolution(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, ""]
    }));
  };
  
  const removeFeature = (index) => {
    const updatedFeatures = [...editedSolution.keyFeatures];
    updatedFeatures.splice(index, 1);
    
    setEditedSolution(prev => ({
      ...prev,
      keyFeatures: updatedFeatures
    }));
  };
  
  // View Mode Rendering
  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:border-indigo-200 transition-all">
        <div className="p-4">
          <div className="flex items-start">
            <div className={`w-12 h-12 rounded-lg ${solution.color} flex items-center justify-center mr-3 shadow-sm`}>
              {solution.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-900 flex items-center">
                    {solution.name}
                    {solution.verified && (
                      <span className="ml-1.5 bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-0.5" /> Verified
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">by {solution.developer}</div>
                </div>
                <div className="flex">
                  <button 
                    className="text-slate-400 hover:text-slate-600 p-1"
                    onClick={handleEdit}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-slate-400 hover:text-slate-600 p-1 ml-1"
                    onClick={onToggleExpand}
                  >
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{solution.description}</p>
            </div>
          </div>
          
          {expanded && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xs text-slate-500">Implementation</div>
                  <div className="text-sm font-medium text-slate-900 mt-1 flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 text-indigo-500 mr-1.5" />
                    {solution.implementation.complexity}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Timeline</div>
                  <div className="text-sm font-medium text-slate-900 mt-1 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-500 mr-1.5" />
                    {solution.implementation.timeToImplement}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Estimated Cost</div>
                  <div className="text-sm font-medium text-slate-900 mt-1 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-500 mr-1.5" />
                    {solution.implementation.averageCost}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-1">Key Features</div>
                <div className="flex flex-wrap gap-1.5">
                  {solution.keyFeatures.map((feature, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {solution.complianceInfo && (
                <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                  <div className="text-xs font-medium text-indigo-700 flex items-center mb-1">
                    <Shield className="w-3.5 h-3.5 mr-1" /> Compliance Information
                  </div>
                  <p className="text-xs text-indigo-700">{solution.complianceInfo}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-indigo-600 flex items-center">
                  <Award className="w-4 h-4 mr-1.5" /> ROI: {solution.roi}
                </div>
                <div className="flex space-x-2">
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                    Learn More <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                  
                  {solution.name === "2Vita" && onDemo ? (
                    <button 
                      onClick={onDemo} 
                      className="text-xs px-2.5 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"
                    >
                      Demo 2Vita <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  ) : (
                    <button className="text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Request Demo
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Edit Mode Rendering
  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-300 overflow-hidden transition-all p-4">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <h3 className="font-medium text-indigo-700">Editing Solution</h3>
        <div className="flex space-x-2">
          <button 
            className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded flex items-center"
            onClick={handleCancel}
          >
            <X className="w-3 h-3 mr-1" /> Cancel
          </button>
          <button 
            className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded flex items-center"
            onClick={handleSave}
          >
            <Save className="w-3 h-3 mr-1" /> Save Changes
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Solution Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            value={editedSolution.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Developer</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            value={editedSolution.developer}
            onChange={(e) => handleChange('developer', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            rows="3"
            value={editedSolution.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Implementation Complexity</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={editedSolution.implementation.complexity}
              onChange={(e) => handleImplementationChange('complexity', e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Timeline</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={editedSolution.implementation.timeToImplement}
              onChange={(e) => handleImplementationChange('timeToImplement', e.target.value)}
              placeholder="e.g., 10-12 weeks"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Estimated Cost</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={editedSolution.implementation.averageCost}
              onChange={(e) => handleImplementationChange('averageCost', e.target.value)}
              placeholder="e.g., $200,000 - $350,000"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">ROI</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            value={editedSolution.roi}
            onChange={(e) => handleChange('roi', e.target.value)}
            placeholder="e.g., 65% improved reentry success rate"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-slate-700">Key Features</label>
            <button
              type="button"
              className="text-xs text-indigo-600 hover:text-indigo-800"
              onClick={addFeature}
            >
              + Add Feature
            </button>
          </div>
          
          {editedSolution.keyFeatures.map((feature, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
              />
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeFeature(index)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Compliance Information</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            rows="2"
            value={editedSolution.complianceInfo || ''}
            onChange={(e) => handleChange('complianceInfo', e.target.value)}
            placeholder="e.g., HIPAA compliant, FedRAMP authorized"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Demo URL</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            value={editedSolution.demoUrl || ''}
            onChange={(e) => handleChange('demoUrl', e.target.value)}
            placeholder="e.g., https://dev.2vita.ai/login"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified"
            checked={editedSolution.verified}
            onChange={(e) => handleChange('verified', e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
            Verified Solution
          </label>
        </div>
      </div>
    </div>
  );
};

export default AppInfoCard;