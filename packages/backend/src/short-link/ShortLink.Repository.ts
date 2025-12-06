// src/short-link/ShortLink.Repository.ts
import { docClient } from "@/config/dynamodb";
import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  $shortLink,
  Pagination,
  ShortLink,
} from "@/short-link/ShortLink.Schemas";

const TABLE = process.env.TABLE!;

export class ShortLinkRepository {
  async save(shortLink: ShortLink) {
    const item = {
      pk: `LINK#${shortLink.id}`,
      sk: "METADATA",
      gsi1pk: `SHORTCODE#${shortLink.shortCode}`,
      gsi1sk: "LINK",
      gsi2pk: "LINK",
      gsi2sk: shortLink.createdAt,
      gsi3pk: `USER#${shortLink.userId}`, // Novo GSI para filtrar por usuário
      gsi3sk: shortLink.createdAt,
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

  async update(shortLink: ShortLink) {
    const item = {
      pk: `LINK#${shortLink.id}`,
      sk: "METADATA",
      gsi1pk: `SHORTCODE#${shortLink.shortCode}`,
      gsi1sk: "LINK",
      gsi2pk: "LINK",
      gsi2sk: shortLink.createdAt,
      gsi3pk: `USER#${shortLink.userId}`,
      gsi3sk: shortLink.createdAt,
      ...shortLink,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: item,
        ConditionExpression:
          "attribute_exists(pk) AND #version = :expectedVersion",
        ExpressionAttributeNames: {
          "#version": "version",
        },
        ExpressionAttributeValues: {
          ":expectedVersion": shortLink.version - 1,
        },
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

  async list(pagination: Pagination, userId: string) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "GSI3", // Usa GSI3 para filtrar por usuário
        KeyConditionExpression: "gsi3pk = :gsi3pk",
        ExpressionAttributeValues: {
          ":gsi3pk": `USER#${userId}`,
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

  async delete(shortLink: ShortLink): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: {
          pk: `LINK#${shortLink.id}`,
          sk: "METADATA",
        },
        ConditionExpression:
          "attribute_exists(pk) AND #version = :expectedVersion",
        ExpressionAttributeNames: {
          "#version": "version",
        },
        ExpressionAttributeValues: {
          ":expectedVersion": shortLink.version,
        },
      })
    );
  }
}
