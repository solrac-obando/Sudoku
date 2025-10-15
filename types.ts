
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type BoardNumber = number[][];

export interface BoardCell {
    value: number;
    isGiven: boolean;
}

export interface BoardState {
    initialBoard: BoardCell[][];
    currentBoard: BoardCell[][];
    solution: BoardNumber;
}

export interface Cell {
    row: number;
    col: number;
}
