import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "sa-east-1",
  endpoint: "http://localstack:4566",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

const TABLE = "url-shortener-local";

async function ensureTable() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE }));
    console.log(`Tabela ${TABLE} já existe. ✔️`);
    return;
  } catch (e: any) {
    if (e.name !== "ResourceNotFoundException") throw e;
  }

  console.log(`Criando tabela ${TABLE}…`);

  const cmd = new CreateTableCommand({
    TableName: TABLE,
    BillingMode: "PAY_PER_REQUEST",

    AttributeDefinitions: [
      { AttributeName: "pk", AttributeType: "S" },
      { AttributeName: "sk", AttributeType: "S" },
      { AttributeName: "gsi1pk", AttributeType: "S" }, // Adicione
      { AttributeName: "gsi1sk", AttributeType: "S" }, // Adicione
    ],

    KeySchema: [
      { AttributeName: "pk", KeyType: "HASH" },
      { AttributeName: "sk", KeyType: "RANGE" },
    ],

    // Adicione o GSI
    GlobalSecondaryIndexes: [
      {
        IndexName: "GSI1",
        KeySchema: [
          { AttributeName: "gsi1pk", KeyType: "HASH" },
          { AttributeName: "gsi1sk", KeyType: "RANGE" },
        ],
        Projection: {
          ProjectionType: "ALL", // Inclui todos os atributos
        },
      },
    ],
  });

  await client.send(cmd);
  console.log("✅ Tabela criada com sucesso");
}

ensureTable().catch(async (e) => {
  console.error("❌ Erro:", e);
  process.exit(1);
});
