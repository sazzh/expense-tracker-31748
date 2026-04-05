export type Expense = {
    id: string;
    date: Date;
    name: string;
    amount_cents: number; // cents for best math conversion
    category: string;
    description?: string;
};

export const CATEGORIES = [
    "food",
    "transport",
    "entertainment",
    "utilities",
    "shopping",
    "other"
]

export type Category = typeof CATEGORIES[number];