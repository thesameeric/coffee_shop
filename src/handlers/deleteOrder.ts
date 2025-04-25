import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
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
            return formatResponse(400, { error: 'Order ID is required' });
        }

        const existingOrderResponse = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id },
            })
        );

        if (!existingOrderResponse.Item) {
            return formatResponse(404, { error: 'Order not found' });
        }

        await docClient.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id },
                ReturnValues: 'ALL_OLD',
            })
        );

        return formatResponse(204, {
            message: '',
        });
    } catch (error) {
        return handleError(error);
    }
};