import { Box, Button, Group, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { CATEGORIES, type Category, type Expense } from "../types/Expense";
import { IconCalendarWeek, IconCaretDown, IconCategory2 } from '@tabler/icons-react';
import { createExpense, updateExpense } from "../api/Expenses";
import { useNavigate } from "react-router";

type ExpenseFormProps = {
  expense?: Expense;
}

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const navigate = useNavigate();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: expense?.name ?? '',
      amount: expense ? (expense.amount_cents / 100) : '',
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

    const body = {
      name: vals.name.trim(),
      amount_cents: Math.round(Number(vals.amount) * 100), // convert dollars to cents
      date: vals.date,
      category: vals.category as Category,
      description: vals.description.trim() || undefined,
    }

    if (expense) {
      await updateExpense(expense.id, body);
    } else {
      await createExpense(body);
    }

    navigate('/');
  };

  return (
    <Box mx="auto" maw="800">
    <form onSubmit={form.onSubmit(() => handleSubmit())}>
      <Group align="baseline" grow>
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
      </Group>
      <Group align="baseline" grow mt="md">
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
      </Group>
      <Textarea mt="md"
        label="Expense description"
        description="Additional details about the expense (optional)"
        placeholder="Your description..."
        key={form.key('description')}
        {...form.getInputProps('description')}
      />
      <Group className="btn">
        <Button c="black" type="submit">Submit</Button>
      </Group>
    </form>
    </Box>
  );
}