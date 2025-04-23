import { stat } from 'fs';
import { z } from 'zod';

const CoffeeSize = z.enum(['small', 'medium', 'large', 'extra_large']);

const CoffeeType = z.enum([
    'espresso',
    'americano',
    'latte',
    'cappuccino',
    'macchiato',
    'mocha',
    'flat_white',
    'cold_brew',
    'pour_over',
    'drip',
]);

const SyrupType = z.enum([
    'vanilla',
    'caramel',
    'hazelnut',
    'chocolate',
    'peppermint',
    'cinnamon',
    'none',
]);

const OrderStatus = z.enum([
    'pending',
    'preparing',
    'ready',
    'delivered',
    'cancelled',
]);


export const OrderSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    coffeeSize: CoffeeSize,
    coffeeType: CoffeeType,
    syrupType: SyrupType.optional(),
    address: z.string().min(1, { message: "Address is required" }),
    status: OrderStatus,
});

export const OrderResponseSchema = OrderSchema.extend({
    id: z.string().uuid(),
    createdAt: z.number(),
    updatedAt: z.number(),
});


export type Order = z.infer<typeof OrderSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;

export interface DynamoDBItem extends Order {
    id: string;
    createdAt: number;
    updatedAt: number;
}

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