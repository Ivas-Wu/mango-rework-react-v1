import React, { useState } from 'react';
import { ConfigService } from '../../services/ConfigService';
import ConfigSlider from './ConfigSlider';

interface ConfigModalProps {
    onClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ onClose }) => {
    const configService = ConfigService.getInstance();

    const [boardSize, setBoardSize] = useState(configService.getBoardSize());
    const [tilesToGen, setTilesToGen] = useState(configService.getTilesToGen());
    const [timerMode, setTimerMode] = useState(configService.getTimerMode());
    const [timerInterval, setTimerInterval] = useState(configService.getTimerInterval());


    const handleSliderValueChange = (e: React.ChangeEvent<HTMLInputElement>, setterFunction: (value: any) => void) => {
        const value = e.target.value === '' ? 0 : Number(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setterFunction(value);
        }
    };

    const handleTimerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimerMode(e.target.checked || false);
    };

    const saveConfigs = () => {
        configService.setBoardSize(boardSize);
        configService.setTilesToGen(tilesToGen);

        configService.setTimerMode(timerMode);
        configService.setTimerInterval(timerInterval);
        onClose();
    };

    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="flex flex-col bg-white text-black text-xl font-bold px-8 py-6 rounded-lg shadow-lg space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl">Settings</h2>
                <ConfigSlider
                    title='Board Size'
                    value={boardSize}
                    min={2}
                    max={8}
                    callback={(e) => handleSliderValueChange(e, setBoardSize)}
                />
                <ConfigSlider
                    title='Tiles to Generate'
                    value={tilesToGen}
                    min={1}
                    max={8}
                    callback={(e) => handleSliderValueChange(e, setTilesToGen)}
                />

                <div className="flex items-center space-x-4">
                    <span>Timer Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={timerMode} onChange={handleTimerToggle} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-red-500 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                    </label>
                </div>

                {timerMode &&
                    <ConfigSlider
                        title='Timer'
                        value={timerInterval}
                        min={2}
                        max={120}
                        callback={(e) => handleSliderValueChange(e, setTimerInterval)}
                    />
                }

                <button
                    onClick={saveConfigs}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default ConfigModal;
