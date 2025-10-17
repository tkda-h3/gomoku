import type { NextMoveRequest } from "../models/NextMoveRequest";
import type { NextMoveResponse } from "../models/NextMoveResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
export declare class GameService {
  static getNextMove(
    requestBody: NextMoveRequest
  ): CancelablePromise<NextMoveResponse>;
}
//# sourceMappingURL=GameService.d.ts.map
