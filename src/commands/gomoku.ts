import { Command } from "commander";
import { GameLoop } from "../game/game-loop.js";

export function createGomokuCommand(): Command {
  const gomoku = new Command("play");

  gomoku
    .description("Play gomoku game with black and white API endpoints")
    .requiredOption(
      "--black-endpoint <url>",
      "API endpoint URL for the black player"
    )
    .requiredOption(
      "--white-endpoint <url>",
      "API endpoint URL for the white player"
    )
    .action(
      async (options: { blackEndpoint: string; whiteEndpoint: string }) => {
        console.log("=== Gomoku Game Starting ===");
        console.log(`Black endpoint: ${options.blackEndpoint}`);
        console.log(`White endpoint: ${options.whiteEndpoint}`);
        console.log("===========================\n");

        try {
          // GameLoopのインスタンスを作成
          const gameLoop = new GameLoop(
            options.blackEndpoint,
            options.whiteEndpoint
          );

          // ゲームを実行
          const result = await gameLoop.run();

          // 結果を表示
          console.log("\n=== Game Result ===");
          if (result.winner === "draw") {
            console.log("Game ended in a draw!");
          } else {
            const winner = result.winner === "black" ? "Black" : "White";
            console.log(`${winner} wins!`);
          }
          console.log(`Reason: ${result.reason}`);
          console.log("==================\n");

          // 正常終了
          process.exit(0);
        } catch (error) {
          // エラーハンドリング
          console.error("\n=== Error ===");
          console.error("An unexpected error occurred:");
          console.error(error instanceof Error ? error.message : String(error));
          console.error("=============\n");

          // エラー終了
          process.exit(1);
        }
      }
    );

  return gomoku;
}
