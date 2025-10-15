
import type { Difficulty, BoardNumber } from '../types';

export class SudokuLogic {
    private board: BoardNumber;

    constructor() {
        this.board = Array(9).fill(null).map(() => Array(9).fill(0));
    }

    public generate(difficulty: Difficulty): { puzzle: BoardNumber; solution: BoardNumber } {
        this.board = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillDiagonal();
        this.fillRemaining(0, 3);

        const solution = this.board.map(row => [...row]);

        const puzzle = this.removeDigits(difficulty);
        
        return { puzzle, solution };
    }

    private fillDiagonal(): void {
        for (let i = 0; i < 9; i = i + 3) {
            this.fillBox(i, i);
        }
    }

    private fillBox(row: number, col: number): void {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = this.randomGenerator(9);
                } while (!this.unUsedInBox(row, col, num));
                this.board[row + i][col + j] = num;
            }
        }
    }

    private unUsedInBox(rowStart: number, colStart: number, num: number): boolean {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[rowStart + i][colStart + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    private randomGenerator(num: number): number {
        return Math.floor(Math.random() * num + 1);
    }
    
    private isSafe(row: number, col: number, num: number): boolean {
        return (
            this.unUsedInRow(row, num) &&
            this.unUsedInCol(col, num) &&
            this.unUsedInBox(row - (row % 3), col - (col % 3), num)
        );
    }

    private unUsedInRow(i: number, num: number): boolean {
        for (let j = 0; j < 9; j++) {
            if (this.board[i][j] === num) {
                return false;
            }
        }
        return true;
    }
    
    private unUsedInCol(j: number, num: number): boolean {
        for (let i = 0; i < 9; i++) {
            if (this.board[i][j] === num) {
                return false;
            }
        }
        return true;
    }

    private fillRemaining(i: number, j: number): boolean {
        if (j >= 9 && i < 8) {
            i = i + 1;
            j = 0;
        }
        if (i >= 9 && j >= 9) {
            return true;
        }

        if (i < 3) {
            if (j < 3) {
                j = 3;
            }
        } else if (i < 6) {
            if (j === Math.floor(i / 3) * 3) {
                j = j + 3;
            }
        } else {
            if (j === 6) {
                i = i + 1;
                j = 0;
                if (i >= 9) {
                    return true;
                }
            }
        }

        for (let num = 1; num <= 9; num++) {
            if (this.isSafe(i, j, num)) {
                this.board[i][j] = num;
                if (this.fillRemaining(i, j + 1)) {
                    return true;
                }
                this.board[i][j] = 0;
            }
        }
        return false;
    }

    private removeDigits(difficulty: Difficulty): BoardNumber {
        let count: number;
        switch (difficulty) {
            case 'Easy':
                count = 40;
                break;
            case 'Medium':
                count = 50;
                break;
            case 'Hard':
                count = 55;
                break;
            case 'Expert':
                count = 60;
                break;
            default:
                count = 50;
        }
        
        const puzzle = this.board.map(row => [...row]);
        
        while (count !== 0) {
            const i = Math.floor(Math.random() * 9);
            const j = Math.floor(Math.random() * 9);

            if (puzzle[i][j] !== 0) {
                count--;
                puzzle[i][j] = 0;
            }
        }
        return puzzle;
    }
}
