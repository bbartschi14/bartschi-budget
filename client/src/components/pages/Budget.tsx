import React, { useState, useEffect } from "react";
import {
  TextInput,
  NumberInput,
  Group,
  Button,
  ColorInput,
  Modal,
  Stack,
  Badge,
  Anchor,
} from "@mantine/core";
import { IconCurrencyDollar, IconAtom2 } from "@tabler/icons";
import { v4 as uuidv4 } from "uuid";
import { post } from "../../utilities";
import { useCategories } from "../modules/CategoriesContext";
import CategoryCard from "../modules/CategoryCard";

type CategoryEditState = {
  isEditing: boolean;
  category: CategoryType;
};
const Budget = () => {
  const { categories, addCategory, updateCategory } = useCategories();
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue.9");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [opened, setOpened] = useState(false);
  const [editState, setEditState] = useState<CategoryEditState>({
    isEditing: false,
    category: null,
  });

  useEffect(() => {
    if (editState.isEditing) {
      setName(editState.category.name);
      setColor(editState.category.color);
      setMonthlyBudget(editState.category.monthlyBudget);
      setOpened(true);
    }
  }, [editState]);

  const addNew = (category) => {
    console.log("Adding Category: ", category);
    post("/api/category/add", category).then((res) => {
      addCategory(res);
    });
  };

  const updateExisting = (category) => {
    console.log("Updating to category: ", category);
    post("/api/category/update", category).then((res) => {
      updateCategory(res);
    });
  };

  return (
    <Stack>
      <Group spacing={"xs"}>
        <Modal
          opened={opened}
          onClose={() => {
            if (editState.isEditing) {
              setEditState({ isEditing: false, category: null });
            }
            setOpened(false);
          }}
          title={
            editState.isEditing ? "Editing " + editState.category?.name : "Adding new category..."
          }
        >
          <Stack>
            <TextInput
              data-autofocus
              placeholder="Enter category name"
              label="Category Name"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <Group>
              <TextInput
                label="Color"
                value={color}
                onChange={(event) => setColor(event.currentTarget.value)}
              />
              <Stack>
                <Anchor href="https://yeun.github.io/open-color/" target={"_blank"}>
                  View Colors
                </Anchor>
                <Badge color={color}>{"Color"}</Badge>
              </Stack>
            </Group>

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
                  uuid: editState.isEditing ? editState.category.uuid : uuidv4(),
                  color: color,
                };
                if (editState.isEditing) {
                  updateExisting(newCategory);
                } else {
                  addNew(newCategory);
                }
                setOpened(false);
              }}
            >
              {editState.isEditing ? "Edit Category" : "Add Category"}
            </Button>
          </Stack>
        </Modal>
      </Group>
      <Group noWrap={false}>
        {categories.map((c) => {
          return (
            <CategoryCard category={c} key={c.uuid} setEditState={setEditState}></CategoryCard>
          );
        })}
      </Group>
      <Button size={"md"} onClick={() => setOpened(true)} sx={(theme) => ({ alignSelf: "center" })}>
        Create Category
      </Button>
    </Stack>
  );
};

export default Budget;
