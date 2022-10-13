import { Center, Paper, Text } from "@mantine/core";
import React from "react";
import { categories } from "../App";

type CategoryItemProps = {
  category: string;
};

const CategoryItem = (props: CategoryItemProps) => {
  return (
    <Center>
      <Paper
        style={{
          backgroundColor: categories.find((c) => c.value == props.category).color,
          borderRadius: "6px",
          padding: "6px 12px",
        }}
        shadow="xs"
      >
        <Text align="center">{categories.find((c) => c.value == props.category).label}</Text>
      </Paper>
    </Center>
  );
};

export default CategoryItem;
