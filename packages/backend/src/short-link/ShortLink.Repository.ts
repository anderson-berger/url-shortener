import { docClient } from "@/config/dynamodb";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  $shortLink,
  Pagination,
  ShortLink,
} from "@/short-link/ShortLink.Schemas";

const TABLE = process.env.TABLE!;

export class ShortLinkRepository {
  constructor() {}

  async save(shortLink: ShortLink) {
    const item = {
      pk: `LINK#${shortLink.id}`,
      sk: "METADATA",
      gsi1pk: `SHORTCODE#${shortLink.shortCode}`,
      gsi1sk: "LINK",
      gsi2pk: "LINK", // Partition key fixo para listagem
      gsi2sk: shortLink.createdAt, // Sort key para ordenação por data
      ...shortLink,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: item,
        ConditionExpression:
          "attribute_not_exists(pk) AND attribute_not_exists(gsi1pk)",
      })
    );
    return shortLink;
  }

  async getById(id: ShortLink["id"]): Promise<ShortLink | null> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "pk = :pk AND sk = :sk",
        ExpressionAttributeValues: {
          ":pk": `LINK#${id}`,
          ":sk": "METADATA",
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const item = result.Items[0];
    const shortLink = $shortLink.parse(item);
    return shortLink;
  }

  async list(pagination: Pagination) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI2",
        KeyConditionExpression: "gsi2pk = :gsi2pk",
        ExpressionAttributeValues: {
          ":gsi2pk": "LINK",
        },
        Limit: pagination.limit,
        ExclusiveStartKey: pagination.nextToken
          ? JSON.parse(Buffer.from(pagination.nextToken, "base64").toString())
          : undefined,
        ScanIndexForward: false, // Mais recentes primeiro
      })
    );

    const items = (result.Items || []).map((item) => $shortLink.parse(item));

    return {
      items,
      nextToken: result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            "base64"
          )
        : undefined,
      count: items.length,
    };
  }

  async getByShortCode(shortCode: string): Promise<ShortLink | null> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI1",
        KeyConditionExpression: "gsi1pk = :gsi1pk AND gsi1sk = :gsi1sk",
        ExpressionAttributeValues: {
          ":gsi1pk": `SHORTCODE#${shortCode}`,
          ":gsi1sk": "LINK",
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const item = result.Items[0];
    const shortLink = $shortLink.parse(item);
    return shortLink;
  }
}
