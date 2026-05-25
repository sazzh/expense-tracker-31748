import { Alert, Box, Center, Loader } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getUser } from "../api/Users";
import type { User } from "../types/User";
import EditUserForm from "../components/UserForm";
import { IconAlertCircle } from "@tabler/icons-react";

export function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getUser(id!);
        setUser(user);
      } catch {
				setError("Unable to get user. Please try again.");
			} finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [id]);

	if (loading) {
		return (
			<Center h={470}>
				<Loader />
			</Center>
		)
	}

	if (error) {
		return (
			<Center>
				<Alert icon={<IconAlertCircle size={16} />} color="red" maw={500}>
					{error}
				</Alert>
		</Center>
		)
	}

	if (!user) {
    return (
      <>
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        User not found
      </Alert>
      </>
    );
  }

  return (
    <Box mx="auto" maw={800} p="sm">
      <h1 className="title">Edit User</h1>
      <EditUserForm
        user={user}
        onSuccess={() => navigate(`/admin/users/${id}`)}
      />
    </Box>
  );
}
