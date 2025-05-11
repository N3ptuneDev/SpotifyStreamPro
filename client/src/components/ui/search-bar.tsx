import React, { useState } from 'react';
import { useLocation } from 'wouter';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [_, setLocation] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <div className="relative max-w-xl w-full ml-auto mr-auto">
      <form onSubmit={handleSearch}>
        <input 
          type="search" 
          className="bg-white bg-opacity-10 w-full py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search for songs, artists, or albums"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
      </form>
    </div>
  );
};

export default SearchBar;
