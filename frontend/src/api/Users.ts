import type { Expense } from "../types/Expense";
import { type User } from "../types/User";

export async function getUsers(): Promise<User[]> {
  const res = await fetch('/api/admin/users', {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
  }

  return res.json()
}

export async function getUser(userId: string): Promise<User> {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
  }

  return res.json()
}

export async function getUserExpenses(userId: string): Promise<Expense[]> {
  const res = await fetch(`/api/admin/users/${userId}/expenses`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user's expenses: ${res.status} ${res.statusText}`);
  }

  return res.json()
}

export async function updateUser(userId: string, body: { username: string, role: string }) {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to update user: ${res.status} ${res.statusText}`);
  }

  return res.json()
}

export async function deleteUser(userId: string) {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`);
  }
}