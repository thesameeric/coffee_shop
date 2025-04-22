import { z } from 'zod';

// Zod schemas for validation
export const ItemSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
});

export const ItemResponseSchema = ItemSchema.extend({
    id: z.string().uuid(),
    createdAt: z.number(),
    updatedAt: z.number(),
});

// TypeScript interfaces derived from Zod schemas
export type Item = z.infer<typeof ItemSchema>;
export type ItemResponse = z.infer<typeof ItemResponseSchema>;

// DynamoDB item type
export interface DynamoDBItem extends Item {
    id: string;
    createdAt: number;
    updatedAt: number;
}

// API response formats
export interface ApiResponse<T> {
    statusCode: number;
    headers: {
        'Content-Type': string;
        'Access-Control-Allow-Origin': string;
        [key: string]: string;
    };
    body: string;
}

export interface ErrorResponse {
    error: string;
}