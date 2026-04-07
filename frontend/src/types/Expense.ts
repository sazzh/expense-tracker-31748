export type Expense = {
    id: string;
    date: string;
    name: string;
    amount_cents: number; // cents for best math conversion
    category: Category;
    description?: string | null;
};

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