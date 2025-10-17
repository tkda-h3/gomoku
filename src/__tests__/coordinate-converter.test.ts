import { CoordinateConverter } from "../game/coordinate-converter";

describe("CoordinateConverter", () => {
  describe("apiToInternal", () => {
    describe("正常系", () => {
      test("左上隅の座標変換（1, A → 0, 0）", () => {
        const result = CoordinateConverter.apiToInternal(1, "A");
        expect(result).toEqual({ row: 0, col: 0 });
      });

      test("右上隅の座標変換（1, O → 0, 14）", () => {
        const result = CoordinateConverter.apiToInternal(1, "O");
        expect(result).toEqual({ row: 0, col: 14 });
      });

      test("左下隅の座標変換（15, A → 14, 0）", () => {
        const result = CoordinateConverter.apiToInternal(15, "A");
        expect(result).toEqual({ row: 14, col: 0 });
      });

      test("右下隅の座標変換（15, O → 14, 14）", () => {
        const result = CoordinateConverter.apiToInternal(15, "O");
        expect(result).toEqual({ row: 14, col: 14 });
      });

      test("中央の座標変換（8, H → 7, 7）", () => {
        const result = CoordinateConverter.apiToInternal(8, "H");
        expect(result).toEqual({ row: 7, col: 7 });
      });

      test("全ての行番号（1-15）が正しく変換される", () => {
        for (let apiRow = 1; apiRow <= 15; apiRow++) {
          const result = CoordinateConverter.apiToInternal(apiRow, "A");
          expect(result.row).toBe(apiRow - 1);
        }
      });

      test("全ての列記号（A-O）が正しく変換される", () => {
        const columns = "ABCDEFGHIJKLMNO";
        for (let i = 0; i < columns.length; i++) {
          const result = CoordinateConverter.apiToInternal(1, columns[i]);
          expect(result.col).toBe(i);
        }
      });
    });

    describe("異常系", () => {
      test("行番号が0の場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(0, "A")).toThrow(
          "Invalid API row: 0. Must be 1-15."
        );
      });

      test("行番号が16の場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(16, "A")).toThrow(
          "Invalid API row: 16. Must be 1-15."
        );
      });

      test("行番号が負の数の場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(-1, "A")).toThrow(
          "Invalid API row: -1. Must be 1-15."
        );
      });

      test("行番号が小数の場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(1.5, "A")).toThrow(
          "Invalid API row: 1.5. Must be an integer."
        );
      });

      test("列記号がPの場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(1, "P")).toThrow(
          "Invalid API column: P. Must be A-O."
        );
      });

      test("列記号がZの場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(1, "Z")).toThrow(
          "Invalid API column: Z. Must be A-O."
        );
      });

      test("列記号が小文字の場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(1, "a")).toThrow(
          "Invalid API column: a. Must be A-O."
        );
      });

      test("列記号が複数文字の場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(1, "AA")).toThrow(
          "Invalid API column: AA. Must be a single character A-O."
        );
      });

      test("列記号が空文字の場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(1, "")).toThrow(
          "Invalid API column: . Must be a single character A-O."
        );
      });

      test("列記号が数字の場合はエラー", () => {
        expect(() => CoordinateConverter.apiToInternal(1, "1")).toThrow(
          "Invalid API column: 1. Must be A-O."
        );
      });
    });
  });

  describe("internalToApi", () => {
    describe("正常系", () => {
      test("左上隅の座標変換（0, 0 → 1, A）", () => {
        const result = CoordinateConverter.internalToApi(0, 0);
        expect(result).toEqual({ row: 1, col: "A" });
      });

      test("右上隅の座標変換（0, 14 → 1, O）", () => {
        const result = CoordinateConverter.internalToApi(0, 14);
        expect(result).toEqual({ row: 1, col: "O" });
      });

      test("左下隅の座標変換（14, 0 → 15, A）", () => {
        const result = CoordinateConverter.internalToApi(14, 0);
        expect(result).toEqual({ row: 15, col: "A" });
      });

      test("右下隅の座標変換（14, 14 → 15, O）", () => {
        const result = CoordinateConverter.internalToApi(14, 14);
        expect(result).toEqual({ row: 15, col: "O" });
      });

      test("中央の座標変換（7, 7 → 8, H）", () => {
        const result = CoordinateConverter.internalToApi(7, 7);
        expect(result).toEqual({ row: 8, col: "H" });
      });

      test("全ての行番号（0-14）が正しく変換される", () => {
        for (let row = 0; row <= 14; row++) {
          const result = CoordinateConverter.internalToApi(row, 0);
          expect(result.row).toBe(row + 1);
        }
      });

      test("全ての列番号（0-14）が正しく変換される", () => {
        const expectedColumns = "ABCDEFGHIJKLMNO";
        for (let col = 0; col <= 14; col++) {
          const result = CoordinateConverter.internalToApi(0, col);
          expect(result.col).toBe(expectedColumns[col]);
        }
      });
    });

    describe("異常系", () => {
      test("行番号が-1の場合はエラー", () => {
        expect(() => CoordinateConverter.internalToApi(-1, 0)).toThrow(
          "Invalid internal row: -1. Must be 0-14."
        );
      });

      test("行番号が15の場合はエラー", () => {
        expect(() => CoordinateConverter.internalToApi(15, 0)).toThrow(
          "Invalid internal row: 15. Must be 0-14."
        );
      });

      test("列番号が-1の場合はエラー", () => {
        expect(() => CoordinateConverter.internalToApi(0, -1)).toThrow(
          "Invalid internal column: -1. Must be 0-14."
        );
      });

      test("列番号が15の場合はエラー", () => {
        expect(() => CoordinateConverter.internalToApi(0, 15)).toThrow(
          "Invalid internal column: 15. Must be 0-14."
        );
      });

      test("行番号が小数の場合はエラー", () => {
        expect(() => CoordinateConverter.internalToApi(1.5, 0)).toThrow(
          "Invalid internal coordinates: (1.5, 0). Must be integers."
        );
      });

      test("列番号が小数の場合はエラー", () => {
        expect(() => CoordinateConverter.internalToApi(0, 1.5)).toThrow(
          "Invalid internal coordinates: (0, 1.5). Must be integers."
        );
      });
    });
  });

  describe("apiColToInternal", () => {
    describe("正常系", () => {
      test("Aを0に変換", () => {
        expect(CoordinateConverter.apiColToInternal("A")).toBe(0);
      });

      test("Hを7に変換", () => {
        expect(CoordinateConverter.apiColToInternal("H")).toBe(7);
      });

      test("Oを14に変換", () => {
        expect(CoordinateConverter.apiColToInternal("O")).toBe(14);
      });

      test("全ての列記号が正しく変換される", () => {
        const columns = "ABCDEFGHIJKLMNO";
        for (let i = 0; i < columns.length; i++) {
          expect(CoordinateConverter.apiColToInternal(columns[i])).toBe(i);
        }
      });
    });

    describe("異常系", () => {
      test("Pはエラー", () => {
        expect(() => CoordinateConverter.apiColToInternal("P")).toThrow(
          "Invalid API column: P. Must be A-O."
        );
      });

      test("小文字はエラー", () => {
        expect(() => CoordinateConverter.apiColToInternal("a")).toThrow(
          "Invalid API column: a. Must be A-O."
        );
      });

      test("複数文字はエラー", () => {
        expect(() => CoordinateConverter.apiColToInternal("AB")).toThrow(
          "Invalid API column: AB. Must be a single character A-O."
        );
      });

      test("空文字はエラー", () => {
        expect(() => CoordinateConverter.apiColToInternal("")).toThrow(
          "Invalid API column: . Must be a single character A-O."
        );
      });
    });
  });

  describe("internalColToApi", () => {
    describe("正常系", () => {
      test("0をAに変換", () => {
        expect(CoordinateConverter.internalColToApi(0)).toBe("A");
      });

      test("7をHに変換", () => {
        expect(CoordinateConverter.internalColToApi(7)).toBe("H");
      });

      test("14をOに変換", () => {
        expect(CoordinateConverter.internalColToApi(14)).toBe("O");
      });

      test("全ての列番号が正しく変換される", () => {
        const expectedColumns = "ABCDEFGHIJKLMNO";
        for (let i = 0; i <= 14; i++) {
          expect(CoordinateConverter.internalColToApi(i)).toBe(
            expectedColumns[i]
          );
        }
      });
    });

    describe("異常系", () => {
      test("-1はエラー", () => {
        expect(() => CoordinateConverter.internalColToApi(-1)).toThrow(
          "Invalid internal column: -1. Must be 0-14."
        );
      });

      test("15はエラー", () => {
        expect(() => CoordinateConverter.internalColToApi(15)).toThrow(
          "Invalid internal column: 15. Must be 0-14."
        );
      });

      test("小数はエラー", () => {
        expect(() => CoordinateConverter.internalColToApi(1.5)).toThrow(
          "Invalid internal column: 1.5. Must be an integer."
        );
      });
    });
  });

  describe("双方向変換の一貫性", () => {
    test("API座標→内部座標→API座標で元に戻る", () => {
      for (let apiRow = 1; apiRow <= 15; apiRow++) {
        const columns = "ABCDEFGHIJKLMNO";
        for (const apiCol of columns) {
          const internal = CoordinateConverter.apiToInternal(apiRow, apiCol);
          const backToApi = CoordinateConverter.internalToApi(
            internal.row,
            internal.col
          );
          expect(backToApi).toEqual({ row: apiRow, col: apiCol });
        }
      }
    });

    test("内部座標→API座標→内部座標で元に戻る", () => {
      for (let row = 0; row <= 14; row++) {
        for (let col = 0; col <= 14; col++) {
          const api = CoordinateConverter.internalToApi(row, col);
          const backToInternal = CoordinateConverter.apiToInternal(
            api.row,
            api.col
          );
          expect(backToInternal).toEqual({ row, col });
        }
      }
    });
  });
});
