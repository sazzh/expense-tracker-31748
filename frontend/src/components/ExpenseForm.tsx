import { Button, Group, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { CATEGORIES, type Expense } from "../types/Expense";
import { IconCalendarWeek, IconCaretDown, IconCategory2 } from '@tabler/icons-react';
import { createExpense } from "../api/Expenses";

type ExpenseFormProps = {
  expense?: Expense;
}

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: expense?.name ?? '',
      amount: expense ? (expense.amount_cents / 100).toString() : '',
      date: expense?.date ?? new Date().toISOString().split('T')[0],
      category: expense?.category ?? '',
      description: expense?.description ?? '',
    },
    validate: {
      name: (value) => value.trim().length > 0 ? null : 'Expense name is required',
      amount: (value) => typeof value === 'number' && value > 0 ? null : 'Amount must be greater than $0.00',
      date: (value) => value ? null : 'Please select a date',
      category: (value) => (CATEGORIES as readonly string[]).includes(value) ? null : 'Please select a valid category',
    }
  });

  const handleSubmit = async () => {
    const vals = form.getValues();
    await createExpense({
      name: vals.name.trim(),
      amount_cents: Math.round(Number(vals.amount) * 100), // convert dollars to cents
      date: vals.date,
      category: vals.category,
      description: vals.description.trim() || undefined,
    });
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(() => handleSubmit())}>
      <TextInput
        withAsterisk
        label="Expense Name"
        placeholder="Groceries, Rent, etc."
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <NumberInput
        withAsterisk
        label="Amount ($)"
        placeholder="$0.00"
        prefix="$"
        thousandSeparator=","
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale
        stepHoldDelay={500}
        stepHoldInterval={100}
        key={form.key('amount')}
        {...form.getInputProps('amount')}
      />
      <DatePickerInput
        withAsterisk
        label="Date of expense"
        placeholder="Select date of expense"
        valueFormat="DD MMM YYYY"
        leftSection={<IconCalendarWeek stroke={1.25} />} 
        clearable
        key={form.key('date')}
        {...form.getInputProps('date')}
      />
      <Select
        withAsterisk
        label="Category"
        placeholder="Select category of your expense"
        data={CATEGORIES.map((categories) => ({ 
          label: categories.charAt(0).toUpperCase() + categories.slice(1), 
          value: categories
        }))}
        leftSection={<IconCategory2 stroke={1.25} />}
        rightSection={<IconCaretDown strokeWidth={1.25}/>}
        key={form.key('category')}
        {...form.getInputProps('category')}
      />
      <Textarea
        label="Expense description"
        description="Additional details about the expense (optional)"
        placeholder="Your description..."
        key={form.key('description')}
        {...form.getInputProps('description')}
      />
      <Group mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}