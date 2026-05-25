import { type CreateExpense, type Expense } from "../types/Expense";

export async function getExpenses(): Promise<Expense[]> {
    const res = await fetch('/api/expenses', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

        if (!res.ok) {
          throw new Error(`Failed to fetch expenses: ${res.status} ${res.statusText}`);
        }

        return res.json()
}

export async function getExpense(id: string): Promise<Expense> {
    const res = await fetch(`/api/expenses/${id}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch expense: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function createExpense(data: Omit<CreateExpense, 'id'>): Promise<Expense> {
    const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error(`Failed to create expense: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function updateExpense(id: string, data: Omit<CreateExpense, 'id'>): Promise<Expense> {
    const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error(`Failed to update expense: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function deleteExpense(id: string): Promise<void> {
    const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }); 

    if (!res.ok) {
        throw new Error(`Failed to delete expense: ${res.status} ${res.statusText}`);
    }

    // doesn't return anything
}

export async function getExpensesByCategory(): Promise<{ category: string, total: number }[]> {
    const res = await fetch('/api/expenses/category', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch expenses by category: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function getExpensesByMonth(): Promise<{ month: string, total: number }[]> {
    const res = await fetch('/api/expenses/month', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch expenses by month: ${res.status} ${res.statusText}`);
    }

    return res.json();
}