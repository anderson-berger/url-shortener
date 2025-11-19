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
              // evitar self:provider.environment.TABLE aqui também — usar opt:stage
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
    "health-check": {
      handler: "src/health-check/handler.handler",
      events: [
        {
          httpApi: {
            path: "/api/health",
            method: "get",
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
          },
        },
        {
          httpApi: {
            path: "/api/{shortCode}",
            method: "get",
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
