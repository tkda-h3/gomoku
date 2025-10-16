import { Board, Cell } from "./board";

/**
 * 盤面を視覚的に表示するクラス
 */
export class BoardVisualizer {
  private readonly board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  /**
   * 盤面を文字列形式で視覚化する
   * @returns 視覚化された盤面文字列
   */
  visualize(): string {
    const lines: string[] = [];
    const size = this.board.getSize();

    // ヘッダー行（列ラベル A-O）
    const headerLine = "   " + "A B C D E F G H I J K L M N O";
    lines.push(headerLine);

    // 各行を生成
    for (let row = 0; row < size; row++) {
      const rowNumber = (row + 1).toString().padStart(2, " ");
      const cells: string[] = [];

      for (let col = 0; col < size; col++) {
        const cell = this.board.getCell(row, col);
        cells.push(this.cellToSymbol(cell));
      }

      const rowLine = `${rowNumber} ${cells.join(" ")}`;
      lines.push(rowLine);
    }

    return lines.join("\n");
  }

  /**
   * セルの値を表示用のシンボルに変換する
   * @param cell セルの値
   * @returns 表示用シンボル
   */
  private cellToSymbol(cell: Cell | undefined): string {
    switch (cell) {
      case "X":
        return "X";
      case "O":
        return "O";
      case ".":
      default:
        return "·";
    }
  }
}
