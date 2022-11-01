import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { get, post } from "../../../utilities";
import create from "zustand";

// https://www.youtube.com/watch?v=yoxrgfK0JHc

export const unassignedCategory: CategoryType = {
  uuid: "none",
  name: "Unassigned",
  color: "gray",
  monthlyBudget: 0,
  type: "monthly",
};

export const initialCategoriesValues = {
  categories: Array<CategoryType>(),
  budgetTotalPerType: new Map<string, number>(),
  addCategory: (newCategory: CategoryType) => {},
  removeCategory: (oldCategory: CategoryType, sendToCategory: CategoryType) => {},
  updateCategory: (newCategory: CategoryType) => {},
  getCategoryByID: (uuid: string): CategoryType => {
    return unassignedCategory;
  },
};

export const CategoriesContext = createContext(initialCategoriesValues);

type CategoriesProviderProps = {
  children: React.ReactNode;
};

/**
 * Manages global categories state and management helpers. Categories don't change
 * very often and are crucial to most components, so React Context has been used.
 */
export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [budgetTotalPerType, setBudgetTotalPerType] = useState(new Map<string, number>());
  const [categoriesByID, setCategoriesByID] = useState(new Map<string, CategoryType>());

  const addCategory = (newCategory: CategoryType) => {
    post("/api/category/add", newCategory).then((res) => {
      setCategories((categories) => [...categories, newCategory]);
    });
  };

  const removeCategory = (oldCategory: CategoryType, sendToCategory: CategoryType) => {
    post("api/category/delete", {
      uuidToDelete: oldCategory.uuid,
      uuidToReplace: sendToCategory.uuid,
    }).then((res) => {
      setCategories((categories) => categories.filter((c) => c.uuid !== oldCategory.uuid));
    });
  };

  const updateCategory = (newCategory: CategoryType) => {
    post("/api/category/update", newCategory).then((res) => {
      setCategories(
        categories.map((c) => {
          return c.uuid === newCategory.uuid ? newCategory : c;
        })
      );
    });
  };

  const getCategoryByID = (uuid: string): CategoryType => {
    return categoriesByID.get(uuid);
  };

  /**
   * Fetch database categories on startup
   */
  useEffect(() => {
    get("api/categories", {}).then((categories) => {
      setCategories(categories);
    });
  }, []);

  /**
   * When categories change, recalculate and cache the budget totals
   * per category type (monthly, yearly), and the uuid->category map
   */
  useEffect(() => {
    // Update uuid -> category map
    let catMap = new Map();
    categories.forEach((c) => catMap.set(c.uuid, c));
    setCategoriesByID(catMap);

    // Update type -> total map
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
      value={{
        categories,
        budgetTotalPerType,
        addCategory,
        updateCategory,
        getCategoryByID,
        removeCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const all = useContext(CategoriesContext);
  return all;
};
