import { vi, describe, test, expect, beforeEach } from "vitest";
import { GameLoop } from "../game/game-loop";
import { ApiClientWrapper } from "../api/api-client-wrapper";
import { ForbiddenMoveDetector } from "../game/forbidden-move-detector";
import { GameStatusDetector } from "../game/game-status-detector";

// モック
vi.mock("../api/api-client-wrapper");
vi.mock("../game/forbidden-move-detector");
vi.mock("../game/game-status-detector");

describe("GameLoop", () => {
  let gameLoop: GameLoop;
  let mockApiClient: any;
  let mockDisplay: (message: string) => void;
  let displayMessages: string[];

  beforeEach(() => {
    vi.clearAllMocks();
    displayMessages = [];
    mockDisplay = vi.fn((message: string) => {
      displayMessages.push(message);
    });

    // ApiClientWrapperのモック設定
    mockApiClient = {
      getNextMove: vi.fn(),
    };
    vi.mocked(ApiClientWrapper).mockImplementation(() => mockApiClient);

    // GameStatusDetectorのモック設定（デフォルトは続行中）
    vi.mocked(GameStatusDetector).mockImplementation(
      () =>
        ({
          getGameStatus: vi.fn().mockReturnValue("ONGOING"),
          getWinningPositions: vi.fn().mockReturnValue([]),
        }) as any
    );

    // ForbiddenMoveDetectorのモック設定（デフォルトは禁じ手なし）
    vi.mocked(ForbiddenMoveDetector).mockImplementation(
      () =>
        ({
          isForbiddenMove: vi.fn().mockReturnValue(false),
        }) as any
    );

    gameLoop = new GameLoop(
      "http://black.example.com",
      "http://white.example.com"
    );
  });

  describe("正常なゲーム進行", () => {
    test("黒が5連で勝利", async () => {
      // APIレスポンスのモック
      mockApiClient.getNextMove
        .mockResolvedValueOnce({ row: 8, col: "H" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "G" }) // 白
        .mockResolvedValueOnce({ row: 8, col: "I" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "F" }) // 白
        .mockResolvedValueOnce({ row: 8, col: "J" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "E" }) // 白
        .mockResolvedValueOnce({ row: 8, col: "K" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "D" }) // 白
        .mockResolvedValueOnce({ row: 8, col: "L" }); // 黒（5連完成）

      // 5手目で黒が勝利
      let moveCount = 0;
      vi.mocked(GameStatusDetector).mockImplementation(
        () =>
          ({
            getGameStatus: vi.fn(() => {
              moveCount++;
              if (moveCount >= 9) {
                return "BLACK_WIN";
              }
              return "ONGOING";
            }),
            getWinningPositions: vi.fn().mockReturnValue([]),
          }) as any
      );

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("black");
      expect(result.reason).toBe("Five in a row");
      expect(displayMessages).toContain("Black wins!");
    });

    test("白が5連で勝利", async () => {
      // APIレスポンスのモック
      mockApiClient.getNextMove
        .mockResolvedValueOnce({ row: 8, col: "H" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "G" }) // 白
        .mockResolvedValueOnce({ row: 9, col: "H" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "H" }) // 白
        .mockResolvedValueOnce({ row: 10, col: "H" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "I" }) // 白
        .mockResolvedValueOnce({ row: 11, col: "H" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "J" }) // 白
        .mockResolvedValueOnce({ row: 12, col: "H" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "K" }); // 白（5連完成）

      // 10手目で白が勝利
      let moveCount = 0;
      vi.mocked(GameStatusDetector).mockImplementation(
        () =>
          ({
            getGameStatus: vi.fn(() => {
              moveCount++;
              if (moveCount >= 10) {
                return "WHITE_WIN";
              }
              return "ONGOING";
            }),
            getWinningPositions: vi.fn().mockReturnValue([]),
          }) as any
      );

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("white");
      expect(result.reason).toBe("Five in a row");
      expect(displayMessages).toContain("White wins!");
    });

    test("引き分け", async () => {
      // 盤面が満杯になるまでAPIレスポンスを返す（各手で異なる位置）
      let moveIndex = 0;
      const moves: Array<{ row: number; col: string }> = [];

      // 15x15の全マスの座標を生成
      for (let row = 1; row <= 15; row++) {
        for (let col = 0; col < 15; col++) {
          const colLetter = String.fromCharCode("A".charCodeAt(0) + col);
          moves.push({ row, col: colLetter });
        }
      }

      mockApiClient.getNextMove.mockImplementation(() => {
        if (moveIndex < moves.length) {
          return Promise.resolve(moves[moveIndex++]);
        }
        return Promise.resolve({ row: 1, col: "A" });
      });

      // 最後の手で引き分け
      let moveCount = 0;
      vi.mocked(GameStatusDetector).mockImplementation(
        () =>
          ({
            getGameStatus: vi.fn(() => {
              moveCount++;
              if (moveCount >= 225) {
                // 15x15 = 225
                return "DRAW";
              }
              return "ONGOING";
            }),
            getWinningPositions: vi.fn().mockReturnValue([]),
          }) as any
      );

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("draw");
      expect(result.reason).toBe("Board is full");
      expect(displayMessages).toContain("Draw!");
    });
  });

  describe("APIエラーによる失格", () => {
    test("黒のAPIタイムアウト", async () => {
      mockApiClient.getNextMove.mockRejectedValue(
        new Error("Timeout after 5000ms")
      );

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("white");
      expect(result.reason).toContain("Black disqualified");
      expect(result.reason).toContain("Timeout");
      expect(displayMessages).toContain("White wins!");
    });

    test("白のAPIタイムアウト", async () => {
      mockApiClient.getNextMove
        .mockResolvedValueOnce({ row: 8, col: "H" }) // 黒
        .mockRejectedValue(new Error("Timeout after 5000ms")); // 白がタイムアウト

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("black");
      expect(result.reason).toContain("White disqualified");
      expect(result.reason).toContain("Timeout");
      expect(displayMessages).toContain("Black wins!");
    });

    test("ネットワークエラー", async () => {
      mockApiClient.getNextMove.mockRejectedValue(new Error("Network error"));

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("white");
      expect(result.reason).toContain("Black disqualified");
      expect(result.reason).toContain("Network error");
    });

    test("不正なレスポンス", async () => {
      mockApiClient.getNextMove.mockRejectedValue(
        new Error('Invalid response: missing "row" field')
      );

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("white");
      expect(result.reason).toContain("Black disqualified");
      expect(result.reason).toContain("Invalid response");
    });
  });

  describe("不正な座標による失格", () => {
    test("範囲外の行番号", async () => {
      mockApiClient.getNextMove.mockResolvedValue({ row: 16, col: "H" });

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("white");
      expect(result.reason).toContain("Black disqualified");
      expect(result.reason).toContain("Invalid coordinates");
    });

    test("範囲外の列記号", async () => {
      mockApiClient.getNextMove.mockResolvedValue({ row: 8, col: "P" });

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("white");
      expect(result.reason).toContain("Black disqualified");
      expect(result.reason).toContain("Invalid coordinates");
    });

    test("既に石がある位置に配置", async () => {
      mockApiClient.getNextMove
        .mockResolvedValueOnce({ row: 8, col: "H" }) // 黒
        .mockResolvedValueOnce({ row: 8, col: "H" }); // 白が同じ位置

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("black");
      expect(result.reason).toContain("White disqualified");
      expect(result.reason).toContain("Cell already occupied");
    });
  });

  describe("禁じ手による失格", () => {
    test("黒が三三の禁じ手", async () => {
      mockApiClient.getNextMove.mockResolvedValue({ row: 8, col: "H" });

      // 禁じ手を検出
      vi.mocked(ForbiddenMoveDetector).mockImplementation(
        () =>
          ({
            isForbiddenMove: vi.fn().mockReturnValue(true),
          }) as any
      );

      const result = await gameLoop.run(mockDisplay);

      expect(result.winner).toBe("white");
      expect(result.reason).toContain("Black disqualified");
      expect(result.reason).toContain("Forbidden move");
      expect(displayMessages).toContain("White wins!");
    });

    test("白は禁じ手チェックされない", async () => {
      mockApiClient.getNextMove
        .mockResolvedValueOnce({ row: 8, col: "H" }) // 黒
        .mockResolvedValueOnce({ row: 7, col: "G" }); // 白

      // 黒の手番では禁じ手なし、白の手番でも禁じ手判定がtrueになるようモック
      let callCount = 0;
      vi.mocked(ForbiddenMoveDetector).mockImplementation(
        () =>
          ({
            isForbiddenMove: vi.fn(() => {
              callCount++;
              // 最初の呼び出し（黒の手）ではfalse、それ以降はtrue
              return callCount > 1;
            }),
          }) as any
      );

      // 2手目で白が勝利するよう設定
      let moveCount = 0;
      vi.mocked(GameStatusDetector).mockImplementation(
        () =>
          ({
            getGameStatus: vi.fn(() => {
              moveCount++;
              if (moveCount >= 2) {
                return "WHITE_WIN";
              }
              return "ONGOING";
            }),
            getWinningPositions: vi.fn().mockReturnValue([]),
          }) as any
      );

      const result = await gameLoop.run(mockDisplay);

      // 白は禁じ手チェックされないので、白が勝利
      expect(result.winner).toBe("white");
      expect(result.reason).toBe("Five in a row");
    });
  });

  describe("ゲーム状態の管理", () => {
    test("getCurrentPlayerが正しく動作する", () => {
      expect(gameLoop.getCurrentPlayer()).toBe("black");
    });

    test("getBoardが盤面を返す", () => {
      const board = gameLoop.getBoard();
      expect(board).toHaveLength(15);
      expect(board[0]).toHaveLength(15);
      expect(board.every((row) => row.every((cell) => cell === "."))).toBe(
        true
      );
    });

    test("resetでゲームがリセットされる", async () => {
      // 一手打つ
      mockApiClient.getNextMove.mockResolvedValueOnce({ row: 8, col: "H" });

      // 一手で黒が勝利
      vi.mocked(GameStatusDetector).mockImplementationOnce(
        () =>
          ({
            getGameStatus: vi.fn().mockReturnValue("BLACK_WIN"),
            getWinningPositions: vi.fn().mockReturnValue([]),
          }) as any
      );

      await gameLoop.run(mockDisplay);

      // リセット
      gameLoop.reset();

      expect(gameLoop.getCurrentPlayer()).toBe("black");
      const board = gameLoop.getBoard();
      expect(board.every((row) => row.every((cell) => cell === "."))).toBe(
        true
      );
    });
  });

  describe("表示機能", () => {
    test("各手が正しく表示される", async () => {
      mockApiClient.getNextMove
        .mockResolvedValueOnce({ row: 8, col: "H" })
        .mockResolvedValueOnce({ row: 7, col: "G" });

      // 2手目で白が勝利
      let moveCount = 0;
      vi.mocked(GameStatusDetector).mockImplementation(
        () =>
          ({
            getGameStatus: vi.fn(() => {
              moveCount++;
              if (moveCount >= 2) {
                return "WHITE_WIN";
              }
              return "ONGOING";
            }),
            getWinningPositions: vi.fn().mockReturnValue([]),
          }) as any
      );

      await gameLoop.run(mockDisplay);

      expect(displayMessages).toContain("Black plays: H8");
      expect(displayMessages).toContain("White plays: G7");
      expect(displayMessages).toContain("Current player: Black (X)");
      expect(displayMessages).toContain("Current player: White (O)");
    });

    test("表示コールバックが省略された場合はconsole.logが使われる", async () => {
      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      mockApiClient.getNextMove.mockResolvedValueOnce({ row: 8, col: "H" });

      // 一手で黒が勝利
      vi.mocked(GameStatusDetector).mockImplementationOnce(
        () =>
          ({
            getGameStatus: vi.fn().mockReturnValue("BLACK_WIN"),
            getWinningPositions: vi.fn().mockReturnValue([]),
          }) as any
      );

      await gameLoop.run(); // displayCallback省略

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });
  });
});
