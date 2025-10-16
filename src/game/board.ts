export type Cell = "." | "X" | "O";

/**
 * 五目並べの盤面を表すクラス
 */
export class Board {
  private readonly cells: Cell[][];
  private readonly size: number = 15;

  private constructor(cells: Cell[][]) {
    this.cells = cells;
  }

  /**
   * 盤面を生成する
   * @param cells 15x15の盤面データ
   * @throws {Error} 盤面サイズが15x15でない場合
   */
  static create(cells: Cell[][]): Board {
    if (cells.length !== 15) {
      throw new Error("Board must be 15x15");
    }

    for (const row of cells) {
      if (row.length !== 15) {
        throw new Error("Board must be 15x15");
      }
    }

    return new Board(cells);
  }

  /**
   * 指定位置のセルの値を取得する
   * @param row 行番号 (0-14)
   * @param col 列番号 (0-14)
   * @returns セルの値。範囲外の場合はundefined
   */
  getCell(row: number, col: number): Cell | undefined {
    if (!this.isInBounds(row, col)) {
      return undefined;
    }
    return this.cells[row][col];
  }

  /**
   * 指定位置が盤面内かどうかを判定する
   * @param row 行番号
   * @param col 列番号
   * @returns 盤面内の場合true
   */
  isInBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * 盤面のサイズを取得する
   */
  getSize(): number {
    return this.size;
  }
}
