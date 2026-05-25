export type Expense = {
    id: string;
    date: string;
    name: string;
    amount: number; // converted to from cents to dollars in backend 
    category: Category;
    description?: string | null;
    created_at: string;
    updated_at: string;
    user_id: number;
};

export type CreateExpense = {
    date: string;
    name: string;
    amount: number;
    category: Category;
    description?: string | null;
}

export const CATEGORIES = [
    "food",
    "transport",
    "entertainment",
    "utilities",
    "shopping",
    "other"
] as const;

export const CATEGORY_COLOURS: Record<Category, string> = {
    food: "violet",
    transport: "blue",
    entertainment: "green",
    utilities: "grape",
    shopping: "cyan",
    other: "gray"
}

export type Category = typeof CATEGORIES[number];