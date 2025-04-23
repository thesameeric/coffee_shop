import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/handlers/getOrder';
import { mockClient } from 'aws-sdk-client-mock';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../src/common/utils';

const mockDocClient = mockClient(docClient);

const mockOrder = {
    "coffeeType": "latte",
    "createdAt": "2025-04-23T02:36:14.723Z",
    "address": "mayfair",
    "quantity": 1,
    "totalPrice": 525,
    "name": "ben",
    "paymentMethod": "cash",
    "id": "a287b0b6-f18c-4c94-af0c-0616a7672134",
    "cupSize": "large",
    "paymentStatus": "pending",
    "status": "pending",
    "updatedAt": "2025-04-23T02:36:14.723Z"
};

describe('Get Orders Handler', () => {
    beforeEach(() => {
        mockDocClient.reset();
    });

    it('should return the order when a valid ID is provided', async () => {
        mockDocClient.on(GetCommand).resolves({ Item: mockOrder });

        const event = {
            pathParameters: { id: 'a287b0b6-f18c-4c94-af0c-0616a7672134' },
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual(mockOrder);
    });

    it('should return 404 when order is not found', async () => {
        mockDocClient.on(GetCommand).resolves({});

        const event = {
            pathParameters: { id: 'non-existent' },
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);
        expect(response.statusCode).toBe(404);
    });

    it('should return 400 if ID is missing', async () => {
        const event = {
            pathParameters: null,
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
    });
});
