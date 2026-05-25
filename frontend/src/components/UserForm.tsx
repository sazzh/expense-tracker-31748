import { Alert, Box, Button, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { updateUser } from "../api/Users";
import type { User } from "../types/User";

type EditUserFormProps = {
  user: User;
  onSuccess?: () => void;
};

export default function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: user.username,
      role: user.role,
    },
    validate: {
      username: (value) => value.trim().length > 0 ? null : "Username is required",
      role: (value) => ["user", "admin"].includes(value) ? null : "Invalid role",
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const vals = form.getValues();
      await updateUser(user.id, {
        username: vals.username.trim(),
        role: vals.role,
      });

      setStatus({ type: "success", message: "User updated successfully." });
      onSuccess?.();
    } catch {
      setStatus({ type: "error", message: "Failed to update user." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={500} mx="auto">
      {status && (
        <Alert icon={ status.type === "success" 
                    ? (
            <IconCheck size={16} />
          ) : (
            <IconAlertCircle size={16} />
          )}
            color={status.type === "success" ? "green" : "red"}
            mb="md"
            withCloseButton
            onClose={() => setStatus(null)}
        >
          {status.message}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Username"
          placeholder="Enter username"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />

        <Select
          withAsterisk
          label="Role"
          data={[
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
          ]}
          key={form.key("role")}
          {...form.getInputProps("role")}
          mt="md"
        />

        <Group mt="lg">
          <Button type="submit" loading={loading} c="black">
            Save Changes
          </Button>
        </Group>
      </form>
    </Box>
  );
}
