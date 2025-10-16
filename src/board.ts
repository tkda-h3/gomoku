/**
 * Represents a cell state on the Gomoku board
 */
export enum CellState {
  Empty = 0,
  Black = 1,
  White = 2,
}

/**
 * Represents the Gomoku game board
 */
export class Board {
  private board: CellState[][];
  private size: number;

  /**
   * Creates a new Gomoku board
   * @param size - The size of the board (default: 15x15)
   */
  constructor(size: number = 15) {
    this.size = size;
    this.board = this.createEmptyBoard();
  }

  /**
   * Creates an empty board
   */
  private createEmptyBoard(): CellState[][] {
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(CellState.Empty));
  }

  /**
   * Gets the board size
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Gets the state of a cell at the specified position
   */
  getCell(row: number, col: number): CellState {
    if (!this.isValidPosition(row, col)) {
      throw new Error(`Invalid position: (${row}, ${col})`);
    }
    return this.board[row][col];
  }

  /**
   * Places a stone at the specified position
   */
  placeStone(row: number, col: number, state: CellState): boolean {
    if (!this.isValidPosition(row, col)) {
      return false;
    }
    if (this.board[row][col] !== CellState.Empty) {
      return false;
    }
    this.board[row][col] = state;
    return true;
  }

  /**
   * Checks if a position is valid
   */
  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Converts the board to a string representation for CLI display
   */
  toString(): string {
    const lines: string[] = [];

    // Header with column numbers
    const header = '   ' + Array.from({ length: this.size }, (_, i) => {
      return i < 10 ? ` ${i}` : `${i}`;
    }).join(' ');
    lines.push(header);

    // Board rows
    for (let row = 0; row < this.size; row++) {
      const rowNum = row < 10 ? ` ${row}` : `${row}`;
      const cells = this.board[row]
        .map((cell) => {
          switch (cell) {
            case CellState.Empty:
              return ' ·';
            case CellState.Black:
              return ' ●';
            case CellState.White:
              return ' ○';
            default:
              return ' ?';
          }
        })
        .join('');
      lines.push(`${rowNum}${cells}`);
    }

    return lines.join('\n');
  }

  /**
   * Resets the board to empty state
   */
  reset(): void {
    this.board = this.createEmptyBoard();
  }
}
