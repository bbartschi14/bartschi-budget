import { Dispatch, SetStateAction } from "react";
import CategoryCard from "./CategoryCard";
import { Group } from "@mantine/core";
import { useCategories } from "./CategoriesContext";
import { useTransactions } from "../transactions/TransactionsContext";

type CategoryCardsListProps = {
  setEditState: Dispatch<SetStateAction<CategoryEditState>>;
  setDeleteState: Dispatch<SetStateAction<CategoryDeleteState>>;
};

const CategoryCardsList = (props: CategoryCardsListProps) => {
  const { categories } = useCategories();
  const { categoryType } = useTransactions();

  return (
    <Group noWrap={false}>
      {categories
        .filter((c) => c.type === categoryType)
        .map((c) => {
          return (
            <CategoryCard
              key={c.uuid}
              category={c}
              setEditState={props.setEditState}
              setDeleteState={props.setDeleteState}
            ></CategoryCard>
          );
        })}
    </Group>
  );
};

export default CategoryCardsList;
