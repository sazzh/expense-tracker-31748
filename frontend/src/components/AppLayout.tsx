import { AppShell, Flex, Group, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { IconCalendarDollar } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppShellLayout({ children }: AppLayoutProps) {
  return (
    <AppShell
      header={{ height: { base: 40, md: 50, lg: 60 } }}
      footer={{ height: { base: 40, md: 50, lg: 60 } }}
      padding="md" >
    
      <AppShell.Header>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group h="100%" px="md" gap={8}>
            <IconCalendarDollar  />
            <Text>Expense Tracker</Text>
          </Group>
        </Link>
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