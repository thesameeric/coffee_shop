import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { OrderSchema, calculateTotalPrice } from '../common/types';
import { docClient, TABLE_NAME, formatResponse, handleError, parseBody } from '../common/utils';

/**
 * Lambda function to create a new item in DynamoDB.
 * @param event - The API Gateway event containing the request data.
 * @returns A promise that resolves to an API Gateway proxy result.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const order = parseBody(event, OrderSchema);
        const timestamp = new Date().toISOString();
        const id = uuidv4();

        const price = calculateTotalPrice(order.coffeeType, order.cupSize, order.quantity)
        const newOrder = {
            id,
            ...order,
            totalPrice: price,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: newOrder,
            })
        );        
        return formatResponse(201, { message: 'Order created successfully', data: newOrder });
    } catch (error) {
        return handleError(error);
    }
};