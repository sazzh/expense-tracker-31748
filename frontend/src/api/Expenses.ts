import { type Expense } from "../types/Expense";

export async function getExpenses(): Promise<Expense[]> {
    const res = await fetch('/api/expenses');

        if (!res.ok) {
          throw new Error(`Failed to fetch expenses: ${res.status} ${res.statusText}`);
        }

        return res.json()
}

export async function getExpense(id: string): Promise<Expense> {
    const res = await fetch(`/api/expenses/${id}`);

    if (!res.ok) {
        throw new Error(`Failed to fetch expense: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function createExpense(data: Omit<Expense, 'id'>): Promise<Expense> {
    const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error(`Failed to create expense: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function updateExpense(id: string, data: Omit<Expense, 'id'>): Promise<Expense> {
    const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error(`Failed to update expense: ${res.status} ${res.statusText}`);
    }

    return res.json();
}