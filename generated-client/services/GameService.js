import { OpenAPI } from "../core/OpenAPI.js";
import { request as __request } from "../core/request.js";
export class GameService {
  static getNextMove(requestBody) {
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
//# sourceMappingURL=GameService.js.map
