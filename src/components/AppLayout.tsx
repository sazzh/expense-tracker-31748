import { AppShell, Flex, Group, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { IconCalendarDollar } from '@tabler/icons-react';

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
        <Group h="100%" px="md">
          <IconCalendarDollar  />
          <Text>Expense Tracker</Text>
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