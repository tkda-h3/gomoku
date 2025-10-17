import { Cell } from "./board";

/**
 * ゲーム状態管理クラス
 * 盤面の状態を管理し、石の配置や盤面情報の取得を行う
 */
export class StateManager {
  private board: Cell[][];
  private readonly boardSize = 15;

  constructor() {
    this.board = this.createEmptyBoard();
  }

  /**
   * 空の盤面を生成する
   * @returns 15x15の空盤面（全て"."）
   */
  private createEmptyBoard(): Cell[][] {
    return Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(".") as Cell[]);
  }

  /**
   * 現在の盤面を取得する
   * @returns 現在の盤面のコピー（外部から直接変更されないように）
   */
  getBoard(): Cell[][] {
    // 深いコピーを返す（外部から直接変更されないように）
    return this.board.map((row) => [...row]);
  }

  /**
   * 指定位置に石を配置する
   * @param row 行番号（0-14）
   * @param col 列番号（0-14）
   * @param stone 配置する石（"X" or "O"）
   * @throws Error 位置が範囲外、既に石がある、不正な石の種類の場合
   */
  placeStone(row: number, col: number, stone: Cell): void {
    // 石の種類チェック
    if (stone !== "X" && stone !== "O") {
      throw new Error(`Invalid stone type: ${stone}. Must be "X" or "O".`);
    }

    // 位置の有効性チェック
    if (!this.isValidPosition(row, col)) {
      throw new Error(
        `Invalid position: (${row}, ${col}). Must be within 0-14.`
      );
    }

    // 既に石があるかチェック
    if (this.board[row][col] !== ".") {
      throw new Error(`Cell (${row}, ${col}) is already occupied`);
    }

    this.board[row][col] = stone;
  }

  /**
   * 指定位置が有効な盤面内の位置かどうかを判定する
   * @param row 行番号
   * @param col 列番号
   * @returns 有効な位置の場合true
   */
  isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
  }

  /**
   * 指定位置のセルが空かどうかを判定する
   * @param row 行番号（0-14）
   * @param col 列番号（0-14）
   * @returns 空の場合true
   * @throws Error 位置が範囲外の場合
   */
  isCellEmpty(row: number, col: number): boolean {
    if (!this.isValidPosition(row, col)) {
      throw new Error(
        `Invalid position: (${row}, ${col}). Must be within 0-14.`
      );
    }
    return this.board[row][col] === ".";
  }

  /**
   * 指定位置のセルの値を取得する
   * @param row 行番号（0-14）
   * @param col 列番号（0-14）
   * @returns セルの値
   * @throws Error 位置が範囲外の場合
   */
  getCell(row: number, col: number): Cell {
    if (!this.isValidPosition(row, col)) {
      throw new Error(
        `Invalid position: (${row}, ${col}). Must be within 0-14.`
      );
    }
    return this.board[row][col];
  }

  /**
   * 盤面をリセットして空の状態に戻す
   */
  reset(): void {
    this.board = this.createEmptyBoard();
  }

  /**
   * 盤面が満杯かどうかを判定する
   * @returns 満杯の場合true
   */
  isBoardFull(): boolean {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.board[row][col] === ".") {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 盤面上の石の数を数える
   * @param stone 数える石の種類（"X" or "O"）。省略時は全ての石を数える
   * @returns 石の数
   */
  countStones(stone?: "X" | "O"): number {
    let count = 0;
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const cell = this.board[row][col];
        if (stone) {
          if (cell === stone) {
            count++;
          }
        } else {
          if (cell !== ".") {
            count++;
          }
        }
      }
    }
    return count;
  }

  /**
   * 盤面サイズを取得する
   * @returns 盤面のサイズ（15）
   */
  getBoardSize(): number {
    return this.boardSize;
  }
}
