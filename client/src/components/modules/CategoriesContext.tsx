import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { get } from "../../utilities";

// https://www.youtube.com/watch?v=yoxrgfK0JHc

export const unassignedCategory: CategoryType = {
  uuid: "none",
  name: "Unassigned",
  color: "gray",
  monthlyBudget: 0,
  type: "monthly",
};

export const initialCategoriesValues = {
  categories: [],
  addCategory: (newCategory: CategoryType) => {},
  updateCategory: (newCategory: CategoryType) => {},
  budgetTotalPerType: new Map(),
  getCategoryByID: (uuid: string): CategoryType => {
    return unassignedCategory;
  },
};

export const CategoriesContext = createContext(initialCategoriesValues);

type CategoriesProviderProps = {
  children: React.ReactNode;
};

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [budgetTotalPerType, setBudgetTotalPerType] = useState(new Map());

  const [categoriesByID, setCategoriesByID] = useState(new Map());

  const addCategory = (newCategory: CategoryType) => {
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (newCategory: CategoryType) => {
    setCategories(
      categories.map((c) => {
        return c.uuid === newCategory.uuid ? newCategory : c;
      })
    );
  };

  const getCategoryByID = (uuid: string): CategoryType => {
    return categoriesByID.get(uuid);
  };

  useEffect(() => {
    get("api/categories", {}).then((categories) => {
      setCategories(categories);
    });
  }, []);

  useEffect(() => {
    let catMap = new Map();
    categories.forEach((c) => catMap.set(c.uuid, c));
    setCategoriesByID(catMap);

    let newBudgetTotals = new Map();
    categories.forEach((c) => {
      if (newBudgetTotals.has(c.type)) {
        newBudgetTotals.set(c.type, c.monthlyBudget + newBudgetTotals.get(c.type));
      } else {
        newBudgetTotals.set(c.type, c.monthlyBudget);
      }
    });
    setBudgetTotalPerType(newBudgetTotals);
  }, [categories]);

  return (
    <CategoriesContext.Provider
      value={{ categories, addCategory, updateCategory, budgetTotalPerType, getCategoryByID }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const all = useContext(CategoriesContext);
  return all;
};
