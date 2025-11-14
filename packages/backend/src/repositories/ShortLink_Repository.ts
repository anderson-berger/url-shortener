import { docClient } from "@/config/dynamodb";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { $shortLink, ShortLink } from "@shortener/shared/types/link";

const TABLE = process.env.TABLE!;

export class ShortLinkRepository {
  constructor() {}

  async save(shortLink: ShortLink) {
    const item = {
      pk: `LINK#${shortLink.id}`,
      sk: "METADATA",
      gsi1pk: `SHORTCODE#${shortLink.shortCode}`,
      gsi1sk: "LINK",
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
