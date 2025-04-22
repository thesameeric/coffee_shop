import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ItemResponse } from '../common/types';
import { docClient, TABLE_NAME, formatResponse, handleError } from '../common/utils';

/**
 * Lambda function to read all items from DynamoDB.
 * @param event - The API Gateway event containing the request data.
 * @returns A promise that resolves to an API Gateway proxy result.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const response = await docClient.send(
            new ScanCommand({
                TableName: TABLE_NAME,
            })
        );

        const items = response.Items as ItemResponse[];

        return formatResponse(200, items || []);
    } catch (error) {
        return handleError(error);
    }
};