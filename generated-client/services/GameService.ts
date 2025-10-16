/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NextMoveRequest } from "../models/NextMoveRequest";
import type { NextMoveResponse } from "../models/NextMoveResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class GameService {
  /**
   * Calculate next move
   * Receives the current board state and the next player's color,
   * then returns the optimal next move position.
   *
   * @param requestBody
   * @returns NextMoveResponse Successfully calculated next move
   * @throws ApiError
   */
  public static getNextMove(
    requestBody: NextMoveRequest
  ): CancelablePromise<NextMoveResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/next-move",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Invalid request (invalid board state, invalid color, etc.)`,
        500: `Internal server error`,
      },
    });
  }
}
