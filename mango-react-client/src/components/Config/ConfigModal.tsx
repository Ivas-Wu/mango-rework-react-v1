import React, { useState } from 'react';
import { ConfigService } from '../../services/ConfigService';

interface ConfigModalProps {
    onClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ onClose }) => {
    const configService = ConfigService.getInstance();

    const [boardSize, setBoardSize] = useState(configService.getBoardSize());
    const [timerValue, setTimerValue] = useState(configService.getTimerCount());

    const handleBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? 0 : Number(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setBoardSize(value);
        }
    };

    const handleTimerValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? 0 : Number(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setTimerValue(value);
        }
    };

    const saveConfigs = () => {
        configService.setBoardSize(boardSize);
        configService.setTimerCount(timerValue);
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

                <div className="flex items-center space-x-4">
                    <label>Board Size:</label>
                    <input 
                        type="range" 
                        min="2" 
                        max="8" 
                        value={boardSize} 
                        onChange={handleBoardSizeChange} 
                        className="w-40"
                    />
                    <input 
                        type="number" 
                        min="2" 
                        max="8" 
                        value={boardSize} 
                        onChange={handleBoardSizeChange} 
                        className="w-16 border border-gray-300 rounded px-2 text-center"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <label>Timer:</label>
                    <input 
                        type="range" 
                        min="2" 
                        max="120" 
                        value={timerValue} 
                        onChange={handleTimerValueChange} 
                        className="w-40"
                    />
                    <input 
                        type="number" 
                        min="2" 
                        max="120" 
                        value={timerValue} 
                        onChange={handleTimerValueChange} 
                        className="w-16 border border-gray-300 rounded px-2 text-center"
                    />
                </div>

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
