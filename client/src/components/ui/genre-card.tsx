import React from 'react';
import { useLocation } from 'wouter';

interface GenreCardProps {
  name: string;
  color: 'pink' | 'purple' | 'amber' | 'emerald';
}

const GenreCard: React.FC<GenreCardProps> = ({ name, color }) => {
  const [_, setLocation] = useLocation();
  
  const colorMap = {
    pink: 'from-primary to-accent',
    purple: 'from-purple-600 to-blue-500',
    amber: 'from-amber-500 to-red-600',
    emerald: 'from-emerald-500 to-teal-700'
  };
  
  const handleClick = () => {
    setLocation(`/search?genre=${encodeURIComponent(name.toLowerCase())}`);
  };
  
  return (
    <div 
      className={`relative h-32 rounded-lg overflow-hidden bg-gradient-to-br ${colorMap[color]} cursor-pointer`}
      onClick={handleClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-lg font-semibold font-montserrat">{name}</h3>
      </div>
    </div>
  );
};

export default GenreCard;
