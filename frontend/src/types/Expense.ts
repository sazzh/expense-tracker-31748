export type Expense = {
    id: string;
    date: string;
    name: string;
    amount_cents: number; // cents for best math conversion
    category: string;
    description?: string | null;
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