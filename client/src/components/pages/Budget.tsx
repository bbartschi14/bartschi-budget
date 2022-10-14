import React, { useState } from "react";
import { TextInput, NumberInput, Group, Button, ColorInput } from "@mantine/core";
import { IconCurrencyDollar, IconAtom2 } from "@tabler/icons";
import { v4 as uuidv4 } from "uuid";
import { post } from "../../utilities";
import { useCategories } from "../modules/CategoriesContext";

const Budget = () => {
  const { addCategory } = useCategories();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  return (
    <Group spacing={"xs"} grow align={"end"}>
      <TextInput
        placeholder="Enter category name"
        label="Category Name"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <ColorInput label="Color" value={color} onChange={setColor} />
      <NumberInput
        label="Monthly Budget"
        value={monthlyBudget}
        onChange={(val) => setMonthlyBudget(val)}
        hideControls
        precision={2}
        icon={<IconCurrencyDollar size={18} />}
      />
      <Button
        onClick={() => {
          let newCategory: CategoryType = {
            name: name,
            monthlyBudget: monthlyBudget,
            uuid: uuidv4(),
            color: color,
          };
          console.log("Adding Category: ", newCategory);
          post("/api/category", newCategory).then((res) => {
            addCategory(res);
          });
        }}
      >
        Add Category
      </Button>
    </Group>
  );
};

export default Budget;
