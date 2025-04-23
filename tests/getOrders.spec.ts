import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/handlers/getOrders';
import { mockClient } from 'aws-sdk-client-mock';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../src/common/utils';

const mockDocClient = mockClient(docClient);

describe('Get Orders Handler', () => {
    beforeEach(() => {
        mockDocClient.reset();
    });

    test('should return empty data array when no items are returned', async () => {
        mockDocClient.on(ScanCommand).resolves({ Items: [] });

        const event = {
            queryStringParameters: null
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({
            data: [],
            nextToken: null
        });
        expect(mockDocClient.commandCalls(ScanCommand)).toHaveLength(1);
    });

    test('should return a list of orders and nextToken when paginated', async () => {
        const orders = [
            { name: 'Ben', coffeeType: 'latte', cupSize: 'large' },
            { name: 'Anna', coffeeType: 'mocha', cupSize: 'medium' }
        ];
        const lastEvaluatedKey = { id: 'last-key' };

        mockDocClient.on(ScanCommand).resolves({
            Items: orders,
            LastEvaluatedKey: lastEvaluatedKey
        });

        const event = {
            queryStringParameters: {
                limit: '2'
            }
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.data).toEqual(orders);
        expect(body.nextToken).toBe(encodeURIComponent(JSON.stringify(lastEvaluatedKey)));
    });

    test('should handle invalid limit gracefully', async () => {
        mockDocClient.on(ScanCommand).resolves({ Items: [] });

        const event = {
            queryStringParameters: {
                limit: 'not-a-number'
            }
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.data).toEqual([]);
        expect(body.nextToken).toBeNull();
    });
});
