export type Expense = {
    expenseId: string;
    date: Date;
    expense: string;
    amount: number; // cents for best math conversion
    category: string;
    description: string;
};

export const mockData: Expense[] = [
    {
        expenseId: "001",
        date: new Date("2025-12-04T10:00:00"),
        expense: "Coffee",
        amount: 59,
        category: "FOOD_AND_DRINK",
        description: "drink from fav coffee place",
    },
    {
        expenseId: "002",
        date: new Date("2025-11-04T10:00:00"),
        expense: "Coffee",
        amount: 59,
        category: "FOOD_AND_DRINK",
        description: "drink from fav coffee place",
    },
    {
        expenseId: "003",
        date: new Date("2025-10-04T10:00:00"),
        expense: "Coffee",
        amount: 59,
        category: "FOOD_AND_DRINK",
        description: "drink from fav coffee place",
    },
    {
        expenseId: "004",
        date: new Date("2025-09-04T10:00:00"),
        expense: "Coffee",
        amount: 59,
        category: "FOOD_AND_DRINK",
        description: "drink from fav coffee place",
    },
    {
        expenseId: "005",
        date: new Date("2025-08-04T10:00:00"),
        expense: "Coffee",
        amount: 59,
        category: "FOOD_AND_DRINK",
        description: "drink from fav coffee place",
    },
    {
        expenseId: "006",
        date: new Date("2025-07-04T10:00:00"),
        expense: "Coffee",
        amount: 59,
        category: "FOOD_AND_DRINK",
        description: "drink from fav coffee place",
    },
];