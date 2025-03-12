import { useState, useEffect, useRef } from 'react';
import { GameType, GameRanking, getRankingsByGameType } from '../services/api';
import { SiLeagueoflegends, SiValorant, SiRiotgames } from 'react-icons/si';
import { FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';

interface RankingFilterProps {
  onFilterChange: (selectedRankings: number[]) => void;
  selectedGameType: GameType | null;
}

// Interface for grouped ranks
interface RankGroup {
  name: string;
  ranks: GameRanking[];
  isSelected: boolean;
}

export default function RankingFilter({ onFilterChange, selectedGameType }: RankingFilterProps) {
  const [rankings, setRankings] = useState<GameRanking[]>([]);
  const [rankGroups, setRankGroups] = useState<RankGroup[]>([]);
  const [selectedRankings, setSelectedRankings] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load rankings when selected game type changes
  useEffect(() => {
    // Clear filters when game type changes
    setSelectedRankings([]);
    onFilterChange([]);
    
    if (selectedGameType && selectedGameType !== GameType.GENERAL) {
      loadRankings(selectedGameType);
    } else {
      setRankings([]);
      setRankGroups([]);
    }
  }, [selectedGameType]);

  // Group rankings by tier when rankings change
  useEffect(() => {
    if (selectedGameType === GameType.VALORANT) {
      // Group Valorant rankings by tier
      const groups: Record<string, GameRanking[]> = {};
      
      rankings.forEach(rank => {
        // Extract base tier (e.g., "Iron 1" -> "Iron")
        const baseTier = rank.rankingName.split(' ')[0];
        if (!groups[baseTier]) {
          groups[baseTier] = [];
        }
        groups[baseTier].push(rank);
      });
      
      // Convert to array of RankGroup objects
      const groupArray: RankGroup[] = Object.entries(groups).map(([name, ranks]) => ({
        name,
        ranks,
        isSelected: ranks.every(rank => selectedRankings.includes(rank.id))
      }));
      
      setRankGroups(groupArray);
    } else {
      // For other game types, don't group
      setRankGroups([]);
    }
  }, [rankings, selectedRankings, selectedGameType]);

  const loadRankings = async (type: GameType) => {
    try {
      setIsLoading(true);
      const data = await getRankingsByGameType(type);
      setRankings(data);
    } catch (error) {
      console.error('Failed to load rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRankingToggle = (rankingId: number) => {
    setSelectedRankings(prev => {
      const newSelection = prev.includes(rankingId)
        ? prev.filter(id => id !== rankingId)
        : [...prev, rankingId];
      
      // Notify parent component about the change
      onFilterChange(newSelection);
      return newSelection;
    });
  };

  const handleGroupToggle = (group: RankGroup) => {
    setSelectedRankings(prev => {
      let newSelection: number[];
      
      if (group.isSelected) {
        // If group is selected, remove all ranks in this group
        newSelection = prev.filter(id => !group.ranks.some(rank => rank.id === id));
      } else {
        // If group is not selected, add all ranks in this group
        const rankIdsToAdd = group.ranks.map(rank => rank.id);
        newSelection = [...prev, ...rankIdsToAdd.filter(id => !prev.includes(id))];
      }
      
      // Notify parent component about the change
      onFilterChange(newSelection);
      return newSelection;
    });
  };

  const clearFilters = () => {
    setSelectedRankings([]);
    onFilterChange([]);
  };

  // Helper function to get ranking image path
  const getRankingImagePath = (gameType: GameType, rankingName: string): string => {
    if (gameType === GameType.LEAGUE_OF_LEGENDS) {
      return `/images/lol-ranking/lol-${rankingName.toLowerCase()}.png`;
    } else if (gameType === GameType.VALORANT) {
      if (rankingName === 'Radiant') {
        return `/images/Valorant-ranking/Radiant_Rank.png`;
      } else {
        const [rankBase, rankNumber] = rankingName.split(' ');
        // For group headers, use the first rank in the tier
        if (!rankNumber) {
          return `/images/Valorant-ranking/${rankBase}_1_Rank.png`;
        }
        return `/images/Valorant-ranking/${rankBase}_${rankNumber}_Rank.png`;
      }
    }
    return '';
  };

  // Get game icon based on selected game type
  const getGameIcon = () => {
    if (!selectedGameType || selectedGameType === GameType.GENERAL) {
      return <SiRiotgames className="text-gray-500" />;
    } else if (selectedGameType === GameType.LEAGUE_OF_LEGENDS) {
      return <SiLeagueoflegends className="text-yellow-500" />;
    } else if (selectedGameType === GameType.VALORANT) {
      return <SiValorant className="text-red-500" />;
    }
    return null;
  };

  // Don't show filter if no game is selected or if it's GENERAL
  if (!selectedGameType || selectedGameType === GameType.GENERAL) {
    return null;
  }

  return (
    <div className="relative mb-6" ref={dropdownRef}>
      {/* Filter Button with Badge */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <span className="mr-2">{getGameIcon()}</span>
          <span className="font-medium text-gray-700">
            Filter {selectedGameType.replace('_', ' ')} Ranks
          </span>
          {selectedRankings.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {selectedRankings.length}
            </span>
          )}
        </div>
        {isDropdownOpen ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </button>
      
      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            {/* Rankings Checkboxes */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {selectedGameType === GameType.LEAGUE_OF_LEGENDS ? 'League of Legends Ranks' : 'Valorant Ranks'}
                </label>
                <div className="flex items-center space-x-2">
                  {selectedGameType === GameType.VALORANT && (
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  )}
                  {selectedRankings.length > 0 && (
                    <button 
                      onClick={clearFilters}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading rankings...</div>
              ) : (
                <div className="max-h-60 overflow-y-auto pr-2">
                  <div className={`grid ${isExpanded ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-2`}>
                    {/* For Valorant, show grouped ranks */}
                    {selectedGameType === GameType.VALORANT && rankGroups.map(group => (
                      <div key={group.name} className="mb-2">
                        <div className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            id={`group-${group.name}`}
                            checked={group.isSelected}
                            onChange={() => handleGroupToggle(group)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`group-${group.name}`}
                            className="ml-2 flex items-center text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            <img 
                              src={getRankingImagePath(selectedGameType, group.name)}
                              alt={group.name}
                              className="w-6 h-6 mr-1.5 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            {group.name}
                          </label>
                        </div>
                        
                        {isExpanded && (
                          <div className="ml-6 space-y-1">
                            {group.ranks.map(rank => (
                              <div key={rank.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`rank-${rank.id}`}
                                  checked={selectedRankings.includes(rank.id)}
                                  onChange={() => handleRankingToggle(rank.id)}
                                  className="h-3 w-3 text-blue-400 rounded border-gray-300 focus:ring-blue-400"
                                />
                                <label 
                                  htmlFor={`rank-${rank.id}`}
                                  className="ml-2 flex items-center text-xs text-gray-600 cursor-pointer"
                                >
                                  {rank.rankingName}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* For League of Legends, show individual ranks */}
                    {selectedGameType === GameType.LEAGUE_OF_LEGENDS && rankings.map(rank => (
                      <div key={rank.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`rank-${rank.id}`}
                          checked={selectedRankings.includes(rank.id)}
                          onChange={() => handleRankingToggle(rank.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`rank-${rank.id}`}
                          className="ml-2 flex items-center text-sm text-gray-700 cursor-pointer"
                        >
                          <img 
                            src={getRankingImagePath(selectedGameType, rank.rankingName)}
                            alt={rank.rankingName}
                            className="w-6 h-6 mr-1.5 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          {rank.rankingName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected Filters Summary */}
            {selectedRankings.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Active filters:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedGameType === GameType.VALORANT ? (
                    // For Valorant, show grouped filters
                    rankGroups
                      .filter(group => group.ranks.some(rank => selectedRankings.includes(rank.id)))
                      .map(group => {
                        const selectedCount = group.ranks.filter(rank => 
                          selectedRankings.includes(rank.id)
                        ).length;
                        const isPartial = selectedCount > 0 && selectedCount < group.ranks.length;
                        
                        return (
                          <div 
                            key={group.name}
                            className="flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            <img 
                              src={getRankingImagePath(selectedGameType, group.name)}
                              alt={group.name}
                              className="w-4 h-4 mr-1 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            {group.name} {isPartial && `(${selectedCount})`}
                            <button 
                              onClick={() => {
                                const rankIdsToRemove = group.ranks
                                  .filter(rank => selectedRankings.includes(rank.id))
                                  .map(rank => rank.id);
                                
                                setSelectedRankings(prev => {
                                  const newSelection = prev.filter(id => !rankIdsToRemove.includes(id));
                                  onFilterChange(newSelection);
                                  return newSelection;
                                });
                              }}
                              className="ml-1 text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })
                  ) : (
                    // For League of Legends, show individual filters
                    selectedRankings.map(id => {
                      const rank = rankings.find(r => r.id === id);
                      if (!rank) return null;
                      
                      return (
                        <div 
                          key={id}
                          className="flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          <img 
                            src={getRankingImagePath(selectedGameType, rank.rankingName)}
                            alt={rank.rankingName}
                            className="w-4 h-4 mr-1 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          {rank.rankingName}
                          <button 
                            onClick={() => handleRankingToggle(id)}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Apply Button */}
          <div className="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-200">
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 