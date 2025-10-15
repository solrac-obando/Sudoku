
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { WinModal } from './components/WinModal';
import { SudokuLogic } from './services/sudoku';
import type { BoardState, Cell, Difficulty } from './types';
import { DIFFICULTIES } from './constants';

const App: React.FC = () => {
    const [boardState, setBoardState] = useState<BoardState>({
        initialBoard: [],
        currentBoard: [],
        solution: [],
    });
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [conflicts, setConflicts] = useState<Set<string>>(new Set());

    const sudoku = useMemo(() => new SudokuLogic(), []);

    const newGame = useCallback((level: Difficulty) => {
        const { puzzle, solution } = sudoku.generate(level);
        const initial = puzzle.map(row => row.map(val => ({ value: val, isGiven: val !== 0 })));
        const current = puzzle.map(row => row.map(val => ({ value: val, isGiven: val !== 0 })));

        setBoardState({
            initialBoard: initial,
            currentBoard: current,
            solution: solution,
        });
        setSelectedCell(null);
        setIsSolved(false);
        setConflicts(new Set());
        setDifficulty(level);
    }, [sudoku]);

    useEffect(() => {
        newGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkWinCondition = useCallback((board: BoardState['currentBoard']) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c].value === 0 || board[r][c].value !== boardState.solution[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }, [boardState.solution]);

    const findConflicts = useCallback((board: BoardState['currentBoard'], row: number, col: number, num: number): Set<string> => {
        const newConflicts = new Set<string>();
        if (num === 0) return newConflicts;

        // Check row
        for (let c = 0; c < 9; c++) {
            if (c !== col && board[row][c].value === num) {
                newConflicts.add(`${row}-${c}`);
                newConflicts.add(`${row}-${col}`);
            }
        }
        // Check column
        for (let r = 0; r < 9; r++) {
            if (r !== row && board[r][col].value === num) {
                newConflicts.add(`${r}-${col}`);
                newConflicts.add(`${row}-${col}`);
            }
        }
        // Check 3x3 box
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if ((r !== row || c !== col) && board[r][c].value === num) {
                    newConflicts.add(`${r}-${c}`);
                    newConflicts.add(`${row}-${col}`);
                }
            }
        }
        return newConflicts;
    }, []);

    const recalculateAllConflicts = useCallback((board: BoardState['currentBoard']): Set<string> => {
        const allConflicts = new Set<string>();
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cellValue = board[r][c].value;
                if (cellValue !== 0) {
                    const cellConflicts = findConflicts(board, r, c, cellValue);
                    cellConflicts.forEach(conflict => allConflicts.add(conflict));
                }
            }
        }
        return allConflicts;
    }, [findConflicts]);

    const handleCellClick = (row: number, col: number) => {
        if (!boardState.currentBoard[row][col].isGiven) {
            setSelectedCell({ row, col });
        }
    };
    
    const handleNumberInput = (num: number) => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const newBoard = boardState.currentBoard.map(r => r.slice());
        newBoard[row][col].value = num;

        setBoardState(prev => ({ ...prev, currentBoard: newBoard }));
        setConflicts(recalculateAllConflicts(newBoard));

        if (checkWinCondition(newBoard)) {
            setIsSolved(true);
        }
    };

    const handleErase = () => {
        if (!selectedCell) return;
        handleNumberInput(0);
    };

    if (!boardState.currentBoard.length) {
        return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
            <header className="text-center mb-6">
                <h1 className="text-5xl font-bold text-cyan-400 tracking-wider">Sudoku</h1>
                <p className="text-gray-400 mt-1">Challenge your mind</p>
            </header>
            
            <main className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-5xl">
                <div className="flex-shrink-0">
                    <Board 
                        board={boardState.currentBoard}
                        onCellClick={handleCellClick}
                        selectedCell={selectedCell}
                        conflicts={conflicts}
                    />
                </div>
                
                <div className="w-full lg:w-auto">
                    <Controls
                        onNumberInput={handleNumberInput}
                        onErase={handleErase}
                        onNewGame={newGame}
                        difficulties={DIFFICULTIES}
                        activeDifficulty={difficulty}
                    />
                </div>
            </main>

            {isSolved && <WinModal onPlayAgain={() => newGame(difficulty)} />}
        </div>
    );
};

export default App;
