import { ActionIcon, Box, Button, Group, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { getUsers } from "../api/Users";
import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { IconTrash } from "@tabler/icons-react";

export function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data: User[] = await getUsers();
        setUsers(data);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("implement loading status");
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) { return }
    // await deleteUser(id); TO DO
    setUsers(users.filter(user => user.id !== id));
  }

  return (
    <>
      <Box mx="auto" w="100%" maw="1050" p="sm">
        <h1 className="title">Expense Tracker Activity</h1>
        <Text c="dimmed" size="sm" ml="lg">View all users accounts and their activity.</Text>

        <Box mt="lg">
          {users.map(user => (
            <Box key={user.id} p="xs" mb="sm" style={{ border: "2px solid #eee", borderRadius: 12 }}>
              <Group justify="space-between" align="center">
                <div style={{ paddingLeft: '2rem' }}>
                  <Text fw={500}>{user.username}</Text>
                  <Text size="sm" c="dimmed">User's role: {user.role}</Text>
                </div>
                <Group gap="sm">
                  <Button variant="light" onClick={() => navigate(`/admin/users/${user.id}`)}>
                    Manage Account
                  </Button>
                  <Button variant="light" onClick={() => navigate(`/admin/users/${user.id}/expenses`)}>
                    View Activity
                  </Button>
                  <ActionIcon variant="subtle" aria-label="Delete Expense"
                    onClick={() => handleDelete(user.id)}>
                    <IconTrash stroke={1.25} color="var(--danger)" />
                  </ActionIcon>
                </Group>
              </Group>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  )
}