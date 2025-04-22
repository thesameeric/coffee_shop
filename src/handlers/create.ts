import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Item, ItemSchema, ItemResponse } from '../common/types';
import { docClient, TABLE_NAME, formatResponse, handleError, parseBody } from '../common/utils';

/**
 * Lambda function to create a new item in DynamoDB.
 * @param event - The API Gateway event containing the request data.
 * @returns A promise that resolves to an API Gateway proxy result.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const item: Item = parseBody(event, ItemSchema);
        const timestamp = Date.now();
        const id = uuidv4();

        const newItem: ItemResponse = {
            ...item,
            id,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: newItem,
            })
        );

        return formatResponse(201, { message: 'Item created successfully', data: newItem });
    } catch (error) {
        return handleError(error);
    }
};