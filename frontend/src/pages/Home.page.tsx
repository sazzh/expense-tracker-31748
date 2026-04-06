import { Button } from "@mantine/core";
import ExpenseTable from "../components/ExpenseTable";
import { useNavigate } from "react-router";

export function HomePage() {
  let navigate = useNavigate();

  return (
    <>
      <h1>Expense Tracker</h1>
      <ExpenseTable />
      <Button mt="sm" c="black" onClick={() => navigate('/expense')}>Add new expense</Button>
    </>
  )
}