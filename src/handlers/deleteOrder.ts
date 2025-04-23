import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { OrderResponse } from '../common/types';
import { docClient, TABLE_NAME, formatResponse, handleError } from '../common/utils';

/**
 * Lambda function to delete an item from DynamoDB by ID.
 * @param event - The API Gateway event containing the request data.
 * @returns A promise that resolves to an API Gateway proxy result.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters?.id;

        if (!id) {
            return formatResponse(400, { error: 'Missing item ID' });
        }

        const existingItemResponse = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id },
            })
        );

        if (!existingItemResponse.Item) {
            return formatResponse(404, { error: 'Item not found' });
        }

        const response = await docClient.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id },
                ReturnValues: 'ALL_OLD',
            })
        );

        const deletedItem = response.Attributes as OrderResponse;

        return formatResponse(200, {
            message: 'Item deleted successfully',
            deletedItem,
        });
    } catch (error) {
        return handleError(error);
    }
};