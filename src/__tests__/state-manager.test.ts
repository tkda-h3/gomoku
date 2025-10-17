import { StateManager } from "../game/state-manager";
import { Cell } from "../game/board";

describe("StateManager", () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  describe("初期化", () => {
    test("初期状態で15x15の空盤面が生成される", () => {
      const board = stateManager.getBoard();
      expect(board.length).toBe(15);
      expect(board.every((row) => row.length === 15)).toBe(true);
      expect(board.every((row) => row.every((cell) => cell === "."))).toBe(
        true
      );
    });

    test("getBoardSizeが15を返す", () => {
      expect(stateManager.getBoardSize()).toBe(15);
    });

    test("初期状態で盤面は満杯ではない", () => {
      expect(stateManager.isBoardFull()).toBe(false);
    });

    test("初期状態で石の数は0", () => {
      expect(stateManager.countStones()).toBe(0);
      expect(stateManager.countStones("X")).toBe(0);
      expect(stateManager.countStones("O")).toBe(0);
    });
  });

  describe("getBoard", () => {
    test("盤面のコピーを返す（元の盤面に影響しない）", () => {
      const board1 = stateManager.getBoard();
      board1[0][0] = "X";
      const board2 = stateManager.getBoard();
      expect(board2[0][0]).toBe(".");
    });
  });

  describe("placeStone", () => {
    describe("正常系", () => {
      test("黒石（X）を配置できる", () => {
        stateManager.placeStone(0, 0, "X");
        expect(stateManager.getCell(0, 0)).toBe("X");
      });

      test("白石（O）を配置できる", () => {
        stateManager.placeStone(0, 0, "O");
        expect(stateManager.getCell(0, 0)).toBe("O");
      });

      test("複数の石を異なる位置に配置できる", () => {
        stateManager.placeStone(0, 0, "X");
        stateManager.placeStone(1, 1, "O");
        stateManager.placeStone(2, 2, "X");

        expect(stateManager.getCell(0, 0)).toBe("X");
        expect(stateManager.getCell(1, 1)).toBe("O");
        expect(stateManager.getCell(2, 2)).toBe("X");
      });

      test("盤面の四隅に石を配置できる", () => {
        stateManager.placeStone(0, 0, "X"); // 左上
        stateManager.placeStone(0, 14, "O"); // 右上
        stateManager.placeStone(14, 0, "X"); // 左下
        stateManager.placeStone(14, 14, "O"); // 右下

        expect(stateManager.getCell(0, 0)).toBe("X");
        expect(stateManager.getCell(0, 14)).toBe("O");
        expect(stateManager.getCell(14, 0)).toBe("X");
        expect(stateManager.getCell(14, 14)).toBe("O");
      });

      test("中央に石を配置できる", () => {
        stateManager.placeStone(7, 7, "X");
        expect(stateManager.getCell(7, 7)).toBe("X");
      });
    });

    describe("異常系", () => {
      test("既に石がある位置に配置しようとするとエラー", () => {
        stateManager.placeStone(0, 0, "X");
        expect(() => stateManager.placeStone(0, 0, "O")).toThrow(
          "Cell (0, 0) is already occupied"
        );
      });

      test("不正な石の種類を配置しようとするとエラー", () => {
        expect(() => stateManager.placeStone(0, 0, "." as Cell)).toThrow(
          'Invalid stone type: .. Must be "X" or "O".'
        );
      });

      test("行が範囲外（負の数）の場合エラー", () => {
        expect(() => stateManager.placeStone(-1, 0, "X")).toThrow(
          "Invalid position: (-1, 0). Must be within 0-14."
        );
      });

      test("行が範囲外（15以上）の場合エラー", () => {
        expect(() => stateManager.placeStone(15, 0, "X")).toThrow(
          "Invalid position: (15, 0). Must be within 0-14."
        );
      });

      test("列が範囲外（負の数）の場合エラー", () => {
        expect(() => stateManager.placeStone(0, -1, "X")).toThrow(
          "Invalid position: (0, -1). Must be within 0-14."
        );
      });

      test("列が範囲外（15以上）の場合エラー", () => {
        expect(() => stateManager.placeStone(0, 15, "X")).toThrow(
          "Invalid position: (0, 15). Must be within 0-14."
        );
      });
    });
  });

  describe("isValidPosition", () => {
    test("有効な位置の場合true", () => {
      expect(stateManager.isValidPosition(0, 0)).toBe(true);
      expect(stateManager.isValidPosition(7, 7)).toBe(true);
      expect(stateManager.isValidPosition(14, 14)).toBe(true);
    });

    test("無効な位置の場合false", () => {
      expect(stateManager.isValidPosition(-1, 0)).toBe(false);
      expect(stateManager.isValidPosition(0, -1)).toBe(false);
      expect(stateManager.isValidPosition(15, 0)).toBe(false);
      expect(stateManager.isValidPosition(0, 15)).toBe(false);
      expect(stateManager.isValidPosition(-1, -1)).toBe(false);
      expect(stateManager.isValidPosition(15, 15)).toBe(false);
    });
  });

  describe("isCellEmpty", () => {
    describe("正常系", () => {
      test("空のセルの場合true", () => {
        expect(stateManager.isCellEmpty(0, 0)).toBe(true);
        expect(stateManager.isCellEmpty(7, 7)).toBe(true);
        expect(stateManager.isCellEmpty(14, 14)).toBe(true);
      });

      test("石があるセルの場合false", () => {
        stateManager.placeStone(0, 0, "X");
        stateManager.placeStone(7, 7, "O");

        expect(stateManager.isCellEmpty(0, 0)).toBe(false);
        expect(stateManager.isCellEmpty(7, 7)).toBe(false);
      });
    });

    describe("異常系", () => {
      test("範囲外の位置を指定するとエラー", () => {
        expect(() => stateManager.isCellEmpty(-1, 0)).toThrow(
          "Invalid position: (-1, 0). Must be within 0-14."
        );
        expect(() => stateManager.isCellEmpty(15, 0)).toThrow(
          "Invalid position: (15, 0). Must be within 0-14."
        );
      });
    });
  });

  describe("getCell", () => {
    describe("正常系", () => {
      test("空のセルから'.'を取得", () => {
        expect(stateManager.getCell(0, 0)).toBe(".");
      });

      test("黒石のセルから'X'を取得", () => {
        stateManager.placeStone(0, 0, "X");
        expect(stateManager.getCell(0, 0)).toBe("X");
      });

      test("白石のセルから'O'を取得", () => {
        stateManager.placeStone(0, 0, "O");
        expect(stateManager.getCell(0, 0)).toBe("O");
      });
    });

    describe("異常系", () => {
      test("範囲外の位置を指定するとエラー", () => {
        expect(() => stateManager.getCell(-1, 0)).toThrow(
          "Invalid position: (-1, 0). Must be within 0-14."
        );
        expect(() => stateManager.getCell(15, 15)).toThrow(
          "Invalid position: (15, 15). Must be within 0-14."
        );
      });
    });
  });

  describe("reset", () => {
    test("石を配置した後、リセットすると空盤面に戻る", () => {
      stateManager.placeStone(0, 0, "X");
      stateManager.placeStone(1, 1, "O");
      stateManager.placeStone(2, 2, "X");

      expect(stateManager.countStones()).toBe(3);

      stateManager.reset();

      const board = stateManager.getBoard();
      expect(board.every((row) => row.every((cell) => cell === "."))).toBe(
        true
      );
      expect(stateManager.countStones()).toBe(0);
    });
  });

  describe("isBoardFull", () => {
    test("空盤面の場合false", () => {
      expect(stateManager.isBoardFull()).toBe(false);
    });

    test("一部に石がある場合false", () => {
      for (let i = 0; i < 10; i++) {
        stateManager.placeStone(i, i, i % 2 === 0 ? "X" : "O");
      }
      expect(stateManager.isBoardFull()).toBe(false);
    });

    test("全てのセルに石がある場合true", () => {
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
          const stone = (row + col) % 2 === 0 ? "X" : "O";
          stateManager.placeStone(row, col, stone);
        }
      }
      expect(stateManager.isBoardFull()).toBe(true);
    });
  });

  describe("countStones", () => {
    test("空盤面では0を返す", () => {
      expect(stateManager.countStones()).toBe(0);
      expect(stateManager.countStones("X")).toBe(0);
      expect(stateManager.countStones("O")).toBe(0);
    });

    test("黒石の数を正しく数える", () => {
      stateManager.placeStone(0, 0, "X");
      stateManager.placeStone(1, 1, "X");
      stateManager.placeStone(2, 2, "X");
      stateManager.placeStone(3, 3, "O");

      expect(stateManager.countStones("X")).toBe(3);
    });

    test("白石の数を正しく数える", () => {
      stateManager.placeStone(0, 0, "O");
      stateManager.placeStone(1, 1, "O");
      stateManager.placeStone(2, 2, "X");

      expect(stateManager.countStones("O")).toBe(2);
    });

    test("全ての石の数を正しく数える", () => {
      stateManager.placeStone(0, 0, "X");
      stateManager.placeStone(1, 1, "O");
      stateManager.placeStone(2, 2, "X");
      stateManager.placeStone(3, 3, "O");

      expect(stateManager.countStones()).toBe(4);
    });
  });

  describe("統合的なゲーム進行シナリオ", () => {
    test("交互に石を配置する通常のゲーム進行", () => {
      // 黒の手番
      stateManager.placeStone(7, 7, "X");
      expect(stateManager.countStones("X")).toBe(1);
      expect(stateManager.countStones("O")).toBe(0);

      // 白の手番
      stateManager.placeStone(7, 8, "O");
      expect(stateManager.countStones("X")).toBe(1);
      expect(stateManager.countStones("O")).toBe(1);

      // 黒の手番
      stateManager.placeStone(8, 7, "X");
      expect(stateManager.countStones("X")).toBe(2);
      expect(stateManager.countStones("O")).toBe(1);

      // 白の手番
      stateManager.placeStone(6, 7, "O");
      expect(stateManager.countStones("X")).toBe(2);
      expect(stateManager.countStones("O")).toBe(2);

      // 合計4つの石が配置されている
      expect(stateManager.countStones()).toBe(4);
      expect(stateManager.isBoardFull()).toBe(false);
    });
  });
});
