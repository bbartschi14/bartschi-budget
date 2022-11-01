import React, { createContext, useState, useContext, useEffect } from "react";
import { get } from "../../../utilities";
import dayjs from "dayjs";
import { useCategories } from "../categories/CategoriesContext";

// https://www.youtube.com/watch?v=yoxrgfK0JHc

export const initialTransactionsValues = {
  budgetMonth: { month: 0, year: 2022 },
  setBudgetMonth: (_) => {},
  transactions: [],
  setTransactions: (_) => {},
  addTransaction: (newTransaction: TransactionType) => {},
  fetching: true,
  totals: { categories: [], totalPerType: new Map(), totalRemainingPerType: new Map() },
  categoryType: "Monthly",
  setCategoryType: (_) => {},
};

export const TransactionsContext = createContext(initialTransactionsValues);

type TransactionsProviderProps = {
  children: React.ReactNode;
};

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

  const addTransaction = (newTransaction: TransactionType) => {
    if (categories.find((c) => c.uuid === newTransaction.category)?.type == categoryType) {
      setTransactions((prev) => [...prev, newTransaction]);
    }
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
