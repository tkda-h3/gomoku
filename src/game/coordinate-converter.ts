/**
 * 座標変換クラス
 * API座標系（row: 1-15, col: A-O）と内部座標系（row: 0-14, col: 0-14）の相互変換を行う
 */
export class CoordinateConverter {
  /**
   * API座標（row: 1-15, col: A-O）を内部座標（row: 0-14, col: 0-14）に変換
   * @param apiRow API座標系の行番号（1-15）
   * @param apiCol API座標系の列記号（A-O）
   * @returns 内部座標系の行列番号
   * @throws Error 座標が有効範囲外の場合
   */
  static apiToInternal(
    apiRow: number,
    apiCol: string
  ): { row: number; col: number } {
    // 行のバリデーション
    if (!Number.isInteger(apiRow)) {
      throw new Error(`Invalid API row: ${apiRow}. Must be an integer.`);
    }
    if (apiRow < 1 || apiRow > 15) {
      throw new Error(`Invalid API row: ${apiRow}. Must be 1-15.`);
    }

    // 列のバリデーション
    if (typeof apiCol !== "string" || apiCol.length !== 1) {
      throw new Error(
        `Invalid API column: ${apiCol}. Must be a single character A-O.`
      );
    }

    const colIndex = apiCol.charCodeAt(0) - "A".charCodeAt(0);
    if (colIndex < 0 || colIndex > 14) {
      throw new Error(`Invalid API column: ${apiCol}. Must be A-O.`);
    }

    return {
      row: apiRow - 1,
      col: colIndex,
    };
  }

  /**
   * 内部座標（row: 0-14, col: 0-14）をAPI座標（row: 1-15, col: A-O）に変換
   * @param row 内部座標系の行番号（0-14）
   * @param col 内部座標系の列番号（0-14）
   * @returns API座標系の行番号と列記号
   * @throws Error 座標が有効範囲外の場合
   */
  static internalToApi(row: number, col: number): { row: number; col: string } {
    // 数値チェック
    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      throw new Error(
        `Invalid internal coordinates: (${row}, ${col}). Must be integers.`
      );
    }

    // 範囲チェック
    if (row < 0 || row > 14) {
      throw new Error(`Invalid internal row: ${row}. Must be 0-14.`);
    }
    if (col < 0 || col > 14) {
      throw new Error(`Invalid internal column: ${col}. Must be 0-14.`);
    }

    return {
      row: row + 1,
      col: String.fromCharCode("A".charCodeAt(0) + col),
    };
  }

  /**
   * API列記号（A-O）を内部列番号（0-14）に変換
   * @param apiCol API座標系の列記号
   * @returns 内部座標系の列番号
   * @throws Error 列記号が有効範囲外の場合
   */
  static apiColToInternal(apiCol: string): number {
    if (typeof apiCol !== "string" || apiCol.length !== 1) {
      throw new Error(
        `Invalid API column: ${apiCol}. Must be a single character A-O.`
      );
    }

    const colIndex = apiCol.charCodeAt(0) - "A".charCodeAt(0);
    if (colIndex < 0 || colIndex > 14) {
      throw new Error(`Invalid API column: ${apiCol}. Must be A-O.`);
    }

    return colIndex;
  }

  /**
   * 内部列番号（0-14）をAPI列記号（A-O）に変換
   * @param col 内部座標系の列番号
   * @returns API座標系の列記号
   * @throws Error 列番号が有効範囲外の場合
   */
  static internalColToApi(col: number): string {
    if (!Number.isInteger(col)) {
      throw new Error(`Invalid internal column: ${col}. Must be an integer.`);
    }
    if (col < 0 || col > 14) {
      throw new Error(`Invalid internal column: ${col}. Must be 0-14.`);
    }

    return String.fromCharCode("A".charCodeAt(0) + col);
  }
}
