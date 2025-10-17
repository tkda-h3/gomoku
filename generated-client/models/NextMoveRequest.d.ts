export type NextMoveRequest = {
  board: Array<Array<"." | "X" | "O">>;
  nextColor: NextMoveRequest.nextColor;
};
export declare namespace NextMoveRequest {
  enum nextColor {
    BLACK = "black",
    WHITE = "white",
  }
}
//# sourceMappingURL=NextMoveRequest.d.ts.map
