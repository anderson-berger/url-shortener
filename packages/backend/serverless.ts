import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "url-shortener",
  frameworkVersion: "4",

  plugins: ["serverless-offline"],

  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "sa-east-1",
    stage: "${opt:stage, 'local'}",

    environment: {
      STAGE: "${opt:stage, 'local'}",
      TABLE: "${self:service}-${opt:stage, 'local'}",
    },
    httpApi: {
      cors: {
        allowedOrigins: ["http://localhost:9000"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "X-Requested-With",
          "Accept",
          "Origin",
        ],
        allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowCredentials: true,
        maxAge: 300,
      },
      authorizers: {
        authLambda: {
          type: "request",
          functionName: "authorizer",
          identitySource: ["$request.header.Authorization"],
          enableSimpleResponses: false,
        },
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: [
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
              "dynamodb:Query",
            ],
            Resource: [
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-${opt:stage, 'local'}",
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-${opt:stage, 'local'}/index/*",
            ],
          },
        ],
      },
    },

    tags: {
      Project: "url-shortener",
      Environment: "${self:provider.stage}",
    },
  },

  functions: {
    authorizer: {
      handler: "src/utils/jwt/jwt.authorize",
      description: "JWT authorizer for HTTP API",
    },
    register: {
      handler: "src/register/handler.handler",
      description: "User registration endpoint",
      events: [
        {
          httpApi: {
            path: "/api/register",
            method: "post",
          },
        },
      ],
    },
    login: {
      handler: "src/login/handler.handler",
      description: "User login endpoint",
      events: [
        {
          httpApi: {
            path: "/api/login",
            method: "post",
          },
        },
      ],
    },

    "short-link": {
      handler: "src/short-link/handler.handler",
      events: [
        {
          httpApi: {
            path: "/api/links",
            method: "post",
            authorizer: { name: "authLambda" },
          },
        },
        {
          httpApi: {
            path: "/api/links",
            method: "get",
            authorizer: {
              name: "authLambda",
            },
          },
        },
        {
          httpApi: {
            path: "/api/links/{id}",
            method: "get",
            authorizer: { name: "authLambda" },
          },
        },
        {
          httpApi: {
            path: "/api/links",
            method: "put",
            authorizer: { name: "authLambda" },
          },
        },
        {
          httpApi: {
            path: "/api/links",
            method: "delete",
            authorizer: { name: "authLambda" },
          },
        },
      ],
    },
    redirect: {
      handler: "src/redirect/handler.handler",
      events: [
        {
          httpApi: {
            path: "/go/{shortCode}",
            method: "get",
          },
        },
      ],
    },
    "health-check": {
      handler: "src/health-check/handler.handler",
      events: [
        {
          httpApi: {
            path: "/api/health",
            method: "get",
            authorizer: { name: "authLambda" },
          },
        },
      ],
    },
  },

  resources: {
    Resources: {
      LinksTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.TABLE}",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            { AttributeName: "pk", AttributeType: "S" },
            { AttributeName: "sk", AttributeType: "S" },
            { AttributeName: "gsi1pk", AttributeType: "S" },
            { AttributeName: "gsi1sk", AttributeType: "S" },
            { AttributeName: "gsi2pk", AttributeType: "S" },
            { AttributeName: "gsi2sk", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "pk", KeyType: "HASH" },
            { AttributeName: "sk", KeyType: "RANGE" },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "GSI1",
              KeySchema: [
                { AttributeName: "gsi1pk", KeyType: "HASH" },
                { AttributeName: "gsi1sk", KeyType: "RANGE" },
              ],
              Projection: { ProjectionType: "ALL" },
            },
            {
              IndexName: "GSI2",
              KeySchema: [
                { AttributeName: "gsi2pk", KeyType: "HASH" },
                { AttributeName: "gsi2sk", KeyType: "RANGE" },
              ],
              Projection: { ProjectionType: "ALL" },
            },
          ],
          Tags: [
            { Key: "Service", Value: "${self:service}" },
            {
              Key: "Environment",
              Value: "${self:provider.stage}",
            },
          ],
        },
      },
    },
  },
};
export default serverlessConfiguration;
