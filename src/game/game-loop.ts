import { Cell } from "./board";
import { Board } from "./board";
import { BoardVisualizer } from "./board-visualizer";
import { StateManager } from "./state-manager";
import { CoordinateConverter } from "./coordinate-converter";
import { ForbiddenMoveDetector } from "./forbidden-move-detector";
import { GameStatusDetector } from "./game-status-detector";
import { ApiClientWrapper } from "../api/api-client-wrapper";

/**
 * ゲームループクラス
 * ゲームの進行を管理し、APIとの通信、盤面の更新、勝敗判定を行う
 */
export class GameLoop {
  private stateManager: StateManager;
  private currentPlayer: "black" | "white";
  private blackEndpoint: string;
  private whiteEndpoint: string;
  private apiClient: ApiClientWrapper;
  private readonly TIMEOUT_MS = 5000; // 5秒

  constructor(blackEndpoint: string, whiteEndpoint: string) {
    this.stateManager = new StateManager();
    this.currentPlayer = "black"; // 黒先攻
    this.blackEndpoint = blackEndpoint;
    this.whiteEndpoint = whiteEndpoint;
    this.apiClient = new ApiClientWrapper();
  }

  /**
   * ゲームループを実行する
   * @param displayCallback 盤面表示用のコールバック（省略可能）
   * @returns 終了理由
   */
  async run(
    displayCallback?: (message: string) => void
  ): Promise<{ winner: "black" | "white" | "draw"; reason: string }> {
    const display = displayCallback || console.log;

    while (true) {
      // 現在の盤面を表示
      const board = Board.create(this.stateManager.getBoard());
      const visualizer = new BoardVisualizer(board);
      display(visualizer.visualize());
      display(
        `Current player: ${this.currentPlayer === "black" ? "Black (X)" : "White (O)"}`
      );

      // 次の手を取得
      const endpoint =
        this.currentPlayer === "black"
          ? this.blackEndpoint
          : this.whiteEndpoint;

      let move: { row: number; col: string };
      try {
        move = await this.apiClient.getNextMove(
          this.stateManager.getBoard(),
          this.currentPlayer,
          endpoint,
          this.TIMEOUT_MS
        );
        display(
          `${this.currentPlayer === "black" ? "Black" : "White"} plays: ${move.col}${move.row}`
        );
      } catch (error) {
        // タイムアウト、ネットワークエラー、不正レスポンスなど
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return this.handleDisqualification(
          this.currentPlayer,
          `API error: ${errorMessage}`,
          display
        );
      }

      // 座標変換とバリデーション
      let row: number, col: number;
      try {
        const coords = CoordinateConverter.apiToInternal(move.row, move.col);
        row = coords.row;
        col = coords.col;
      } catch (error) {
        // 座標範囲外エラー
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return this.handleDisqualification(
          this.currentPlayer,
          `Invalid coordinates: ${errorMessage}`,
          display
        );
      }

      // 配置可能性チェック
      if (!this.stateManager.isValidPosition(row, col)) {
        return this.handleDisqualification(
          this.currentPlayer,
          `Invalid position: (${row}, ${col})`,
          display
        );
      }

      if (!this.stateManager.isCellEmpty(row, col)) {
        return this.handleDisqualification(
          this.currentPlayer,
          `Cell already occupied: (${row}, ${col})`,
          display
        );
      }

      // 黒の場合、禁じ手チェック
      if (this.currentPlayer === "black") {
        const tempBoard = this.stateManager.getBoard();
        const boardForCheck = Board.create(tempBoard);
        const detector = new ForbiddenMoveDetector(boardForCheck);
        if (detector.isForbiddenMove(row, col, "X")) {
          return this.handleDisqualification(
            this.currentPlayer,
            "Forbidden move (三三/四四/長連)",
            display
          );
        }
      }

      // 石を置く
      const stone: Cell = this.currentPlayer === "black" ? "X" : "O";
      this.stateManager.placeStone(row, col, stone);

      // 勝敗判定
      const updatedBoard = Board.create(this.stateManager.getBoard());
      const statusDetector = new GameStatusDetector(updatedBoard);
      const status = statusDetector.getGameStatus();

      // 更新後の盤面を表示
      const updatedVisualizer = new BoardVisualizer(updatedBoard);
      display(updatedVisualizer.visualize());

      if (status === "BLACK_WIN") {
        display("Black wins!");
        return { winner: "black", reason: "Five in a row" };
      } else if (status === "WHITE_WIN") {
        display("White wins!");
        return { winner: "white", reason: "Five in a row" };
      } else if (status === "DRAW") {
        display("Draw!");
        return { winner: "draw", reason: "Board is full" };
      }

      // プレイヤー交代
      this.currentPlayer = this.currentPlayer === "black" ? "white" : "black";
    }
  }

  /**
   * 失格処理
   * @param player 失格となったプレイヤー
   * @param reason 失格理由
   * @param display 表示用関数
   * @returns ゲーム結果
   */
  private handleDisqualification(
    player: "black" | "white",
    reason: string,
    display: (message: string) => void
  ): { winner: "black" | "white" | "draw"; reason: string } {
    const opponent = player === "black" ? "white" : "black";
    const playerName = player === "black" ? "Black" : "White";
    const opponentName = opponent === "black" ? "Black" : "White";

    // 最終盤面を表示
    const board = Board.create(this.stateManager.getBoard());
    const visualizer = new BoardVisualizer(board);
    display(visualizer.visualize());
    display(`${playerName} disqualified: ${reason}`);
    display(`${opponentName} wins!`);

    return {
      winner: opponent,
      reason: `${playerName} disqualified: ${reason}`,
    };
  }

  /**
   * 現在のプレイヤーを取得する
   * @returns 現在のプレイヤー
   */
  getCurrentPlayer(): "black" | "white" {
    return this.currentPlayer;
  }

  /**
   * 現在の盤面を取得する
   * @returns 現在の盤面
   */
  getBoard(): Cell[][] {
    return this.stateManager.getBoard();
  }

  /**
   * ゲームをリセットする
   */
  reset(): void {
    this.stateManager.reset();
    this.currentPlayer = "black";
  }
}
