// credential_repository.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { $credential, Credential } from "@/credential/Credential.Schemas";
import { dynamoDbClient } from "@/config/dynamodb";

const TABLE = process.env.TABLE!;

export class CredentialRepository {
  constructor() {}

  async save(credential: Credential): Promise<void> {
    await dynamoDbClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          pk: `USER#${credential.userId}`,
          sk: "CREDENTIAL",

          gsi1pk: "CREDENTIAL",
          gsi1sk: credential.createdAt,
          ...credential,
        },
      })
    );
  }

  async getByUserId(userId: string): Promise<Credential | null> {
    const result = await dynamoDbClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: {
          pk: `USER#${userId}`,
          sk: "CREDENTIAL",
        },
      })
    );

    if (!result.Item) {
      return null;
    }

    return $credential.parse(result.Item);
  }
}
