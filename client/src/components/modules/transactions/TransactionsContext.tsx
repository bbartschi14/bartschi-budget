import React, { createContext, useState, useContext, useEffect } from "react";
import { get, post } from "../../../utilities";
import dayjs from "dayjs";
import { useCategories } from "../categories/CategoriesContext";
import { showNotification, hideNotification } from "@mantine/notifications";
import { IconCheck, IconCornerUpLeft, IconTrash, IconX } from "@tabler/icons";
import { ActionIcon, Group, Space, Text, Tooltip } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

// https://www.youtube.com/watch?v=yoxrgfK0JHc

export const initialTransactionsValues = {
  budgetMonth: { month: 0, year: 2022 },
  setBudgetMonth: (_) => {},
  transactions: [],
  setTransactions: (_) => {},
  addTransaction: (newTransaction: TransactionType) => {},
  deleteTransaction: (transaction: TransactionType) => {},
  fetching: true,
  totals: { categories: [], totalPerType: new Map(), totalRemainingPerType: new Map() },
  categoryType: "Monthly",
  setCategoryType: (_) => {},
  user: "Ben",
  setUser: (_) => {},
};

export const TransactionsContext = createContext(initialTransactionsValues);

type TransactionsProviderProps = {
  children: React.ReactNode;
};

const successfulNotificationColor = "green.5";

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [budgetMonth, setBudgetMonth] = useState<MonthSelectorState>({ month: 0, year: 2022 });
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [fetching, setFetching] = useState(true);
  const [categoryType, setCategoryType] = useState("Monthly");
  const [totals, setTotals] = useState({
    categories: [],
    totalPerType: new Map(),
    totalRemainingPerType: new Map(),
  });
  const { categories } = useCategories();

  const [user, setUser] = useLocalStorage({ key: "user", defaultValue: "Ben" });

  useEffect(() => {
    setBudgetMonth({ month: dayjs().month(), year: dayjs().year() });
  }, []);

  const refreshTransactions = () => {
    setFetching(true);
    get("api/transactions", {}).then((transactions) => {
      let allTransactions = transactions.map((t) => {
        return Object.assign(t, { date: new Date(t.date), category: t.category });
      });
      setTransactions(
        allTransactions.filter(
          (t) =>
            (categoryType == "Monthly"
              ? t.date.getMonth() == budgetMonth.month && t.date.getFullYear() == budgetMonth.year
              : t.date.getFullYear() == budgetMonth.year) &&
            categories.find((c) => c.uuid === t.category)?.type == categoryType
        )
      );
    });
  };

  const showSuccessfulAddNotification = (newTransaction: TransactionType) => {
    const category = categories.find((c) => c.uuid === newTransaction.category);
    showNotification({
      id: `added_${newTransaction.uuid}`,
      icon: <IconCheck size={18} />,
      color: successfulNotificationColor,
      title: (
        <Group position="apart">
          <Group spacing={4}>
            {/* WARNING given if adding a yearly transaction when looking at monthly and vice versa */}
            {category.type !== categoryType && <Text>{`(${category.type.toUpperCase()}) `}</Text>}
            <Text>{"Transaction Added : "}</Text>
            <Text>
              {newTransaction.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
            <Space />
          </Group>
          <Tooltip label="Undo">
            <ActionIcon
              onClick={() => {
                deleteTransaction(newTransaction);
                hideNotification(`added_${newTransaction.uuid}`);
              }}
              variant="light"
              color="red"
            >
              <IconCornerUpLeft size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
      message: (
        <Group spacing={"xs"}>
          <Text color={category?.color} weight="bold">
            {category?.name}
          </Text>
          <Text italic={true}>{`( ${newTransaction.name} )`}</Text>
        </Group>
      ),
    });
  };

  const showFailedAddNotification = (newTransaction: TransactionType) => {
    showNotification({
      icon: <IconX size={18} />,
      title: "Add Failed",
      message: "Check internet connection or server",
      color: "red",
    });
  };

  const showSuccessfulDeleteNotification = (transaction: TransactionType) => {
    const category = categories.find((c) => c.uuid === transaction.category);
    showNotification({
      id: `deleted_${transaction.uuid}`,
      icon: <IconTrash size={18} />,
      color: successfulNotificationColor,
      title: (
        <Group position="apart">
          <Group spacing={4}>
            {category.type !== categoryType ? (
              <Text>{`(${category.type.toUpperCase()}) `}</Text>
            ) : (
              <></>
            )}
            <Text italic={true}>{"Transaction Deleted : "}</Text>
            <Text>
              {transaction.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
            <Space />
          </Group>
          <Tooltip label="Undo">
            <ActionIcon
              onClick={() => {
                addTransaction(transaction);
                hideNotification(`deleted_${transaction.uuid}`);
              }}
              variant="light"
              color="green"
            >
              <IconCornerUpLeft size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
      message: (
        <Group spacing={"xs"}>
          <Text color={category?.color} weight="bold">
            {category?.name}
          </Text>
          <Text italic={true}>{`( ${transaction.name} )`}</Text>
        </Group>
      ),
    });
  };

  const addTransaction = (newTransaction: TransactionType) => {
    newTransaction.user = user;
    post("/api/transaction", newTransaction)
      .then((res) => {
        showSuccessfulAddNotification(newTransaction);
      })
      .catch((err) => {
        removeLocalTransaction(newTransaction);
        showFailedAddNotification(newTransaction);
      });

    if (categories.find((c) => c.uuid === newTransaction.category)?.type == categoryType) {
      setTransactions((prev) => [...prev, newTransaction]);
    }
  };

  const removeLocalTransaction = (transaction: TransactionType) => {
    setTransactions((prev) => prev.filter((item) => item.uuid !== transaction.uuid));
  };

  const deleteTransaction = (transaction: TransactionType) => {
    post("/api/transactions/delete", transaction).then((res) => {
      showSuccessfulDeleteNotification(transaction);
    });
    removeLocalTransaction(transaction);
  };

  useEffect(() => {
    setFetching(false);
  }, [transactions]);

  useEffect(() => {
    refreshTransactions();
  }, [budgetMonth, categories, categoryType]);

  // Calculate totals
  useEffect(() => {
    let newTotals = { categories: [], totalPerType: new Map(), totalRemainingPerType: new Map() };
    let categoryMap = new Map();
    categories.forEach((c) => categoryMap.set(c.uuid, 0));
    transactions.forEach((t) => {
      if (categoryMap.has(t.category)) {
        categoryMap.set(t.category, t.amount + categoryMap.get(t.category));
      } else {
        categoryMap.set(t.category, t.amount);
      }
    });

    let perCategoryData = [];
    categoryMap.forEach((v, k) => {
      let foundCategory: CategoryType = categories.find((c) => c.uuid === k);
      if (foundCategory) {
        let newData = {
          uuid: foundCategory.uuid,
          name: foundCategory.name,
          type: foundCategory.type,
          color: foundCategory.color,
          total: v,
          remaining: foundCategory.monthlyBudget - v,
        };

        if (newTotals.totalPerType.has(foundCategory.type)) {
          newTotals.totalPerType.set(
            foundCategory.type,
            newTotals.totalPerType.get(foundCategory.type) + newData.total
          );
        } else {
          newTotals.totalPerType.set(foundCategory.type, newData.total);
        }

        if (newTotals.totalRemainingPerType.has(foundCategory.type)) {
          newTotals.totalRemainingPerType.set(
            foundCategory.type,
            newTotals.totalRemainingPerType.get(foundCategory.type) + newData.remaining
          );
        } else {
          newTotals.totalRemainingPerType.set(foundCategory.type, newData.remaining);
        }
        perCategoryData.push(newData);
      }
    });
    newTotals.categories = perCategoryData;
    setTotals(newTotals);
  }, [transactions]);

  return (
    <TransactionsContext.Provider
      value={{
        budgetMonth,
        setBudgetMonth,
        transactions,
        setTransactions,
        fetching,
        totals,
        categoryType,
        setCategoryType,
        addTransaction,
        deleteTransaction,
        user,
        setUser,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const all = useContext(TransactionsContext);
  return all;
};
