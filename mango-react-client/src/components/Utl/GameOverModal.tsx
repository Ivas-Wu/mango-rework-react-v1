import React from 'react'

interface GameOverModalProps {
    win: boolean;
    closeModal: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ win, closeModal }) => {

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col bg-white text-black text-4xl font-bold px-8 py-4 rounded-lg shadow-lg">
                You { win ? 'win!' : 'lose...' }
                <button onClick={closeModal}>Play again</button>
            </div>
        </div>
    )
}

export default GameOverModal
