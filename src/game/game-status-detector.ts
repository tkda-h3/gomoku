import { Board, Cell } from "./board";

export type GameStatus = "BLACK_WIN" | "WHITE_WIN" | "DRAW" | "ONGOING";

/**
 * 方向を表すベクトル (row, col)
 */
type Direction = [number, number];

/**
 * セルの座標 (row, col)
 */
export type Position = [number, number];

/**
 * 5連の判定結果
 */
export type FiveInRowResult = {
  /** 5連が存在するか */
  found: boolean;
  /** 5連を構成するセルの座標配列（見つからない場合は空配列） */
  positions: Position[];
};

/**
 * ゲームの勝敗ステータスを判定するクラス
 */
export class GameStatusDetector {
  private readonly board: Board;

  // 4方向のベクトル: 横、縦、右斜め、左斜め
  private readonly directions: Direction[] = [
    [0, 1], // 右
    [1, 0], // 下
    [1, 1], // 右下
    [1, -1], // 左下
  ];

  constructor(board: Board) {
    this.board = board;
  }

  /**
   * ゲームの現在のステータスを取得する
   * @returns ゲームステータス
   */
  getGameStatus(): GameStatus {
    // 黒の勝利判定
    if (this.hasFiveInRow("X")) {
      return "BLACK_WIN";
    }

    // 白の勝利判定
    if (this.hasFiveInRow("O")) {
      return "WHITE_WIN";
    }

    // 引き分け判定
    if (this.isBoardFull()) {
      return "DRAW";
    }

    // ゲーム続行中
    return "ONGOING";
  }

  /**
   * 指定された色の石が5連を持つかを判定し、5連を構成するセルの座標を返す
   * @param color 判定する石の色
   * @returns 5連の判定結果（見つかった場合は座標配列を含む）
   */
  findFiveInRow(color: Cell): FiveInRowResult {
    if (color === ".") {
      return { found: false, positions: [] };
    }

    const size = this.board.getSize();

    // 全ての位置をチェック
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (this.board.getCell(row, col) === color) {
          // 各方向で5連をチェック
          for (const dir of this.directions) {
            const positions = this.getFiveInDirection(row, col, dir, color);
            if (positions.length >= 5) {
              return { found: true, positions };
            }
          }
        }
      }
    }

    return { found: false, positions: [] };
  }

  /**
   * 指定された色の石が5連を持つかを判定する
   * @param color 判定する石の色
   * @returns 5連を持つ場合true
   */
  hasFiveInRow(color: Cell): boolean {
    return this.findFiveInRow(color).found;
  }

  /**
   * 盤面が全て埋まっているかを判定する
   * @returns 盤面が全て埋まっている場合true
   */
  isBoardFull(): boolean {
    const size = this.board.getSize();

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (this.board.getCell(row, col) === ".") {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * 指定位置から指定方向に5連を構成するセルの座標を取得する
   */
  private getFiveInDirection(
    row: number,
    col: number,
    dir: Direction,
    color: Cell
  ): Position[] {
    const positions: Position[] = [[row, col]]; // 自分自身を含む

    // 正方向の座標を取得
    const forwardPositions = this.getPositionsInDirection(row, col, dir, color);
    positions.push(...forwardPositions);

    // 逆方向の座標を取得
    const reverseDir: Direction = [-dir[0], -dir[1]];
    const backwardPositions = this.getPositionsInDirection(
      row,
      col,
      reverseDir,
      color
    );
    positions.push(...backwardPositions);

    return positions;
  }

  /**
   * 指定方向に連続する石の座標を取得する
   */
  private getPositionsInDirection(
    row: number,
    col: number,
    dir: Direction,
    color: Cell
  ): Position[] {
    const positions: Position[] = [];
    let currentRow = row + dir[0];
    let currentCol = col + dir[1];

    while (this.board.isInBounds(currentRow, currentCol)) {
      const cell = this.board.getCell(currentRow, currentCol);
      if (cell === color) {
        positions.push([currentRow, currentCol]);
        currentRow += dir[0];
        currentCol += dir[1];
      } else {
        break;
      }
    }

    return positions;
  }
}
