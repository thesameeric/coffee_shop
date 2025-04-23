import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/handlers/createOrder';
import { docClient } from '../src/common/utils';
import { mockClient } from 'aws-sdk-client-mock';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const mockDocClient = mockClient(docClient);

const mockOrder = {
    "name": "Ben",
    "cupSize": "large",
    "coffeeType": "latte",
    "address": "mayfair",
    "paymentStatus": "pending",
    "paymentMethod": "cash",
    "quantity": 1
}
describe('Create Handler', () => {
    beforeEach(() => {
        mockDocClient.reset();
        mockDocClient.on(PutCommand).resolves({});
    });

    test('should create a new item successfully', async () => {
        const event = {
            body: JSON.stringify(mockOrder)
        } as APIGatewayProxyEvent;

        const response = await handler(event);
        expect(response.statusCode).toBe(201);

        const { data } = JSON.parse(response.body);
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('name', 'Ben');
        expect(data).toHaveProperty('cupSize', 'large');
        expect(data).toHaveProperty('coffeeType', 'latte');
        expect(data).toHaveProperty('address', 'mayfair');
        expect(data).toHaveProperty('paymentStatus', 'pending');
        expect(data).toHaveProperty('paymentMethod', 'cash');
        expect(data).toHaveProperty('quantity', 1);
        expect(data).toHaveProperty('status', 'pending');
        expect(data).toHaveProperty('createdAt');
        expect(data).toHaveProperty('updatedAt');

        const putCommandCalls = mockDocClient.commandCalls(PutCommand);
        expect(putCommandCalls).toHaveLength(1);
    });

    test('should return 400 when validation fails', async () => {
        // Create mock event with invalid data (missing name)
        const event = {
            body: JSON.stringify({...mockOrder, coffeeType: 'black'})
        } as APIGatewayProxyEvent;

        const response = await handler(event);
        expect(response.statusCode).toBe(400);

        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('error');
        expect(body.error).toContain('Validation error');

        // Verify DynamoDB was not called
        const putCommandCalls = mockDocClient.commandCalls(PutCommand);
        expect(putCommandCalls).toHaveLength(0);
    });
});