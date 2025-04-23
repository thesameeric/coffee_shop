import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { OrderResponse } from '../common/types';
import { docClient, TABLE_NAME, formatResponse, handleError } from '../common/utils';

/**
 * Lambda function to read all items from DynamoDB.
 * @param event - The API Gateway event containing the request data.
 * @returns A promise that resolves to an API Gateway proxy result.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const queryParams = event.queryStringParameters || {};
        const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 20; // Default limit is 20
        const lastEvaluatedKey = queryParams.nextToken ? JSON.parse(decodeURIComponent(queryParams.nextToken)) : undefined;

        const response = await docClient.send(
            new ScanCommand({
                TableName: TABLE_NAME,
                Limit: limit,
                ExclusiveStartKey: lastEvaluatedKey,
            })
        );

        const orders = response.Items as OrderResponse[];

        const responseBody = {
            data: orders || [],
            nextToken: response.LastEvaluatedKey
                ? encodeURIComponent(JSON.stringify(response.LastEvaluatedKey))
                : null
        };

        return formatResponse(200, responseBody);
    } catch (error) {
        return handleError(error);
    }
};