import React, { useState } from 'react';

export default function PostFilter({ onFilterChange }: FilterProps) {
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedRankType, setSelectedRankType] = useState<'ranked' | 'unranked' | 'all'>('all');
  const [selectedRank, setSelectedRank] = useState('all');

  const handleClearFilter = () => {
    setSelectedRankType('all');
    setSelectedRank('all');
    
    onFilterChange({
      game: selectedGame,
      rankType: 'all',
      rank: 'all'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* ... 其他代码 ... */}

      <div className="flex justify-end mt-4">
        <button
          onClick={handleClearFilter}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
} 