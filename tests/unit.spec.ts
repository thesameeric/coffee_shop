import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/handlers/create';
import { docClient } from '../src/common/utils';
import { mockClient } from 'aws-sdk-client-mock';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const mockDocClient = mockClient(docClient);

describe('Create Handler', () => {
    beforeEach(() => {
        mockDocClient.reset();
        mockDocClient.on(PutCommand).resolves({});
    });

    test('should create a new item successfully', async () => {
        // Create mock event
        const event = {
            body: JSON.stringify({
                name: 'Test Item',
                description: 'This is a test item'
            })
        } as APIGatewayProxyEvent;

        // Call handler
        const response = await handler(event);

        // Check response
        expect(response.statusCode).toBe(201);

        const { data } = JSON.parse(response.body);
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('name', 'Test Item');
        expect(data).toHaveProperty('description', 'This is a test item');
        expect(data).toHaveProperty('createdAt');
        expect(data).toHaveProperty('updatedAt');

        // Verify DynamoDB was called
        const putCommandCalls = mockDocClient.commandCalls(PutCommand);
        expect(putCommandCalls).toHaveLength(1);
    });

    test('should return 400 when validation fails', async () => {
        // Create mock event with invalid data (missing name)
        const event = {
            body: JSON.stringify({
                description: 'This is a test item without a name'
            })
        } as APIGatewayProxyEvent;

        // Call handler
        const response = await handler(event);

        // Check response
        expect(response.statusCode).toBe(400);

        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('error');
        expect(body.error).toContain('Validation error');

        // Verify DynamoDB was not called
        const putCommandCalls = mockDocClient.commandCalls(PutCommand);
        expect(putCommandCalls).toHaveLength(0);
    });
});