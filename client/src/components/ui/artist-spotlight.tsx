import React from 'react';

interface Artist {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  genres: string[];
  description?: string;
}

interface ArtistSpotlightProps {
  artist: Artist;
  onPlay: () => void;
}

const ArtistSpotlight: React.FC<ArtistSpotlightProps> = ({ artist, onPlay }) => {
  return (
    <div className="flex flex-col md:flex-row bg-dark-bg bg-opacity-70 rounded-xl overflow-hidden mb-10">
      <div className="md:w-1/3 h-64 md:h-auto">
        <img 
          src={artist.images[0]?.url || ''} 
          alt={`${artist.name} artist image`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
        <span className="text-primary font-medium">Featured Artist</span>
        <h3 className="text-2xl md:text-3xl font-bold font-montserrat mt-2">{artist.name}</h3>
        <p className="text-gray-300 mt-3 max-w-2xl">
          {artist.description || `Known for ${artist.genres.join(', ')} music.`}
        </p>
        <div className="mt-6 flex items-center space-x-4">
          <button 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center"
            onClick={onPlay}
          >
            <i className="ri-play-fill mr-1"></i> Play
          </button>
          <button className="border border-white border-opacity-30 hover:border-opacity-70 px-6 py-2 rounded-full font-medium transition-colors">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistSpotlight;
