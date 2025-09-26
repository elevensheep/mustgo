import React from 'react';
import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded-lg transition-colors ${
          viewMode === 'grid' 
            ? 'bg-primary-100 text-primary-600' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
        aria-label="그리드 뷰"
      >
        <Grid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded-lg transition-colors ${
          viewMode === 'list' 
            ? 'bg-primary-100 text-primary-600' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
        aria-label="리스트 뷰"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ViewToggle;

