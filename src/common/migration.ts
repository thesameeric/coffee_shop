import { CreateTableCommand, CreateTableCommandInput } from "@aws-sdk/client-dynamodb";
import { client } from "./utils";

const params: CreateTableCommandInput = {
    TableName: "coffee-shop",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
};

// Create the table
async function createTable() {
    try {
        const data = await client.send(new CreateTableCommand(params));
        console.log("Table Created:", data);
    } catch (err) {
        console.error("Error creating table:", err);
    }
}

createTable();
