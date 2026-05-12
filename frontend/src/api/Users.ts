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