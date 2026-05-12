import { AppShell, Button, Flex, Group, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { IconCalendarDollar } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppShellLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const showLogout = token && location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <AppShell
      header={{ height: { base: 30, md: 40, lg: 50 } }}
      footer={{ height: { base: 30, md: 40, lg: 50 } }}
      padding="md" >
    
      <AppShell.Header>
        <Group h="100%" px="md" justify='space-between'>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Group h="100%" px="md" gap={8}>
              <IconCalendarDollar  />
              <Text>Expense Tracker</Text>
            </Group>
          </Link>
          {showLogout && (
          <Button variant='transparent' onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}>Logout</Button>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      <AppShell.Footer>
        <Flex justify="flex-end" h="100%" px="md" align="center">
            <Text ta="right" c="dimmed" size="xs">Programming on the Internet 31748 Assignment 1</Text>
        </Flex>
      </AppShell.Footer>

    </AppShell>
  )
}