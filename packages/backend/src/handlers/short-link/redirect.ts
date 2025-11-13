import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { apiRedirect, apiError } from "@shortener/shared/response/response";
import { ShortLinkController } from "@/controllers/ShortLinkLink_Controller";

const shortLinkController = new ShortLinkController();

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const shortCode = event.pathParameters?.shortCode;

    if (!shortCode) {
      return apiError(new Error("shortCode is required"));
    }
    const originalUrl = await shortLinkController.redirect(shortCode);

    return apiRedirect(originalUrl);
  } catch (error) {
    return apiError(error);
  }
}
