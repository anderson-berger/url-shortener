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
      STAGE: "${self:provider.stage}",
      LINKS_TABLE: "${self:service}-links-${self:provider.stage}",
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
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.LINKS_TABLE}",
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.LINKS_TABLE}/index/*", // ← ADICIONA ESTA LINHA
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
    createLink: {
      handler: "src/handlers/short-link/create.handler",
      events: [
        {
          httpApi: {
            path: "/links",
            method: "post",
          },
        },
      ],
    },
    redirect: {
      handler: "src/handlers/short-link/redirect.handler",
      events: [
        {
          httpApi: {
            path: "/{shortCode}",
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
          TableName: "${self:provider.environment.LINKS_TABLE}",
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

module.exports = serverlessConfiguration;
