import { useState, useEffect, useCallback } from "react";
import { User } from "@/types/types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      setUsers(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (email: string, timezone: string) => {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, timezone }),
    });
    return fetchUsers();
  };

  const updateUser = async (
    id: string,
    data: Partial<{ email: string; timezone: string }>
  ) => {
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    return fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, createUser, updateUser, deleteUser };
}
