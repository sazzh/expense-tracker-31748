import { Group, NumberInput, Select, TextInput, Textarea } from "@mantine/core";
import { CATEGORIES, type Expense } from "../types/Expense";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendarWeek, IconCategory2 } from "@tabler/icons-react";

export function ExpenseDetails({ expense }: { expense: Expense }) {
  return (
    <>
      <Group align="baseline" grow>
        <TextInput 
          label="Expense Name"
          value={expense.name}
          withAsterisk
          readOnly
        />
        <NumberInput
          label="Amount ($)"
          value={(expense.amount_cents / 100).toFixed(2)}
          withAsterisk
          prefix="$"
          thousandSeparator=","
          decimalScale={2}
          readOnly
        />
      </Group>
      <Group align="baseline" grow>
        <DatePickerInput 
          label="Date of expense"
          value={expense.date}
          withAsterisk
          valueFormat="DD MMM YYYY"
          leftSection={<IconCalendarWeek stroke={1.25} />}
          readOnly
        />
        <Select
          label="Category"
          value={expense.category.toLowerCase()}
          data={CATEGORIES.map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c }))}
          withAsterisk
          leftSection={<IconCategory2 stroke={1.25} />}
          readOnly
        />
      </Group>
      <Textarea
        label="Expense description"
        value={expense.description ?? ""}
        description="Additional details about the expense (optional)"
        readOnly
      />
    </>
  );
}