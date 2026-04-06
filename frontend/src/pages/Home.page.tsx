import { Button } from "@mantine/core";
import ExpenseTable from "../components/ExpenseTable";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Expense Tracker</h1>
      <ExpenseTable />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Button c="black"  onClick={() => navigate('/expense')}>Add new expense</Button>
      </div>
    </>
  )
}