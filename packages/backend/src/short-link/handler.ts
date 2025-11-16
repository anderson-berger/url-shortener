import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { $newShortLink } from "@/short-link/ShortLink.Schemas";
import { apiSuccess, apiError, apiRedirect } from "@/utils/response/response";
import { ShortLinkService } from "@/short-link/ShortLink.Service";
import { BadRequestError } from "@/utils/error/errors";

const shortLinkService = new ShortLinkService();

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> {
  try {
    const method = event.requestContext.http.method;

    switch (method) {
      case "POST":
        return await create(event);

      case "GET":
        return await get(event);

      default:
        throw new BadRequestError("Método HTTP não suportado");
    }
  } catch (error) {
    return apiError(error);
  }
}

async function create(event: APIGatewayProxyEventV2) {
  const body = JSON.parse(event.body || "{}");
  const newShortLink = $newShortLink.parse(body);
  const shortLink = await shortLinkService.create(newShortLink);
  return apiSuccess(shortLink, 201);
}

async function get(event: APIGatewayProxyEventV2) {
  const shortCode = event.pathParameters?.shortCode;

  if (!shortCode) {
    return apiError(new Error("shortCode is required"));
  }
  const originalUrl = await shortLinkService.redirect(shortCode);

  return apiRedirect(originalUrl);
}
