import { Alert, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface Props {
  error: string | null;
  centered?: boolean;    
}

export default function ErrorAlert({ error, centered = false }: Props) {
  if (!error) return null;

    const alert = (
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        {error}
      </Alert>
    );

    return centered
      ? <Center><div style={{ maxWidth: 500, width: '100%' }}>{alert}</div></Center>
      : alert;
}