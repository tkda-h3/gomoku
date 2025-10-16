/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NextMoveResponse = {
  /**
   * Row index (1-15) of the next move
   */
  row: number;
  /**
   * Column letter (A-O) of the next move
   */
  col: NextMoveResponse.col;
};
export namespace NextMoveResponse {
  /**
   * Column letter (A-O) of the next move
   */
  export enum col {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    F = "F",
    G = "G",
    H = "H",
    I = "I",
    J = "J",
    K = "K",
    L = "L",
    M = "M",
    N = "N",
    O = "O",
  }
}
