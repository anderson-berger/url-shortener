import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import {
  $newShortLink,
  $pagination,
  $shortLink,
} from "@/short-link/ShortLink.Schemas";
import { apiSuccess, apiError, apiRedirect } from "@/utils/response/response";
import { ShortLinkService } from "@/short-link/ShortLink.Service";
import { BadRequestError } from "@/utils/error/errors";

const shortLinkService = new ShortLinkService();

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> {
  try {
    const method = event.requestContext.http.method;
    console.log(method);
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

async function create(event: APIGatewayProxyEventV2) {
  try {
    const body = JSON.parse(event.body || "{}");
    const newShortLink = $newShortLink.parse(body);
    const shortLink = await shortLinkService.create(newShortLink);
    return apiSuccess(shortLink, 201);
  } catch (error) {
    return apiError(error);
  }
}

async function update(event: APIGatewayProxyEventV2) {
  try {
    const body = JSON.parse(event.body || "{}");
    const shortLink = $shortLink.parse(body);

    const result = await shortLinkService.update(shortLink);
    return apiSuccess(result, 201);
  } catch (error) {
    return apiError(error);
  }
}

async function get(event: APIGatewayProxyEventV2) {
  try {
    const id = event.pathParameters?.id;
    // Se tem ID, busca um link específico
    if (id) {
      const shortLink = await shortLinkService.getById(id);
      return apiSuccess(shortLink);
    }

    const pagination = $pagination.parse(event.queryStringParameters || {});
    const result = await shortLinkService.list(pagination);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

async function remove(event: APIGatewayProxyEventV2) {
  try {
    const body = JSON.parse(event.body || "{}");
    const shortLink = $shortLink.parse(body);
    await shortLinkService.delete(shortLink);
    return apiSuccess({ message: "Link deleted successfully" }, 200);
  } catch (error) {
    return apiError(error);
  }
}
