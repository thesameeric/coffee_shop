const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
import { client } from "./utils"; // Adjust the import path as necessary
// Define the table schema based on your ItemResponseSchema
const params = {
    TableName: "ItemsTable",  // Name of the table
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },  // Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }, // String type for id (UUID)
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,  // You can adjust these
        WriteCapacityUnits: 5, // You can adjust these
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
