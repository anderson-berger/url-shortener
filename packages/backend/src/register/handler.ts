// src/modules/auth/handlers/register.handler.ts
import { $register } from "@/register/Register.Schemas";
import { apiError, apiSuccess } from "@/utils/response/response";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthService } from "@/register/Register.Service";

const authService = new AuthService();

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const input = $register.parse(JSON.parse(event.body || ""));
    const result = await authService.register(input);
    return apiSuccess(result, 201);
  } catch (error) {
    return apiError(error);
  }
}
