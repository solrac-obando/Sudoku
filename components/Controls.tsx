
import React from 'react';
import type { Difficulty } from '../types';

interface ControlsProps {
    onNumberInput: (num: number) => void;
    onErase: () => void;
    onNewGame: (difficulty: Difficulty) => void;
    difficulties: Difficulty[];
    activeDifficulty: Difficulty;
}

const IconButton: React.FC<{ onClick: () => void; icon: string; text: string; }> = ({ onClick, icon, text }) => (
    <button
        onClick={onClick}
        className="flex-1 bg-gray-700 hover:bg-gray-600 text-cyan-400 font-bold py-3 px-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-1 text-sm"
    >
        <i className={`fa-solid ${icon} text-xl`}></i>
        <span>{text}</span>
    </button>
);


export const Controls: React.FC<ControlsProps> = ({
    onNumberInput,
    onErase,
    onNewGame,
    difficulties,
    activeDifficulty
}) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-xs mx-auto lg:mx-0 border border-gray-700">
            <div className="grid grid-cols-3 gap-2 mb-4">
                {difficulties.map(level => (
                    <button
                        key={level}
                        onClick={() => onNewGame(level)}
                        className={`py-2 px-1 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-200 ${
                            activeDifficulty === level 
                            ? 'bg-cyan-500 text-gray-900 shadow-md' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                    <button
                        key={num}
                        onClick={() => onNumberInput(num)}
                        className="bg-gray-700 hover:bg-blue-800 text-white font-bold py-4 text-2xl rounded-lg transition-colors duration-200 aspect-square"
                    >
                        {num}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                 <IconButton onClick={onErase} icon="fa-eraser" text="Erase" />
                 <IconButton onClick={() => onNewGame(activeDifficulty)} icon="fa-plus" text="New Game" />
            </div>
        </div>
    );
};
