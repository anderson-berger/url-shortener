// src/types/api-gateway.types.ts
import { APIGatewayProxyEventV2 } from "aws-lambda";

export interface AuthorizedAPIGatewayProxyEventV2
  extends APIGatewayProxyEventV2 {
  requestContext: APIGatewayProxyEventV2["requestContext"] & {
    authorizer?: {
      principalId?: string;
      lambda?: {
        userId: string;
        email?: string;
        [key: string]: any;
      };
    };
  };
}
