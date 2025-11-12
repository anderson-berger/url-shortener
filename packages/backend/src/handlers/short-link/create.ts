import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ShortLinkLinkController } from "@/controllers/ShortLinkLinkController";

import { $newShortLink } from "@shortener/shared/types/link";
import { apiSuccess, apiError } from "@shortener/shared/response/response";

const shortLinkLinkController = new ShortLinkLinkController();

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const newShortLink = $newShortLink.parse(JSON.parse(event.body || ""));
    const result = await shortLinkLinkController.create(newShortLink);
    return apiSuccess(result, 201);
  } catch (error) {
    return apiError(error);
  }
}
