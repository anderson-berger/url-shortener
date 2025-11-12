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
    hello: {
      handler: "src/handlers/hello.handler",
      events: [
        {
          httpApi: {
            path: "/hello",
            method: "get",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
