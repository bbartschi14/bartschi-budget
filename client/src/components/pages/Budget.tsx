import { useState, useEffect } from "react";
import { Button, Stack } from "@mantine/core";
import CategoryModal from "../modules/categories/CategoryModal";
import CategoryDeleteModal from "../modules/categories/CategoryDeleteModal";
import { useForm } from "@mantine/form";
import BudgetHeader from "../modules/categories/BudgetHeader";
import CategoryCardsList from "../modules/categories/CategoryCardsList";

const Budget = () => {
  // Manage action states (editing, deleting) for modal opening flow
  const [editState, setEditState] = useState<CategoryEditState>({
    state: "closed",
    category: null,
  });
  const [deleteState, setDeleteState] = useState<CategoryDeleteState>({
    isDeleting: false,
    category: null,
    sendToCategory: null,
  });

  const form = useForm<CategoryType>({
    initialValues: { name: "", color: "blue.9", monthlyBudget: 0, type: "Monthly" },
  });

  // Match form state to action (i.e. copy values for editing, remove values when closing)
  useEffect(() => {
    if (editState.state === "editing") {
      form.setValues({ ...editState.category });
    } else if (editState.state == "closed") {
      form.reset();
    }
  }, [editState]);

  return (
    <>
      <Stack>
        <BudgetHeader />
        <CategoryCardsList setEditState={setEditState} setDeleteState={setDeleteState} />
        <Button
          size={"md"}
          onClick={() => setEditState({ ...editState, state: "adding" })}
          sx={(theme) => ({ alignSelf: "center" })}
        >
          {"Create Category"}
        </Button>
      </Stack>

      {/* MODALS */}
      <CategoryModal editState={editState} setEditState={setEditState} form={form} />
      <CategoryDeleteModal deleteState={deleteState} setDeleteState={setDeleteState} />
    </>
  );
};

export default Budget;
