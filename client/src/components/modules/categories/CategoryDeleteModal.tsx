import { Button, Modal, Select, Stack } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { useCategories } from "./CategoriesContext";
import { Dispatch, SetStateAction } from "react";

type CategoryDeleteModalProps = {
  deleteState: CategoryDeleteState;
  setDeleteState: Dispatch<SetStateAction<CategoryDeleteState>>;
};

/**
 * Displayed to user when wanting to delete a category.
 * Finalizes deletion info and sends API request to remove category.
 */
const CategoryDeleteModal = (props: CategoryDeleteModalProps) => {
  const { categories, getCategoryByID, removeCategory } = useCategories();

  const setDestinationCategory = (newCategoryUUID: string): void => {
    props.setDeleteState((prevState) => ({
      ...prevState,
      sendToCategory: getCategoryByID(newCategoryUUID),
    }));
  };

  const submitModalForm = (event) => {
    removeCategory(props.deleteState.category, props.deleteState.sendToCategory);
    props.setDeleteState({ isDeleting: false, category: null, sendToCategory: null });
  };

  return (
    <Modal
      opened={props.deleteState.isDeleting}
      onClose={() => {
        if (props.deleteState.isDeleting) {
          props.setDeleteState({ isDeleting: false, category: null, sendToCategory: null });
        }
      }}
      title={"Deleting Category: " + props.deleteState.category?.name}
    >
      <Stack>
        <Select
          label="Move transactions to:"
          value={props.deleteState.sendToCategory?.uuid}
          onChange={setDestinationCategory}
          searchable
          data={[
            ...categories
              .filter((c) => c.uuid !== props.deleteState.category?.uuid)
              .map((c) => {
                return { value: c.uuid, label: c.name };
              }),
          ]}
        />
        <Button
          color={"red"}
          leftIcon={<IconTrash size={14} />}
          disabled={props.deleteState.sendToCategory == null}
          onClick={submitModalForm}
        >
          {"Delete"}
        </Button>
      </Stack>
    </Modal>
  );
};

export default CategoryDeleteModal;
