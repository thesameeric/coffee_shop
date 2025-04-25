import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { OrderSchema, OrderResponse, calculateTotalPrice } from '../common/types';
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
            return formatResponse(400, { error: 'Missing order ID' });
        }

        const updatedOrder = parseBody(event, OrderSchema);
        const existingOrderResponse = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id },
            })
        );

        if (!existingOrderResponse.Item) {
            return formatResponse(404, { error: 'Order not found' });
        }

        const price = calculateTotalPrice(updatedOrder.coffeeType, updatedOrder.cupSize, updatedOrder.quantity)

        const timestamp = new Date().toISOString();
        const response = await docClient.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id },
                UpdateExpression: 'set #name = :name, description = :description, updatedAt = :updatedAt, coffeeType = :coffeeType, cupSize = :cupSize, quantity = :quantity, #status = :status, paymentMethod = :paymentMethod, paymentStatus = :paymentStatus, address = :address, totalPrice = :totalPrice',
                ExpressionAttributeNames: {
                    '#name': 'name', // 'name' is a reserved word in DynamoDB
                    '#status': 'status', // 'status' is a reserved word in DynamoDB
                },
                ExpressionAttributeValues: {
                    ':name': updatedOrder.name,
                    ':description': updatedOrder.description || '',
                    ':updatedAt': timestamp,
                    ':coffeeType': updatedOrder.coffeeType,
                    ':cupSize': updatedOrder.cupSize,
                    ':quantity': updatedOrder.quantity,
                    ':status': updatedOrder.status,
                    ':paymentMethod': updatedOrder.paymentMethod,
                    ':paymentStatus': updatedOrder.paymentStatus,
                    ':address': updatedOrder.address,
                    ':totalPrice': price,
                },
                ConditionExpression: 'attribute_exists(id)',
                ReturnValues: 'ALL_NEW',
            })
        );

        const order = response.Attributes as OrderResponse;
        return formatResponse(200, order);
    } catch (error) {
        return handleError(error);
    }
};