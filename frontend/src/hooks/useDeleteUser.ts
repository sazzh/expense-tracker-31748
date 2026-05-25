import { useState } from "react";
import type { User } from "../types/User";
import { deleteUser } from "../api/Users";

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(user: User): Promise<boolean> {
    const ok = window.confirm(`Are you sure you want to delete ${user.username}?`);
    if (!ok) return false;
    
    setLoading(true)
    try {
      await deleteUser(user.id!);
      return true;
    } catch {
      window.alert("Failed to delete user. Please try again");
      setError("Failed to delete user");
      return false;
    } finally {
      setLoading(false);
    }
  }
  return { handleDelete, loading, error };
}