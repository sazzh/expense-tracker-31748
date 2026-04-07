import { Group, MultiSelect, TextInput } from "@mantine/core";
import { IconCaretDown, IconCategory2, IconSearch } from "@tabler/icons-react";
import { CATEGORIES, type Category } from "../types/Expense";

type filterProps = {
  search: string;
  category: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: Category[]) => void;
}

export default function ExpenseFilters({ search, category, onSearchChange, onCategoryChange }: filterProps) {
  return (
    <Group grow>
      <TextInput 
        mb="md"
        leftSection={<IconSearch stroke={1.25} />}
        placeholder="Search expenses..."
        value={search}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
      />
      <MultiSelect<Category>
        mb="md"
        placeholder="Expense category"
        leftSection={<IconCategory2 stroke={1.25} />}
        rightSection={<IconCaretDown color="silver" strokeWidth={1.25}/>}
        clearable
        searchable
        hidePickedOptions
        maxValues={3}
        data={CATEGORIES.map((category) => ({ 
          label: category.charAt(0).toUpperCase() + category.slice(1), 
          value: category
        }))}
        value={category}
        onChange={onCategoryChange}
      />
    </Group>
  )
}