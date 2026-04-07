import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

type filterProps = {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ExpenseFilters({ search, onSearchChange }: filterProps) {
  return (
    <TextInput 
      mb="md"
      leftSection={<IconSearch stroke={1.25} />}
      placeholder="Search expenses..."
      value={search}
      onChange={(e) => onSearchChange(e.currentTarget.value)} />
  )
}