import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/handlers/deleteOrder';
import { docClient } from '../src/common/utils';
import { mockClient } from 'aws-sdk-client-mock';
import { GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const mockDocClient = mockClient(docClient);

describe('Delete Order Handler', () => {
    const orderId = 'order-123';

    beforeEach(() => {
        mockDocClient.reset();
    });

    test('should delete the order and return 204', async () => {
        mockDocClient.on(GetCommand).resolves({
            Item: { id: orderId, name: 'Espresso', quantity: 1 },
        });

        mockDocClient.on(DeleteCommand).resolves({});

        const event = {
            pathParameters: { id: orderId },
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);
        expect(response.statusCode).toBe(204);
    });

    test('should return 404 if the order does not exist', async () => {
        mockDocClient.on(GetCommand).resolves({});

        const event = {
            pathParameters: { id: orderId },
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toEqual({ error: 'Order not found' });
    });

    test('should return 400 if no id is provided', async () => {
        const event = {
            pathParameters: null,
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({ error: 'Order ID is required' });
    });
});
