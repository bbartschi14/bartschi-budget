import { useEffect, useRef } from "react";
import { Divider, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { unassignedCategory } from "../modules/categories/CategoriesContext";
import { useTransactions } from "../modules/transactions/TransactionsContext";
import TransactionForm from "../modules/transactions/TransactionForm";
import TransactionsTable from "../modules/transactions/TransactionsTable";

/**
 * Page for viewing and editing transactions for month/year
 */
const Transactions = () => {
  const { budgetMonth } = useTransactions();

  // Form state
  const newTransactionForm = useForm<TransactionType>({
    initialValues: {
      name: "",
      amount: 0,
      category: unassignedCategory.uuid,
      date: new Date(),
    },
  });

  const descriptionInput = useRef<HTMLInputElement>();

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Keep date state updated based on year and month states
  useEffect(() => {
    let newDay = newTransactionForm.values.date.getDate();
    newDay = Math.min(getDaysInMonth(budgetMonth.year, budgetMonth.month), newDay);
    newTransactionForm.setFieldValue("date", new Date(budgetMonth.year, budgetMonth.month, newDay));
  }, [budgetMonth]);

  /**
   * Copies an existing transaction to the input form. Used to easily
   * make variants of similar purchases.
   * @param transaction input to copy
   */
  const copyTransactionToForm = (transaction: TransactionType): void => {
    newTransactionForm.setValues({ ...transaction });
    descriptionInput.current.focus();
  };

  return (
    <Stack>
      <TransactionForm
        budgetMonth={budgetMonth}
        form={newTransactionForm}
        descriptionInput={descriptionInput}
      />
      <Divider my="sm" variant="dashed" />
      <TransactionsTable copyTransactionToForm={copyTransactionToForm} />

      {/* Scrollbar buffer for footer */}
      <div style={{ height: "300px" }}></div>
    </Stack>
  );
};

export default Transactions;
