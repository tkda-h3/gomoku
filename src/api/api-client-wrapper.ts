import { Cell } from "../game/board.js";
import {
  GameService,
  NextMoveRequest,
  NextMoveResponse,
  OpenAPI,
} from "../../generated-client/index.js";

/**
 * APIクライアントラッパークラス
 * OpenAPI生成クライアントをラップし、タイムアウトやエラーハンドリングを提供
 */
export class ApiClientWrapper {
  /**
   * 次の手をAPIから取得
   * @param board 現在の盤面
   * @param nextColor 次のプレイヤーの色
   * @param endpoint APIエンドポイント
   * @param timeoutMs タイムアウト時間（ミリ秒）
   * @returns 次の手の座標（row: 1-15, col: A-O）
   * @throws Error タイムアウト、ネットワークエラー、レスポンス検証エラーの場合
   */
  async getNextMove(
    board: Cell[][],
    nextColor: "black" | "white",
    endpoint: string,
    timeoutMs: number
  ): Promise<{ row: number; col: string }> {
    // OpenAPI設定を動的に変更
    OpenAPI.BASE = endpoint;

    // APIリクエストの準備
    const request: NextMoveRequest = {
      board,
      nextColor:
        nextColor === "black"
          ? NextMoveRequest.nextColor.BLACK
          : NextMoveRequest.nextColor.WHITE,
    };

    try {
      // タイムアウト付きでAPIリクエスト
      const response = await this.withTimeout(
        GameService.getNextMove(request),
        timeoutMs
      );

      // レスポンス検証
      this.validateResponse(response);

      return response;
    } catch (error) {
      // エラーを再スロー（GameLoopで処理）
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error));
    }
  }

  /**
   * タイムアウト付きでPromiseを実行
   * @param promise 実行するPromise
   * @param timeoutMs タイムアウト時間（ミリ秒）
   * @returns Promiseの結果
   * @throws Error タイムアウトの場合
   */
  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout after ${timeoutMs}ms`)),
          timeoutMs
        )
      ),
    ]);
  }

  /**
   * レスポンスの検証
   * @param response APIレスポンス
   * @throws Error レスポンスが不正な場合
   */
  private validateResponse(response: any): void {
    // 必須フィールドチェック
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response: not an object");
    }

    if (!("row" in response)) {
      throw new Error('Invalid response: missing "row" field');
    }

    if (!("col" in response)) {
      throw new Error('Invalid response: missing "col" field');
    }

    // データ型チェック
    if (typeof response.row !== "number") {
      throw new Error(
        `Invalid response: "row" must be a number, got ${typeof response.row}`
      );
    }

    if (typeof response.col !== "string") {
      throw new Error(
        `Invalid response: "col" must be a string, got ${typeof response.col}`
      );
    }

    // 値の範囲チェック（簡易版、詳細はCoordinateConverterで実施）
    if (response.row < 1 || response.row > 15) {
      throw new Error(
        `Invalid response: "row" must be 1-15, got ${response.row}`
      );
    }

    if (!/^[A-O]$/.test(response.col)) {
      throw new Error(
        `Invalid response: "col" must be A-O, got ${response.col}`
      );
    }
  }
}
