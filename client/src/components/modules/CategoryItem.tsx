import { Badge, Center, Paper, Text } from "@mantine/core";
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
  }, [categories, props.categoryId]);

  return (
    <Center>
      <Badge
        color={categoryData.color}
        size="md"
        styles={{ root: { boxShadow: "#CCCCCC 1px 1px 2px" } }}
        variant="light"
      >
        {categoryData.name}
      </Badge>
    </Center>
  );
};

export default CategoryItem;
