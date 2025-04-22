import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Item, ItemSchema, ItemResponse } from '../common/types';
import { docClient, TABLE_NAME, formatResponse, handleError, parseBody } from '../common/utils';

/**
 * 
 * @param event - The API Gateway event containing the request data.
 * @returns A promise that resolves to an API Gateway proxy result.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters?.id;

        if (!id) {
            return formatResponse(400, { error: 'Missing item ID' });
        }

        const updatedItem: Item = parseBody(event, ItemSchema);
        const existingItemResponse = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id },
            })
        );

        if (!existingItemResponse.Item) {
            return formatResponse(404, { error: 'Item not found' });
        }

        const timestamp = Date.now();
        const response = await docClient.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id },
                UpdateExpression: 'set #name = :name, description = :description, updatedAt = :updatedAt',
                ExpressionAttributeNames: {
                    '#name': 'name', // 'name' is a reserved word in DynamoDB
                },
                ExpressionAttributeValues: {
                    ':name': updatedItem.name,
                    ':description': updatedItem.description || '',
                    ':updatedAt': timestamp,
                },
                ReturnValues: 'ALL_NEW',
            })
        );

        // Parse updated item as the expected type
        const item = response.Attributes as ItemResponse;

        // Return the updated item
        return formatResponse(200, item);
    } catch (error) {
        return handleError(error);
    }
};