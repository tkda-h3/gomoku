/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NextMoveRequest = {
  /**
   * 15x15 board state, where each cell can be "." (empty), "X" (black), or "O" (white)
   */
  board: Array<Array<"." | "X" | "O">>;
  /**
   * The color of the next player to move
   */
  nextColor: NextMoveRequest.nextColor;
};
export namespace NextMoveRequest {
  /**
   * The color of the next player to move
   */
  export enum nextColor {
    BLACK = "black",
    WHITE = "white",
  }
}
