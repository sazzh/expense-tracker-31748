import { useEffect, useState } from "react";
import { Modal, LoadingOverlay, Button, Stack } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import ExpenseForm from "./ExpenseForm";
import type { Expense } from "../types/Expense";
import { getExpense } from "../api/Expenses";
import { ExpenseDetails } from "./ExpenseDetails";
import ErrorAlert from "./ErrorAlert";

interface ExpenseModalProps {
  expenseId: string;
  opened: boolean;
  onClose: () => void;
  initialMode?: "view" | "edit";
}

export default function ExpenseModal({ expenseId, opened, onClose, initialMode = "view" }: ExpenseModalProps) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!opened) return;
    setExpense(null);
    setMode(initialMode);
    
    const fetch = async () => {
      try {
        const data = await getExpense(expenseId);
        setExpense(data);
      } catch {
        setError("Failed to load expense. Please try again later.");
      }
    };
    
    fetch();
  }, [expenseId, opened, initialMode]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === "edit" ? "Edit Expense" : "Expense Details"}
      size="md"
    >
      <LoadingOverlay visible={!expense && !error} />
      <ErrorAlert error={error} centered />

      {expense && (
        <>
          {mode === "view" && (
            <Stack>
              <ExpenseDetails expense={expense} />
              <Button leftSection={<IconEdit />} c="black" w="fit-content" mx="auto" mt="md"
                onClick={() => setMode("edit")}>
                  Edit
              </Button>
            </Stack>
          )}

          {mode === "edit" && (
            <ExpenseForm expense={expense} onSuccess={onClose} />
          )}
        </>
      )}
    </Modal>
  );
}