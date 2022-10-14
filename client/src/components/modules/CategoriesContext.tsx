import React, { createContext, useState, useContext, useEffect } from "react";
import { get } from "../../utilities";

// https://www.youtube.com/watch?v=yoxrgfK0JHc

export const unassignedCategory: CategoryType = {
  uuid: "none",
  name: "Unassigned",
  color: "gray",
  monthlyBudget: 0,
};

export const initialCategoriesValues = {
  categories: [],
  addCategory: (newCategory: CategoryType) => {},
  updateCategory: (newCategory: CategoryType) => {},
};

export const CategoriesContext = createContext(initialCategoriesValues);

type CategoriesProviderProps = {
  children: React.ReactNode;
};

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

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

  useEffect(() => {
    get("api/categories", {}).then((categories) => {
      setCategories(categories);
    });
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, updateCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const all = useContext(CategoriesContext);
  return all;
};
