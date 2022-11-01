import {
  TextInput,
  NumberInput,
  Group,
  Button,
  Modal,
  Stack,
  Badge,
  Anchor,
  SegmentedControl,
} from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturnType } from "@mantine/form";
import { IconCurrencyDollar } from "@tabler/icons";
import { Dispatch, SetStateAction } from "react";
import { useCategories } from "../categories/CategoriesContext";

type CategoryModalProps = {
  form: UseFormReturnType<CategoryType, (values: CategoryType) => CategoryType>;
  editState: CategoryEditState;
  setEditState: Dispatch<SetStateAction<CategoryEditState>>;
};

/**
 * Displayed to user when wanting to add or edit a category.
 */
const CategoryModal = (props: CategoryModalProps) => {
  const { addCategory, updateCategory } = useCategories();

  const submitModalForm = (event) => {
    let newCategory: CategoryType = {
      ...props.form.values,
      uuid: uuidv4(),
    };

    if (props.editState.state === "editing") {
      // Use existing uuid when editing
      updateCategory({ ...newCategory, uuid: props.editState.category.uuid });
    } else {
      addCategory(newCategory);
    }
    props.setEditState({ state: "closed", category: null });
  };

  return (
    <Modal
      opened={props.editState.state !== "closed"}
      onClose={() => {
        props.setEditState({ category: null, state: "closed" });
      }}
      title={
        props.editState.state === "editing"
          ? "Editing " + props.editState.category?.name
          : "Adding new category..."
      }
    >
      <form>
        <Stack>
          <TextInput
            data-autofocus
            placeholder="Enter category name"
            label="Category Name"
            {...props.form.getInputProps("name")}
          />
          <Group>
            <TextInput label="Color" {...props.form.getInputProps("color")} />
            <Stack>
              <Anchor href="https://yeun.github.io/open-color/" target={"_blank"}>
                {"View Colors"}
              </Anchor>
              <Badge color={props.form.values.color}>{"Color"}</Badge>
            </Stack>
          </Group>

          <NumberInput
            label="Budget"
            {...props.form.getInputProps("monthlyBudget")}
            hideControls
            precision={2}
            icon={<IconCurrencyDollar size={18} />}
          />
          <SegmentedControl
            {...props.form.getInputProps("type")}
            data={[
              { label: "Monthly", value: "Monthly" },
              { label: "Yearly", value: "Yearly" },
            ]}
          />
          <Button onClick={submitModalForm}>
            {props.editState.state === "editing" ? "Edit Category" : "Add Category"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default CategoryModal;
