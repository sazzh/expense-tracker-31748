import { Box, Button, Group, Paper, TextInput, Text, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUserPentagon } from '@tabler/icons-react';
import { IconAsterisk } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async (event: React.SubmitEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const json = Object.fromEntries(formData.entries());

      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        if (data.role === "admin") {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        alert(data.detail || "Login failed. Please check your credentials");
      }
    } catch (err) {
      alert("Server connection error");
    }
  };

  return (
    <>
      <Box mx="auto" maw="650" p="xl">
        <Paper shadow="sm" radius="md" withBorder p="lg">
          <h1>Expense Tracker Login</h1>
          <form onSubmit={handleLogin}>
            <TextInput mt="xl"
              name="username"
              label="Username"
              placeholder="Please enter your unique username"
              leftSection={<IconUserPentagon size={18} stroke={1.5} />}
              required
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput mt="md"
              name="password"
              label="Password"
              placeholder="Please enter your password"
              leftSection={<IconAsterisk size={18} stroke={1.5} />}
              required
              visibilityToggleButtonProps={{
                'aria-label': 'Toggle password visibility',
              }}
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <Group className="btn">
              <Button c="black" type="submit">Login</Button>
            </Group>
          </form>
        </Paper>
        <Group mt="md" justify="center">
          <Text>Don't have an account yet?</Text>
          <Link to="/register">Register now!</Link>
        </Group>
      </Box>
    </>
  )
}