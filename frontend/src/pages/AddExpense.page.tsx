import BackButton from "../components/BackButton";
import ExpenseForm from "../components/ExpenseForm";

export function AddExpensePage() {
  return (
    <>
      <BackButton />
      <h1>Add New Expense</h1>
      <ExpenseForm />
    </>
  )
}