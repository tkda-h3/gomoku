import { vi, describe, test, expect, beforeEach } from "vitest";
import { ApiClientWrapper } from "../api/api-client-wrapper";
import { GameService, OpenAPI, NextMoveRequest } from "../../generated-client";
import { Cell } from "../game/board";

// GameServiceのモック
vi.mock("../../generated-client", () => ({
  GameService: {
    getNextMove: vi.fn(),
  },
  OpenAPI: {
    BASE: "http://localhost:3000",
  },
  NextMoveRequest: {
    nextColor: {
      BLACK: "black",
      WHITE: "white",
    },
  },
}));

describe("ApiClientWrapper", () => {
  let wrapper: ApiClientWrapper;
  const mockBoard: Cell[][] = Array(15)
    .fill(null)
    .map(() => Array(15).fill(".") as Cell[]);

  beforeEach(() => {
    wrapper = new ApiClientWrapper();
    vi.clearAllMocks();
  });

  describe("getNextMove", () => {
    describe("正常系", () => {
      test("黒の手番で正常なレスポンスを受け取る", async () => {
        const mockResponse = { row: 8, col: "H" };
        vi.mocked(GameService.getNextMove).mockResolvedValue(mockResponse as any);

        const result = await wrapper.getNextMove(
          mockBoard,
          "black",
          "http://test.example.com",
          5000
        );

        expect(result).toEqual(mockResponse);
        expect(OpenAPI.BASE).toBe("http://test.example.com");
        expect(GameService.getNextMove).toHaveBeenCalledWith({
          board: mockBoard,
          nextColor: NextMoveRequest.nextColor.BLACK,
        });
      });

      test("白の手番で正常なレスポンスを受け取る", async () => {
        const mockResponse = { row: 1, col: "A" };
        vi.mocked(GameService.getNextMove).mockResolvedValue(mockResponse as any);

        const result = await wrapper.getNextMove(
          mockBoard,
          "white",
          "http://test.example.com",
          5000
        );

        expect(result).toEqual(mockResponse);
        expect(GameService.getNextMove).toHaveBeenCalledWith({
          board: mockBoard,
          nextColor: NextMoveRequest.nextColor.WHITE,
        });
      });

      test("盤面の四隅の座標を正常に処理する", async () => {
        const testCases = [
          { row: 1, col: "A" },    // 左上
          { row: 1, col: "O" },    // 右上
          { row: 15, col: "A" },   // 左下
          { row: 15, col: "O" },   // 右下
        ];

        for (const testCase of testCases) {
          vi.mocked(GameService.getNextMove).mockResolvedValue(testCase as any);

          const result = await wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          );

          expect(result).toEqual(testCase);
        }
      });

      test("エンドポイントURLが正しく設定される", async () => {
        const mockResponse = { row: 8, col: "H" };
        vi.mocked(GameService.getNextMove).mockResolvedValue(mockResponse as any);

        const endpoints = [
          "http://localhost:3000",
          "https://api.example.com",
          "http://192.168.1.1:8080",
        ];

        for (const endpoint of endpoints) {
          await wrapper.getNextMove(mockBoard, "black", endpoint, 5000);
          expect(OpenAPI.BASE).toBe(endpoint);
        }
      });
    });

    describe("タイムアウト処理", () => {
      test("指定時間でタイムアウトする", async () => {
        const mockPromise = new Promise((resolve) => {
          setTimeout(() => resolve({ row: 8, col: "H" }), 1000);
        });
        vi.mocked(GameService.getNextMove).mockReturnValue(mockPromise as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            100
          )
        ).rejects.toThrow("Timeout after 100ms");
      });

      test("タイムアウト前に応答があれば正常に処理される", async () => {
        const mockResponse = { row: 8, col: "H" };
        const mockPromise = new Promise((resolve) => {
          setTimeout(() => resolve(mockResponse), 100);
        });
        vi.mocked(GameService.getNextMove).mockReturnValue(mockPromise as any);

        const result = await wrapper.getNextMove(
          mockBoard,
          "black",
          "http://test.example.com",
          1000
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe("レスポンス検証", () => {
      test("レスポンスがnullの場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue(null as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow("Invalid response: not an object");
      });

      test("レスポンスがundefinedの場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue(undefined as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow("Invalid response: not an object");
      });

      test("rowフィールドが欠損している場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({ col: "H" } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow('Invalid response: missing "row" field');
      });

      test("colフィールドが欠損している場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({ row: 8 } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow('Invalid response: missing "col" field');
      });

      test("rowが数値でない場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({
          row: "8",
          col: "H",
        } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow(
          'Invalid response: "row" must be a number, got string'
        );
      });

      test("colが文字列でない場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({
          row: 8,
          col: 8,
        } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow(
          'Invalid response: "col" must be a string, got number'
        );
      });

      test("rowが範囲外（0以下）の場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({
          row: 0,
          col: "H",
        } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow('Invalid response: "row" must be 1-15, got 0');
      });

      test("rowが範囲外（16以上）の場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({
          row: 16,
          col: "H",
        } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow('Invalid response: "row" must be 1-15, got 16');
      });

      test("colが範囲外（A未満）の場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({
          row: 8,
          col: "@",
        } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow('Invalid response: "col" must be A-O, got @');
      });

      test("colが範囲外（O超過）の場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({
          row: 8,
          col: "P",
        } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow('Invalid response: "col" must be A-O, got P');
      });

      test("colが小文字の場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({
          row: 8,
          col: "h",
        } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow('Invalid response: "col" must be A-O, got h');
      });

      test("colが複数文字の場合エラー", async () => {
        vi.mocked(GameService.getNextMove).mockResolvedValue({
          row: 8,
          col: "HH",
        } as any);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow('Invalid response: "col" must be A-O, got HH');
      });
    });

    describe("エラーハンドリング", () => {
      test("ネットワークエラーが再スローされる", async () => {
        const networkError = new Error("Network error");
        vi.mocked(GameService.getNextMove).mockRejectedValue(networkError);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow("Network error");
      });

      test("API 400エラーが再スローされる", async () => {
        const apiError = new Error("Bad Request");
        vi.mocked(GameService.getNextMove).mockRejectedValue(apiError);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow("Bad Request");
      });

      test("API 500エラーが再スローされる", async () => {
        const apiError = new Error("Internal Server Error");
        vi.mocked(GameService.getNextMove).mockRejectedValue(apiError);

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow("Internal Server Error");
      });

      test("Errorオブジェクト以外のエラーも処理される", async () => {
        vi.mocked(GameService.getNextMove).mockRejectedValue(
          "String error"
        );

        await expect(
          wrapper.getNextMove(
            mockBoard,
            "black",
            "http://test.example.com",
            5000
          )
        ).rejects.toThrow("String error");
      });
    });

    describe("統合的なシナリオ", () => {
      test("実際のゲーム進行を想定した連続リクエスト", async () => {
        const moves = [
          { row: 8, col: "H" },
          { row: 7, col: "G" },
          { row: 9, col: "I" },
          { row: 6, col: "F" },
        ];

        for (let i = 0; i < moves.length; i++) {
          vi.mocked(GameService.getNextMove).mockResolvedValue(moves[i] as any);

          const result = await wrapper.getNextMove(
            mockBoard,
            i % 2 === 0 ? "black" : "white",
            "http://test.example.com",
            5000
          );

          expect(result).toEqual(moves[i]);
        }

        expect(GameService.getNextMove).toHaveBeenCalledTimes(4);
      });
    });
  });
});