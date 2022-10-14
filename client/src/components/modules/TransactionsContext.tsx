import React, { createContext, useState, useContext, useEffect } from "react";
import { get } from "../../utilities";
import dayjs from "dayjs";
import { useCategories } from "./CategoriesContext";

// https://www.youtube.com/watch?v=yoxrgfK0JHc

export const initialTransactionsValues = {
  budgetMonth: { month: 0, year: 2022 },
  setBudgetMonth: (_) => {},
  transactions: [],
  setTransactions: (_) => {},
  fetching: true,
  totals: { categories: [], total: 0, totalRemaining: 0 },
};

export const TransactionsContext = createContext(initialTransactionsValues);

type TransactionsProviderProps = {
  children: React.ReactNode;
};

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [budgetMonth, setBudgetMonth] = useState<MonthSelectorState>({ month: 0, year: 2022 });
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [fetching, setFetching] = useState(true);
  const [totals, setTotals] = useState({ categories: [], total: 0, totalRemaining: 0 });
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
          (t) => t.date.getMonth() == budgetMonth.month && t.date.getFullYear() == budgetMonth.year
        )
      );
    });
  };

  useEffect(() => {
    setFetching(false);
  }, [transactions]);

  useEffect(() => {
    refreshTransactions();
  }, [budgetMonth]);

  // Calculate totals
  useEffect(() => {
    let newTotals = { categories: [], total: 0, totalRemaining: 0 };
    let categoryMap = new Map();
    transactions.forEach((t) => {
      if (categoryMap.has(t.category)) {
        categoryMap.set(t.category, t.amount + categoryMap.get(t.category));
      } else {
        categoryMap.set(t.category, t.amount);
      }
      newTotals.total += t.amount;
    });

    let perCategoryData = [];
    categoryMap.forEach((v, k) => {
      let foundCategory: CategoryType = categories.find((c) => c.uuid === k);
      if (foundCategory) {
        let newData = {
          uuid: foundCategory.uuid,
          name: foundCategory.name,
          total: v,
          remaining: foundCategory.monthlyBudget - v,
        };
        newTotals.totalRemaining += newData.remaining;
        perCategoryData.push(newData);
      }
    });
    newTotals.categories = perCategoryData;
    setTotals(newTotals);
  }, [transactions, categories]);

  return (
    <TransactionsContext.Provider
      value={{ budgetMonth, setBudgetMonth, transactions, setTransactions, fetching, totals }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const all = useContext(TransactionsContext);
  return all;
};
