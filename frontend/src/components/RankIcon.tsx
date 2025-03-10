import React from 'react';

interface RankIconProps {
  gameType: string;
  rankName: string;
  className?: string;
}

export default function RankIcon({ gameType, rankName, className = "w-5 h-5" }: RankIconProps) {
  // League of Legends ranks
  if (gameType === 'LEAGUE_OF_LEGENDS') {
    switch (rankName.toLowerCase()) {
      case 'iron':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="#6e6e6e">
            {/* SVG path for Iron rank */}
            <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.5L17 8v8l-5 2.5L7 16V8l5-3.5z" />
          </svg>
        );
      case 'bronze':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="#cd7f32">
            {/* SVG path for Bronze rank */}
            <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.5L17 8v8l-5 2.5L7 16V8l5-3.5z" />
          </svg>
        );
      // Add more cases for other ranks
      default:
        return <span className={`${className} bg-blue-200 rounded-full`}></span>;
    }
  }
  
  // Valorant ranks
  if (gameType === 'VALORANT') {
    // Similar switch statement for Valorant ranks
  }
  
  return <span className={`${className} bg-gray-200 rounded-full`}></span>;
} 