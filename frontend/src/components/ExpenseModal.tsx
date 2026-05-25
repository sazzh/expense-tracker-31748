import { useEffect, useState } from "react";
import { Modal, LoadingOverlay, Button, Group } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import ExpenseForm from "./ExpenseForm";
import type { Expense } from "../types/Expense";
import { getExpense } from "../api/Expenses";

interface ExpenseModalProps {
  expenseId: string;
  opened: boolean;
  onClose: () => void;
  initialMode?: "view" | "edit";
}

export default function ExpenseModal({ expenseId, opened, onClose, initialMode = "view" }: ExpenseModalProps) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [mode, setMode] = useState<"view" | "edit">(initialMode);

  useEffect(() => {
    if (!opened) return;
    setExpense(null);
    setMode(initialMode);
    
    const fetch = async () => {
      const data = await getExpense(expenseId);
      setExpense(data);
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
      <LoadingOverlay visible={!expense} />

      {expense && (
        <>
          {mode === "view" && (
            <Group justify="flex-end" mb="sm">
              <Button
                leftSection={<IconEdit size={16} />}
                variant="light"
                onClick={() => setMode("edit")}
              >
                Edit
              </Button>
            </Group>
          )}

          {mode === "edit" && (
            <ExpenseForm expense={expense} onSuccess={onClose} />
          )}
        </>
      )}
    </Modal>
  );
}