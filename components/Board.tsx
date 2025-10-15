import React from 'react';
import type { BoardCell, Cell } from '../types';

interface BoardProps {
    board: BoardCell[][];
    onCellClick: (row: number, col: number) => void;
    selectedCell: Cell | null;
    conflicts: Set<string>;
}

// FIX: Add 'board' to function parameters to fix 'Cannot find name 'board'' error on line 50.
const getCellClasses = (
    row: number,
    col: number,
    cell: BoardCell,
    selectedCell: Cell | null,
    conflicts: Set<string>,
    board: BoardCell[][]
): string => {
    const baseClasses = "flex items-center justify-center text-2xl font-bold w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 cursor-pointer transition-colors duration-200";
    let dynamicClasses = "";

    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isInConflict = conflicts.has(`${row}-${col}`);
    
    // Highlight row, col, and box of selected cell
    const isHighlighted = selectedCell && !isSelected && (
        selectedCell.row === row ||
        selectedCell.col === col ||
        (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
    );

    if (isSelected) {
        dynamicClasses += " bg-blue-800 rounded-md shadow-lg";
    } else if (isHighlighted) {
        dynamicClasses += " bg-gray-700";
    } else {
        dynamicClasses += " bg-gray-800 hover:bg-gray-700";
    }

    if (cell.isGiven) {
        dynamicClasses += " text-cyan-300";
    } else {
        dynamicClasses += " text-gray-100";
    }

    if (isInConflict) {
        dynamicClasses += " !bg-red-800 text-red-300 rounded-md";
    }
    
    if (selectedCell && !cell.isGiven && board[selectedCell.row][selectedCell.col].value !== 0 && board[selectedCell.row][selectedCell.col].value === cell.value) {
        dynamicClasses += " !bg-blue-600 rounded-md";
    }

    // Border classes for 3x3 subgrids
    if (row % 3 === 2 && row !== 8) dynamicClasses += " border-b-4 border-cyan-500";
    if (col % 3 === 2 && col !== 8) dynamicClasses += " border-r-4 border-cyan-500";
    if (row % 3 === 0 && row !== 0) dynamicClasses += " border-t-4 border-cyan-500";
    if (col % 3 === 0 && col !== 0) dynamicClasses += " border-l-4 border-cyan-500";
    
    return `${baseClasses} ${dynamicClasses}`;
};

export const Board: React.FC<BoardProps> = ({ board, onCellClick, selectedCell, conflicts }) => {
    return (
        <div className="bg-gray-900 p-2 rounded-lg shadow-2xl border-2 border-gray-700">
            <div className="grid grid-cols-9 grid-rows-9 gap-px">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            // FIX: Pass 'board' to getCellClasses as it is now a required parameter.
                            className={getCellClasses(rowIndex, colIndex, cell, selectedCell, conflicts, board)}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                        >
                            {cell.value !== 0 ? cell.value : ''}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
