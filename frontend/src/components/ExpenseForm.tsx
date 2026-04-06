import { Button, Group, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { CATEGORIES } from "../types/Expense";
import { IconCaretDown } from '@tabler/icons-react';


export default function ExpenseForm() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      amount: '', // convert to cents when sending to backend 
      date: new Date(), // make it this when sending to backend .toISOString().split('T')[0] -> yyyy-mm-dd format
      category: '',
      description: '',
    },
    validate: {
      name: (value) => value.trim().length > 0 ? null : 'Expense name is required',
      amount: (value) => typeof value === 'number' && value > 0 ? null : 'Amount must be greater than $0.00',
      date: (value) => value instanceof Date && !isNaN(value.getTime()) ? null : 'Invalid date',
      category: (value) => (CATEGORIES as readonly string[]).includes(value) ? null : 'Please select a valid category',
    }
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
      <DateInput
        withAsterisk
        label="Date of expense"
        placeholder="Select date of expense"
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