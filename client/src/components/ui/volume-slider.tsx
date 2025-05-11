import React from 'react';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <input
      type="range"
      min="0"
      max="100"
      value={value || 70}
      className="volume-slider appearance-none h-1 bg-white bg-opacity-20 rounded-full w-20 focus:outline-none"
      onChange={handleChange}
    />
  );
};

export default VolumeSlider;
