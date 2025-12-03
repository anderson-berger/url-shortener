import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { $login } from "@/login/Login.Schemas";
import { LoginService } from "@/login/Login.Service";
import { apiError, apiSuccess } from "@/utils/response/response";

const loginService = new LoginService();

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const input = $login.parse(JSON.parse(event.body || ""));
    const result = await loginService.login(input);
    return apiSuccess(result, 200);
  } catch (error) {
    return apiError(error);
  }
}
