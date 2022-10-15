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
  SegmentedControl,
  Text,
  Select,
} from "@mantine/core";
import { IconCurrencyDollar, IconAtom2, IconTrash } from "@tabler/icons";
import { v4 as uuidv4 } from "uuid";
import { post } from "../../utilities";
import { useCategories } from "../modules/CategoriesContext";
import CategoryCard from "../modules/CategoryCard";
import { useTransactions } from "../modules/TransactionsContext";

type CategoryEditState = {
  isEditing: boolean;
  category: CategoryType;
};
type CategoryDeleteState = {
  isDeleting: boolean;
  category: CategoryType;
  sendToCategory: CategoryType;
};
const Budget = () => {
  const { categories, addCategory, updateCategory, budgetTotalPerType, removeCategory } =
    useCategories();
  const { categoryType } = useTransactions();
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue.9");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [type, setType] = useState("Monthly");
  const [opened, setOpened] = useState(false);
  const [editState, setEditState] = useState<CategoryEditState>({
    isEditing: false,
    category: null,
  });
  const [deleteState, setDeleteState] = useState<CategoryDeleteState>({
    isDeleting: false,
    category: null,
    sendToCategory: null,
  });

  useEffect(() => {
    if (editState.isEditing) {
      setName(editState.category.name);
      setColor(editState.category.color);
      setMonthlyBudget(editState.category.monthlyBudget);
      setType(editState.category.type);
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

  const setDeleteNewCategory = (newCategoryUUID: string) => {
    setDeleteState((prevState) => ({
      ...prevState,
      sendToCategory: categories.find((c) => c.uuid === newCategoryUUID),
    }));
  };

  return (
    <Stack>
      <Group>
        <Text size={"lg"} weight={"bold"}>
          {"Monthly Budget :"}
        </Text>
        <Text size={"lg"} weight={"normal"}>
          {budgetTotalPerType.get("Monthly")?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </Group>
      <Group>
        <Text size={"lg"} weight={"bold"}>
          {"Yearly Items Budget :"}
        </Text>
        <Text size={"lg"} weight={"normal"}>
          {budgetTotalPerType.get("Yearly")?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </Group>
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
              label="Budget"
              value={monthlyBudget}
              onChange={(val) => setMonthlyBudget(val)}
              hideControls
              precision={2}
              icon={<IconCurrencyDollar size={18} />}
            />
            <SegmentedControl
              value={type}
              onChange={setType}
              data={[
                { label: "Monthly", value: "Monthly" },
                { label: "Yearly", value: "Yearly" },
              ]}
            />
            <Button
              onClick={() => {
                let newCategory: CategoryType = {
                  name: name,
                  monthlyBudget: monthlyBudget,
                  uuid: editState.isEditing ? editState.category.uuid : uuidv4(),
                  color: color,
                  type: type,
                };
                if (editState.isEditing) {
                  updateExisting(newCategory);
                  setEditState({ isEditing: false, category: null });
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
        <Modal
          opened={deleteState.isDeleting}
          onClose={() => {
            if (deleteState.isDeleting) {
              setDeleteState({ isDeleting: false, category: null, sendToCategory: null });
            }
          }}
          title={"Deleting Category: " + deleteState.category?.name}
        >
          <Stack>
            <Select
              label="Move transactions to:"
              value={deleteState.sendToCategory?.uuid}
              onChange={setDeleteNewCategory}
              searchable
              data={[
                ...categories
                  .filter((c) => c.uuid !== deleteState.category?.uuid)
                  .map((c) => {
                    return { value: c.uuid, label: c.name };
                  }),
              ]}
            />
            <Button
              color={"red"}
              leftIcon={<IconTrash size={14} />}
              disabled={deleteState.sendToCategory == null}
              onClick={() => {
                post("api/category/delete", {
                  uuidToDelete: deleteState.category.uuid,
                  uuidToReplace: deleteState.sendToCategory.uuid,
                }).then((res) => {
                  removeCategory(deleteState.category);
                });
                if (deleteState.isDeleting) {
                  setDeleteState({ isDeleting: false, category: null, sendToCategory: null });
                }
              }}
            >
              Delete
            </Button>
          </Stack>
        </Modal>
      </Group>
      <Group noWrap={false}>
        {categories
          .filter((c) => c.type === categoryType)
          .map((c) => {
            return (
              <CategoryCard
                category={c}
                key={c.uuid}
                setEditState={setEditState}
                setDeleteState={setDeleteState}
              ></CategoryCard>
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
