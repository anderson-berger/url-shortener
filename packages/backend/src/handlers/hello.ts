import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Handler de teste para validar deploy e configuração
 * GET /hello → { message: "Hello World" }
 */
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello World",
      timestamp: new Date().toISOString(),
      stage: process.env.STAGE || "local",
    }),
  };
}
