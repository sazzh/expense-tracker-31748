import { Box, Button, Group, Paper, TextInput, Text, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUserPentagon } from '@tabler/icons-react';
import { IconAsterisk } from '@tabler/icons-react';
import { Link } from "react-router-dom";

export function LoginPage() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async (event: React.SubmitEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <Box mx="auto" maw="650" p="xl">
        <Paper shadow="sm" radius="md" withBorder p="lg">
          <h1>Expense Tracker Login</h1>
          <form onSubmit={handleLogin}>
            <TextInput mt="xl"
              label="Username"
              placeholder="Please enter your unique username"
              leftSection={<IconUserPentagon size={18} stroke={1.5} />}
              required
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput mt="md"
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