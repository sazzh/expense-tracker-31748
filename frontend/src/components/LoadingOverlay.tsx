import { LoadingOverlay } from "@mantine/core";

type Props = {
  loading: boolean;
};

export default function PageWrapper({ loading }: Props) {
  return (
    <div>
      <LoadingOverlay visible={loading} />
    </div>
  );
}