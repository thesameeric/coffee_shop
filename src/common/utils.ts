import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { z, ZodError } from 'zod';
import { ApiResponse, ErrorResponse } from './types';

export const client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: "http://localhost:8091",
    credentials: {
        accessKeyId: "mock",
        secretAccessKey: "mock",
    },
});
export const docClient = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = 'ItemsTable';

export function formatResponse<T>(statusCode: number, body: T): ApiResponse<T> {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(body),
    };
}

export function handleError(error: unknown): ApiResponse<ErrorResponse> {
    console.error('Error:', error);

    if (error instanceof ZodError) {
        return formatResponse(400, {
            error: 'Validation error',
            details: error.errors,
        } as any);
    }

    // Handle other errors
    return formatResponse(500, {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
}

// Parse and validate request body with Zod schema
export function parseBody<T>(event: APIGatewayProxyEvent, schema: z.ZodType<T>): T {
    if (!event.body) {
        throw new Error('Missing request body');
    }

    const json = JSON.parse(event.body);
    return schema.parse(json);
}