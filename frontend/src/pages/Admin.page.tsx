import { ActionIcon, Alert, Box, Button, Center, Group, Loader, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { getUsers } from "../api/Users";
import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { IconAlertCircle, IconTrash } from "@tabler/icons-react"; 
import { useDeleteUser } from "../hooks/useDeleteUser";

export function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleDelete } = useDeleteUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data: User[] = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  async function onDelete(user: User) {
    const ok = await handleDelete(user);
    if (ok) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  }

  return (
    <>
      <Box mx="auto" w="100%" maw="1050" p="sm">
        <h1 className="title">Expense Tracker Activity</h1>
        <Text c="dimmed" size="sm" ml="lg">View all users accounts and their activity.</Text>

        {loading && <Center mt="xl"><Loader /></Center>}

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            {error}
          </Alert>
        )}

        {!loading && !error && (
        <Box mt="lg">
          {users.map(user => (
            <Box key={user.id} p="xs" mb="sm" style={{ border: "2px solid #eee", borderRadius: 12 }}>
              <Group justify="space-between" align="center">
                <div style={{ paddingLeft: '2rem' }}>
                  <Text fw={500}>{user.username}</Text>
                  <Text size="sm" c="dimmed">User's role: {user.role}</Text>
                </div>
                <Group gap="sm">
                  <Button variant="light" color="gray" onClick={() => navigate(`/admin/users/${user.id}/expenses`)}>
                    View Activity
                  </Button>
                  <Button variant="light" onClick={() => navigate(`/admin/users/${user.id}`)}>
                    Manage Account
                  </Button>
                  <ActionIcon variant="subtle" aria-label="Delete Expense"
                    onClick={() => onDelete(user)}>
                    <IconTrash stroke={1.25} color="var(--danger)" />
                  </ActionIcon>
                </Group>
              </Group>
            </Box>
          ))}
        </Box>
        )}
      </Box>
    </>
  )
}