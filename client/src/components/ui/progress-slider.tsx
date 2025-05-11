import React from 'react';

interface ProgressSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({ value, max, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <input
      type="range"
      min="0"
      max={max || 100}
      value={value || 0}
      className="music-progress appearance-none h-1 bg-white bg-opacity-20 rounded-full flex-grow focus:outline-none"
      onChange={handleChange}
    />
  );
};

export default ProgressSlider;
