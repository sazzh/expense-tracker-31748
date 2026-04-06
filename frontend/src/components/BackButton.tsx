import { Anchor, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

export default function BackButton() {
  return (
    <div>
      <Anchor c="dark.3" onClick={() => window.history.back()}>
        <Group gap={4}>
          <IconArrowLeft stroke={1.25} />
          back
        </Group>
      </Anchor>
    </div>
  )
}