import { Box, Button, Group, Paper, PasswordInput, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUserPentagon, IconAsterisk } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function RegisterPage() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegistration = async (event: React.SubmitEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const json = Object.fromEntries(formData.entries());

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      // store user info and token in localStorage
    } catch (err) {
      alert("Server connection error");
    }
  };

  return (
    <>
      <Box mx="auto" maw="650" p="sm">
        <Paper shadow="sm" radius="md" withBorder p="lg">
          <h1>Expense Tracker Registration</h1>
          <form onSubmit={handleRegistration}>
            <TextInput mt="xl"
              name="username"
              label="Username"
              placeholder="Please enter a username"
              leftSection={<IconUserPentagon size={18} stroke={1.5} />}
              required
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput mt="md"
              name="password"
              label="Password"
              placeholder="Please enter a strong password"
              leftSection={<IconAsterisk size={18} stroke={1.5} />}
              required
              visibilityToggleButtonProps={{
                'aria-label': 'Toggle password visibility',
              }}
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput mt="md"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Please re-enter your password"
              leftSection={<IconAsterisk size={18} stroke={1.5} />}
              required
              visibilityToggleButtonProps={{
                'aria-label': 'Toggle password visibility',
              }}
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
            <Group className="btn">
              <Button c="black" type="submit">Register</Button>
            </Group>
          </form>
        </Paper>
        <Group mt="md" justify="center">
          <Text>Already have an account?</Text>
          <Link to="/login">Login now!</Link>
        </Group>
      </Box>
    </>
  )
}