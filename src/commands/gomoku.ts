import { Command } from "commander";

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
    .action((options: { blackEndpoint: string; whiteEndpoint: string }) => {
      console.log(`Black endpoint: ${options.blackEndpoint}`);
      console.log(`White endpoint: ${options.whiteEndpoint}`);
    });

  return gomoku;
}
