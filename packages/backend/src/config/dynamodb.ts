import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const stage = process.env.STAGE!;

const config: any = {
  region: process.env.AWS_REGION || "sa-east-1",
};

if (stage.toLocaleLowerCase() === "local") {
  config.endpoint = "http://localstack:4566";
  config.credentials = {
    accessKeyId: "test",
    secretAccessKey: "test",
  };
}

export const dynamoDbClient = new DynamoDBClient(config);

export const docClient = DynamoDBDocumentClient.from(dynamoDbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});
