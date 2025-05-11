import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  return (
    <div className={`audio-visualizer h-4 ${isPlaying ? 'flex' : 'opacity-50'}`}>
      <div className="audio-bar"></div>
      <div className="audio-bar"></div>
      <div className="audio-bar"></div>
      <div className="audio-bar"></div>
      <div className="audio-bar"></div>
    </div>
  );
};

export default AudioVisualizer;
