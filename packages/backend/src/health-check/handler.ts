import { apiSuccess } from "@/utils/response/response";
import type { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async () => {
  console.log("ao menos bateu aqui?");
  return apiSuccess({
    status: "healthy",
    service: "url-shortener",
    version: process.env.VERSION || "1.0.0",
    timestamp: new Date().toISOString(),
  });
};
