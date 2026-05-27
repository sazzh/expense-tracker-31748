import { type CreateExpense, type Expense } from "../types/Expense";

type DateRange = { startDate?: string; endDate?: string };

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

// converts date range into url query for trend endpoints
function buildQuery({ startDate, endDate }: DateRange): string {
    const params = new URLSearchParams();
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    const querys = params.toString();
    return querys ? `?${querys}` : "";
}

export async function getExpensesByCategory(startDate?: string | null, endDate?: string | null): Promise<{ category: string, total: number }[]> {
    const range = {
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
    }
    
    const res = await fetch(`/api/expenses/category${buildQuery(range)}`, {
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

export async function getExpensesByMonth(startDate?: string | null, endDate?: string | null): Promise<{ month: string, total: number }[]> {
    const range = {
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
    }
    
    const res = await fetch(`/api/expenses/month${buildQuery(range)}`, {
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