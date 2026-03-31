import ExpenseTable from "../components/ExpenseTable";
import { mockData } from "../types/Expense";

export function HomePage() {
  return (
    <>
      <ExpenseTable data={mockData}/>
    </>
  )
}