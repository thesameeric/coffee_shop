import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { OrderResponse } from '../common/types';
import { docClient, TABLE_NAME, formatResponse, handleError } from '../common/utils';

/**
 * Lambda function to retrieve a single item from DynamoDB by ID.
 * @param event - The API Gateway event containing the request data.
 * @returns A promise that resolves to an API Gateway proxy result.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Extract ID from path parameters
        const id = event.pathParameters?.id;

        if (!id) {
            return formatResponse(400, { error: 'Missing item ID' });
        }

        const response = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id },
            })
        );

        if (!response.Item) {
            return formatResponse(404, { error: 'Item not found' });
        }

        const order = response.Item as OrderResponse;
        return formatResponse(200, order);
    } catch (error) {
        return handleError(error);
    }
};