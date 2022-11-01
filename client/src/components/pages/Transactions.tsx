import { useEffect, useState, useRef } from "react";
import { Divider, Stack } from "@mantine/core";
import { useStateCallback } from "use-state-callback";

import { unassignedCategory } from "../modules/categories/CategoriesContext";

import { useTransactions } from "../modules/transactions/TransactionsContext";
import TransactionForm from "../modules/transactions/TransactionForm";
import TransactionsTable from "../modules/transactions/TransactionsTable";

const Transactions = () => {
  const { budgetMonth } = useTransactions();

  // Form state
  const [name, setName] = useStateCallback("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<string | null>(unassignedCategory.uuid);
  const [date, onDateChange] = useState(new Date());
  const [dayOfMonth, setDayOfMonth] = useState(new Date().getDate());
  const descriptionInput = useRef<HTMLInputElement>();

  // Keep date state updated based on possible inputs
  useEffect(() => {
    onDateChange(new Date(budgetMonth.year, budgetMonth.month, dayOfMonth));
  }, [dayOfMonth, budgetMonth]);

  return (
    <Stack>
      <TransactionForm
        name={name}
        setName={setName}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        date={date}
        dayOfMonth={dayOfMonth}
        setDayOfMonth={setDayOfMonth}
        descriptionInput={descriptionInput}
      />
      <Divider my="sm" variant="dashed" />
      <TransactionsTable
        setName={setName}
        setAmount={setAmount}
        setCategory={setCategory}
        setDayOfMonth={setDayOfMonth}
        descriptionInput={descriptionInput}
      />
      <div style={{ height: "300px" }}></div>
    </Stack>
  );
};

export default Transactions;
