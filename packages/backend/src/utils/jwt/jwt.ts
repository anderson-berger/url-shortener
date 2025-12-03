import { SignJWT, jwtVerify } from "jose";
import { TokenPayload } from "./Jwt.Schemas";
import { UnauthorizedError } from "@/utils/error/errors";
import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from "aws-lambda";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT({
    userId: payload.userId,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (error) {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}

export async function authorize(
  event: HttpApiAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> {
  try {
    // handles both Authorization and authorization header names
    const auth =
      event.headers?.Authorization ??
      event.headers?.authorization ??
      // em alguns cenários o serverless-offline coloca o token em identitySource
      (event.identitySource && event.identitySource[0]) ??
      undefined;

    if (!auth) {
      throw new UnauthorizedError("Missing authorization header");
    }

    const header = auth.startsWith("Bearer ") ? auth : auth.toString();
    if (!header.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid authorization format");
    }

    const token = header.slice(7).trim();
    if (!token) {
      throw new UnauthorizedError("Empty token");
    }

    const payload = await verifyToken(token);

    // escolha a resource de forma resiliente: prefira routeArn (presente no offline),
    // fallback para routeKey ou usar '*' (cuidado em produção)
    const resource = event.routeArn ?? event.routeKey ?? "*";
    console.log("resource", resource);
    return {
      principalId: String(payload.userId),
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: resource,
          },
        ],
      },
      context: {
        userId: payload.userId,
        email: payload.email,
      },
    };
  } catch (err) {
    // AWS API Gateway authorizer precisa que uma Error com mensagem "Unauthorized" seja lançada
    throw new Error("Unauthorized");
  }
}

interface HttpApiAuthorizerEvent extends APIGatewayRequestAuthorizerEvent {
  routeArn?: string;
  routeKey?: string;
  rawPath?: string;
  identitySource?: string[];
  requestContext: any;
}
