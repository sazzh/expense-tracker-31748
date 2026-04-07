import { Button, Flex, MultiSelect, TextInput } from "@mantine/core";
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
    <Flex gap="md" mb="md">
      <TextInput style={{ flex: 1, minWidth: 0 }}
        leftSection={<IconSearch stroke={1.25} />}
        placeholder="Search expenses..."
        value={search}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
      />
      <MultiSelect<Category> style={{ flex: 2, minWidth: 0 }}
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
      <Button style={{ flex: 1, minWidth: 0 }}
        variant="outline" 
        c="black"
        onClick={() => { onSearchChange(''); onCategoryChange([]) }}
        >
        Clear filters
      </Button>
    </Flex>
  )
}