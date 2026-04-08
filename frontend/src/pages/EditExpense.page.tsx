import { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import { useParams } from "react-router-dom";
import type { Expense } from "../types/Expense";
import { getExpense } from "../api/Expenses";
import BackButton from "../components/BackButton";
import { LoadingOverlay } from "@mantine/core";

export function EditExpensePage() {
  const { expenseId } = useParams();
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const getSelectedExpense = async () => {
      const expense = await getExpense(expenseId!);
      setExpense(expense);
    };
    getSelectedExpense();
  }, [expenseId]);

  if (!expense) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <>
      <BackButton />
      <h1>Edit Expense</h1>
      <ExpenseForm expense={expense} />
    </>
  )
}