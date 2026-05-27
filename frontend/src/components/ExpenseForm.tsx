import { Alert, Box, Button, Group, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { CATEGORIES, type Category, type Expense } from "../types/Expense";
import { IconAlertCircle, IconCalendarWeek, IconCaretDown, IconCategory2, IconCheck } from '@tabler/icons-react';
import { createExpense, updateExpense } from "../api/Expenses";
import { useState } from "react";
import { capitalise } from "../utils/capitaliseFormat";

type ExpenseFormProps = {
  expense?: Expense;
  onSuccess?: () => void;
}

export default function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: expense?.name ?? '',
      amount: expense ? (expense.amount) : '',
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
    setLoading(true);

    try {
      const vals = form.getValues();
      const body = {
        name: vals.name.trim(),
        amount: Number(vals.amount),
        date: vals.date,
        category: vals.category as Category,
        description: vals.description.trim() || undefined,
      }

      if (expense) {
        await updateExpense(expense.id, body);
        alert('Expense updated successfully');
      } else {
        await createExpense(body);
        form.reset();
        setStatus({ type: 'success', message: 'Expense created successfully.' });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setStatus({ type: 'error', message: expense ? 'Failed to update expense' : 'Failed to create new expense' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mx="auto" maw="800">
      {status && (
        <Alert
        icon={status.type === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
        color={status.type === 'success' ? 'green' : 'red'}
        mb="md"
        withCloseButton
        onClose={() => setStatus(null)}
      >
        {status.message}
      </Alert>
      )}
    <form onSubmit={form.onSubmit(() => handleSubmit())}>
      <Group align="baseline" grow>
      <TextInput
        autoFocus
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
        max={1000000}
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
          label: capitalise(categories), 
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
        <Button variant="light" type="submit" loading={loading}>Submit</Button>
      </Group>
    </form>
    </Box>
  );
}