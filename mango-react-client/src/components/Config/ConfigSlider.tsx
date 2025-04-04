import React from 'react'

interface ConfigSliderProps {
    title: string;
    value: number;
    min: number;
    max: number;
    callback: (e: any) => void;
}

const ConfigSlider: React.FC<ConfigSliderProps> = ({ title, value, min, max, callback }) => {
    return (
        <div className="flex items-center space-x-4">
            <label>{title}:</label>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={callback}
                className="w-40"
            />
            <input
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={callback}
                className="w-16 border border-gray-300 rounded px-2 text-center"
            />
        </div>
    )
}

export default ConfigSlider

