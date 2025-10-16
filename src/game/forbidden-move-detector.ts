import { Board, Cell } from "./board";

/**
 * 方向を表すベクトル (row, col)
 */
type Direction = [number, number];

/**
 * 禁じ手を判定するクラス
 * 五目並べにおける黒石の禁じ手(三三、四四、長連)を検出する
 */
export class ForbiddenMoveDetector {
  private readonly board: Board;

  // 4方向のベクトル: 横、縦、斜め
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
   * 指定位置への着手が禁じ手かどうかを判定する
   * @param row 行番号
   * @param col 列番号
   * @param color 石の色
   * @returns 禁じ手の場合true
   */
  isForbiddenMove(row: number, col: number, color: Cell): boolean {
    // 白石には禁じ手がない
    if (color === "O") {
      return false;
    }

    return (
      this.isDoubleThree(row, col, color) ||
      this.isDoubleFour(row, col, color) ||
      this.isOverline(row, col, color)
    );
  }

  /**
   * 三三の禁じ手を判定する
   * @param row 行番号
   * @param col 列番号
   * @param color 石の色
   * @returns 三三が成立する場合true
   */
  isDoubleThree(row: number, col: number, color: Cell): boolean {
    // 白石には禁じ手がない
    if (color === "O") {
      return false;
    }

    let threeCount = 0;

    for (const dir of this.directions) {
      if (this.isThree(row, col, dir, color)) {
        threeCount++;
      }
    }

    return threeCount >= 2;
  }

  /**
   * 四四の禁じ手を判定する
   * @param row 行番号
   * @param col 列番号
   * @param color 石の色
   * @returns 四四が成立する場合true
   */
  isDoubleFour(row: number, col: number, color: Cell): boolean {
    // 白石には禁じ手がない
    if (color === "O") {
      return false;
    }

    let fourCount = 0;

    for (const dir of this.directions) {
      if (this.isFour(row, col, dir, color)) {
        fourCount++;
      }
    }

    return fourCount >= 2;
  }

  /**
   * 長連(6連以上)の禁じ手を判定する
   * @param row 行番号
   * @param col 列番号
   * @param color 石の色
   * @returns 6連以上が成立する場合true
   */
  isOverline(row: number, col: number, color: Cell): boolean {
    // 白石には禁じ手がない
    if (color === "O") {
      return false;
    }

    for (const dir of this.directions) {
      const count = this.countConsecutive(row, col, dir, color);
      if (count >= 6) {
        return true;
      }
    }

    return false;
  }

  /**
   * 指定方向に三を形成するかを判定する
   */
  private isThree(
    row: number,
    col: number,
    dir: Direction,
    color: Cell
  ): boolean {
    const count = this.countConsecutive(row, col, dir, color);
    // 三は正確に3つの連続で、かつ両端が開いている必要がある
    return count === 3 && this.hasOpenEnds(row, col, dir, color);
  }

  /**
   * 指定方向に四を形成するかを判定する
   */
  private isFour(
    row: number,
    col: number,
    dir: Direction,
    color: Cell
  ): boolean {
    const count = this.countConsecutive(row, col, dir, color);
    // 四は正確に4つの連続で、少なくとも片方が開いている必要がある
    return count === 4 && this.hasAtLeastOneOpenEnd(row, col, dir, color);
  }

  /**
   * 指定方向の連続する石の数を数える(着手予定の位置を含む)
   */
  private countConsecutive(
    row: number,
    col: number,
    dir: Direction,
    color: Cell
  ): number {
    let count = 1; // 自分自身(着手予定位置)を含む

    // 正方向にカウント
    count += this.countInDirection(row, col, dir, color);

    // 逆方向にカウント
    const reverseDir: Direction = [-dir[0], -dir[1]];
    count += this.countInDirection(row, col, reverseDir, color);

    return count;
  }

  /**
   * 指定方向に連続する石の数を数える
   */
  private countInDirection(
    row: number,
    col: number,
    dir: Direction,
    color: Cell
  ): number {
    let count = 0;
    let currentRow = row + dir[0];
    let currentCol = col + dir[1];

    while (this.board.isInBounds(currentRow, currentCol)) {
      const cell = this.board.getCell(currentRow, currentCol);
      if (cell === color) {
        count++;
        currentRow += dir[0];
        currentCol += dir[1];
      } else {
        break;
      }
    }

    return count;
  }

  /**
   * 両端が開いているかを判定する
   */
  private hasOpenEnds(
    row: number,
    col: number,
    dir: Direction,
    color: Cell
  ): boolean {
    // 正方向の端をチェック
    const forwardCount = this.countInDirection(row, col, dir, color);
    const forwardEndRow = row + dir[0] * (forwardCount + 1);
    const forwardEndCol = col + dir[1] * (forwardCount + 1);
    const isForwardOpen =
      this.board.isInBounds(forwardEndRow, forwardEndCol) &&
      this.board.getCell(forwardEndRow, forwardEndCol) === ".";

    // 逆方向の端をチェック
    const reverseDir: Direction = [-dir[0], -dir[1]];
    const backwardCount = this.countInDirection(row, col, reverseDir, color);
    const backwardEndRow = row + reverseDir[0] * (backwardCount + 1);
    const backwardEndCol = col + reverseDir[1] * (backwardCount + 1);
    const isBackwardOpen =
      this.board.isInBounds(backwardEndRow, backwardEndCol) &&
      this.board.getCell(backwardEndRow, backwardEndCol) === ".";

    return isForwardOpen && isBackwardOpen;
  }

  /**
   * 少なくとも片方が開いているかを判定する
   */
  private hasAtLeastOneOpenEnd(
    row: number,
    col: number,
    dir: Direction,
    color: Cell
  ): boolean {
    // 正方向の端をチェック
    const forwardCount = this.countInDirection(row, col, dir, color);
    const forwardEndRow = row + dir[0] * (forwardCount + 1);
    const forwardEndCol = col + dir[1] * (forwardCount + 1);
    const isForwardOpen =
      this.board.isInBounds(forwardEndRow, forwardEndCol) &&
      this.board.getCell(forwardEndRow, forwardEndCol) === ".";

    // 逆方向の端をチェック
    const reverseDir: Direction = [-dir[0], -dir[1]];
    const backwardCount = this.countInDirection(row, col, reverseDir, color);
    const backwardEndRow = row + reverseDir[0] * (backwardCount + 1);
    const backwardEndCol = col + reverseDir[1] * (backwardCount + 1);
    const isBackwardOpen =
      this.board.isInBounds(backwardEndRow, backwardEndCol) &&
      this.board.getCell(backwardEndRow, backwardEndCol) === ".";

    return isForwardOpen || isBackwardOpen;
  }
}
