import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { apiError, apiRedirect, apiSuccess } from "@/utils/response/response";
import { ShortLinkService } from "@/short-link/ShortLink.Service";
import { BadRequestError } from "@/utils/error/errors";

const shortLinkService = new ShortLinkService();

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> {
  try {
    const method = event.requestContext.http.method;

    switch (method) {
      case "GET":
        return await get(event);

      default:
        throw new BadRequestError("HTTP method not supported");
    }
  } catch (error) {
    return apiError(error);
  }
}

async function get(event: APIGatewayProxyEventV2) {
  try {
    const shortCode = event.pathParameters?.shortCode;

    if (!shortCode) {
      throw new BadRequestError("Short code not provided");
    }
    const result = await shortLinkService.redirect(shortCode);

    return apiRedirect(result);
  } catch (error) {
    return apiError(error);
  }
}
