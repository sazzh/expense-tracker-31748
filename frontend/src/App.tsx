import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

import { MantineProvider } from '@mantine/core';
import { cssVariablesResolver, theme } from './theme';
import { Router } from './Router';

export default function App() {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme='light'>
      <Router />
    </MantineProvider>
  )
}
