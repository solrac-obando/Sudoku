
import React from 'react';

interface WinModalProps {
    onPlayAgain: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ onPlayAgain }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 text-center border-2 border-cyan-500 animate-fade-in">
                <h2 className="text-4xl font-bold text-cyan-400 mb-4">Congratulations!</h2>
                <p className="text-gray-300 text-lg mb-6">You have successfully solved the puzzle.</p>
                <button
                    onClick={onPlayAgain}
                    className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Play Again
                </button>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
