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

const SizePriceAdjustment: Record<string, number> = {
    'small': 0,
    'medium': 75,
    'large': 150,
    'extra_large': 225,
};

const CoffeeBasePrice: Record<string, number> = {
    'espresso': 250,
    'americano': 275,
    'latte': 375,
    'cappuccino': 395,
    'macchiato': 350,
    'mocha': 425,
    'flat_white': 395,
    'cold_brew': 375,
    'pour_over': 450,
    'drip': 225,
};

export const calculateTotalPrice = (
    coffeeType: keyof typeof CoffeeBasePrice,
    size: keyof typeof SizePriceAdjustment,
    quantity: number
): number => {
    const basePrice = CoffeeBasePrice[coffeeType];
    const sizeAdjustment = SizePriceAdjustment[size];
    const total = (basePrice + sizeAdjustment) * quantity;
    return total
};


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

const PaymentStatus = z.enum(['pending', 'processing', 'completed', 'failed']);
const PaymentMethod = z.enum(['credit_card', 'debit_card', 'cash', 'mobile_payment']);


export const OrderSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    cupSize: CoffeeSize,
    coffeeType: CoffeeType,
    syrupType: SyrupType.optional(),
    address: z.string().optional(),
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus.default(PaymentStatus.Values.pending),
    status: OrderStatus.default(OrderStatus.Values.pending),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
});

export const OrderResponseSchema = OrderSchema.extend({
    id: z.string().uuid(),
    totalPrice: z.number().positive(),
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