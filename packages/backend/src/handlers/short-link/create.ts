import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ShortLinkController } from "@/controllers/ShortLinkLink_Controller";
import { $newShortLink } from "@shortener/shared/types/link";
import { apiSuccess, apiError } from "@shortener/shared/response/response";

const shortLinkController = new ShortLinkController();

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || "{}");
    const newShortLink = $newShortLink.parse(body);
    const result = await shortLinkController.create(newShortLink);
    return apiSuccess(result, 201);
  } catch (error) {
    return apiError(error);
  }
}
