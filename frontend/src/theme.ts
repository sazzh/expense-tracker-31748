import { colorsTuple, createTheme, type CSSVariablesResolver } from "@mantine/core";

export const theme = createTheme({
    colors: {
        primary: [
            'hsl(240 100% 97%)',
            'hsl(240 100% 94%)',
            'hsl(240 100% 90%)',
            'hsl(240 90% 84%)',
            'hsl(240 80% 78%)',
            'hsl(240 70% 72%)',
            'hsl(240 60% 62%)', // main
            'hsl(240 60% 60%)',
            'hsl(240 60% 50%)',
            'hsl(240 60% 40%)',
          ],
        success: colorsTuple(Array.from({ length: 10 }, () => 'var(--success)')),
        danger: colorsTuple(Array.from({ length: 10 }, () => 'var(--danger)')),
        warning: colorsTuple(Array.from({ length: 10 }, () => 'var(--warning)')),
        info: colorsTuple(Array.from({ length: 10 }, () => 'var(--info)')),
    },

    primaryColor: 'primary',
    other: {
        bg: 'var(--bg)',
        bgLight: 'var(--bg-light)',
        bgDark: 'var(--bg-dark)',
        text: 'var(--text)',
        textMuted: 'var(--text-muted)',
        border: 'var(--border)',
    },

    autoContrast: true,
    focusRing: 'auto',
});

export const cssVariablesResolver: CSSVariablesResolver = () => ({
    variables: {},
    light: {
        '--mantine-color-body': 'var(--bg-light)',
        '--mantine-color-text': 'var(--text)',
        '--mantine-color-dimmed': 'var(--text-muted)',
        '--mantine-color-default-border': 'var(--border)',
    },
    dark: {
        '--mantine-color-body': 'var(--bg-light)',
        '--mantine-color-text': 'var(--text)',
        '--mantine-color-dimmed': 'var(--text-muted)',
        '--mantine-color-default-border': 'var(--border)',
    }
})