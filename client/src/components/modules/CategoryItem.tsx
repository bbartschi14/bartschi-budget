import { Center, Paper, Text } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { useCategories, unassignedCategory } from "./CategoriesContext";

type CategoryItemProps = {
  categoryId: string;
};

const CategoryItem = (props: CategoryItemProps) => {
  const { categories } = useCategories();
  const [categoryData, setCategoryData] = useState<CategoryType>(unassignedCategory);

  useEffect(() => {
    let foundCategory = categories.find((c) => c.uuid == props.categoryId);
    if (foundCategory !== undefined) {
      setCategoryData(foundCategory);
    }
  }, [categories]);

  return (
    <Center>
      <Paper
        style={{
          backgroundColor: categoryData.color,
          borderRadius: "6px",
          padding: "6px 12px",
        }}
        shadow="xs"
      >
        <Text align="center">{categoryData.name}</Text>
      </Paper>
    </Center>
  );
};

export default CategoryItem;
