// src/short-link/ShortLink.Handler.ts
import { APIGatewayProxyResult } from "aws-lambda";
import {
  $newShortLink,
  $pagination,
  $shortLink,
} from "@/short-link/ShortLink.Schemas";
import { apiSuccess, apiError } from "@/utils/response/response";
import { ShortLinkService } from "@/short-link/ShortLink.Service";
import { BadRequestError, UnauthorizedError } from "@/utils/error/errors";
import { AuthorizedAPIGatewayProxyEventV2 } from "@/utils/schemas/api-gateway.schemas";

const shortLinkService = new ShortLinkService();

function getUserIdFromEvent(event: AuthorizedAPIGatewayProxyEventV2): string {
  const userId = event.requestContext.authorizer?.lambda?.userId;

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  return userId;
}

export async function handler(
  event: AuthorizedAPIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> {
  try {
    const method = event.requestContext.http.method;

    switch (method) {
      case "POST":
        return await create(event);
      case "PUT":
        return await update(event);
      case "GET":
        return await get(event);
      case "DELETE":
        return await remove(event);
      default:
        throw new BadRequestError("Método HTTP não suportado");
    }
  } catch (error) {
    return apiError(error);
  }
}

async function create(event: AuthorizedAPIGatewayProxyEventV2) {
  try {
    const userId = getUserIdFromEvent(event);
    const body = JSON.parse(event.body || "{}");
    const newShortLink = $newShortLink.parse(body);

    const shortLink = await shortLinkService.create(newShortLink, userId);
    return apiSuccess(shortLink, 201);
  } catch (error) {
    return apiError(error);
  }
}

async function update(event: AuthorizedAPIGatewayProxyEventV2) {
  try {
    const userId = getUserIdFromEvent(event);
    const body = JSON.parse(event.body || "{}");
    const shortLink = $shortLink.parse(body);

    const result = await shortLinkService.update(shortLink, userId);
    return apiSuccess(result, 201);
  } catch (error) {
    return apiError(error);
  }
}

async function get(event: AuthorizedAPIGatewayProxyEventV2) {
  try {
    const userId = getUserIdFromEvent(event);
    const id = event.pathParameters?.id;

    if (id) {
      const shortLink = await shortLinkService.getById(id, userId);
      return apiSuccess(shortLink);
    }

    const pagination = $pagination.parse(event.queryStringParameters || {});
    const result = await shortLinkService.list(pagination, userId);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

async function remove(event: AuthorizedAPIGatewayProxyEventV2) {
  try {
    const userId = getUserIdFromEvent(event);
    const body = JSON.parse(event.body || "{}");
    const shortLink = $shortLink.parse(body);

    await shortLinkService.delete(shortLink, userId);
    return apiSuccess({ message: "Link deleted successfully" }, 200);
  } catch (error) {
    return apiError(error);
  }
}
