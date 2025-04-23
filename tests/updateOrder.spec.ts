import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/handlers/updateOrder';
import { docClient } from '../src/common/utils';
import { mockClient } from 'aws-sdk-client-mock';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const mockDocClient = mockClient(docClient);

describe('Update Order Handler', () => {
    const mockId = 'ec9db752-092e-4a48-8098-a9b89ab6acf0';
    const updatedOrder = {
        name: 'Updated Name',
        description: 'Updated Description',
        cupSize: 'large',
        coffeeType: 'latte',
        syrupType: 'vanilla',
        address: 'Downtown',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        status: 'pending',
        quantity: 1,
    };

    beforeEach(() => {
        mockDocClient.reset();
    });

    test('should update the order and return 200 with updated data', async () => {
        mockDocClient.on(GetCommand).resolves({
            Item: { id: mockId, name: 'Old Name' },
        });

        mockDocClient.on(UpdateCommand).resolves({
            Attributes: { id: mockId, ...updatedOrder, updatedAt: new Date().toISOString() },
        });

        const event = {
            pathParameters: { id: mockId },
            body: JSON.stringify(updatedOrder),
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.name).toBe(updatedOrder.name);
        expect(body.description).toBe(updatedOrder.description);
    });

    test('should return 404 if order does not exist', async () => {
        mockDocClient.on(GetCommand).resolves({});

        const event = {
            pathParameters: { id: mockId },
            body: JSON.stringify(updatedOrder),
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toEqual({ error: 'Order not found' });
    });

    test('should return 400 if ID is missing', async () => {
        const event = {
            pathParameters: null,
            body: JSON.stringify(updatedOrder),
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({ error: 'Missing order ID' });
    });
});
