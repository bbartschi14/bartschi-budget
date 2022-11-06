import { useRef } from "react";
import { useCategories, unassignedCategory } from "../categories/CategoriesContext";
import { IconCurrencyDollar, IconAtom2, IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { v4 as uuidv4 } from "uuid";
import { getCSSColor } from "../../../utilities";
import { useTransactions } from "./TransactionsContext";
import { UseFormReturnType } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  NumberInput,
  Select,
  useMantineTheme,
  ActionIcon,
  NumberInputHandlers,
} from "@mantine/core";

type TransactionFormProps = {
  descriptionInput: React.MutableRefObject<HTMLInputElement>;
  form: UseFormReturnType<TransactionType, (values: TransactionType) => TransactionType>;
  budgetMonth: any;
};

const TransactionForm = (props: TransactionFormProps) => {
  // Global state hooks
  const theme = useMantineTheme();
  const { categories } = useCategories();
  const { addTransaction } = useTransactions();

  // Use for custom number input incrementing
  const dateHandlers = useRef<NumberInputHandlers>();

  /**
   * Gather transaction form data and submit to
   * database with new uuid.
   */
  const postTransactionForm = () => {
    let transaction: TransactionType = {
      ...props.form.values,
      uuid: uuidv4(),
    };
    addTransaction(transaction);

    // UX feature, brings focus back to description input
    props.descriptionInput.current.select();
  };

  /**
   * For easier UX, when pressing "Enter" anywhere in the form,
   * try to post form data.
   */
  const handleKeyDownInForm = (event) => {
    event.stopPropagation();
    if (event.key === "Enter") postTransactionForm();
  };

  const getDayMax = () => {
    return new Date(props.budgetMonth.year, props.budgetMonth.month + 1, 0).getDate();
  };

  return (
    <Group spacing={"xs"} grow align={"end"}>
      <TextInput
        label="Description"
        placeholder="Enter description"
        ref={props.descriptionInput}
        {...props.form.getInputProps("name")}
        onKeyDown={handleKeyDownInForm}
      />
      <NumberInput
        label="Amount"
        hideControls
        precision={2}
        icon={<IconCurrencyDollar size={18} />}
        {...props.form.getInputProps("amount")}
        onKeyDown={handleKeyDownInForm}
      />
      <Select
        label="Category"
        searchable
        data={
          categories.length > 0
            ? [
                { value: unassignedCategory.uuid, label: unassignedCategory.name },
                ...categories.map((c) => {
                  return { value: c.uuid, label: c.name };
                }),
              ]
            : [{ value: unassignedCategory.uuid, label: unassignedCategory.name }]
        }
        styles={{
          input: {
            backgroundColor:
              categories.length > 0
                ? theme.fn.lighten(
                    getCSSColor(
                      theme,
                      categories.find((c) => c.uuid == props.form.values.category)?.color
                    ),
                    0.9
                  )
                : "",
          },
        }}
        icon={
          <IconAtom2
            size={14}
            color={
              categories
                ? getCSSColor(
                    theme,
                    categories.find((c) => c.uuid == props.form.values.category)?.color
                  )
                : ""
            }
          />
        }
        {...props.form.getInputProps("category")}
      />
      <Group noWrap={true} spacing={2} align={"flex-end"}>
        <ActionIcon
          tabIndex={-1}
          sx={(theme) => ({ height: "36px" })}
          size={20}
          variant="default"
          onClick={() => dateHandlers.current.decrement()}
        >
          <IconChevronLeft size={14} />
        </ActionIcon>
        <NumberInput
          label={"Day"}
          description={
            "(" +
            (props.form.values.date.getMonth() + 1) +
            "/" +
            props.form.values.date.getDate() +
            "/" +
            props.form.values.date.getFullYear() +
            ")"
          }
          value={props.form.values.date.getDate()}
          onChange={(val) => {
            let clamped = Math.max(1, val);
            clamped = Math.min(getDayMax(), val);
            props.form.setFieldValue(
              "date",
              new Date(props.budgetMonth.year, props.budgetMonth.month, clamped)
            );
          }}
          hideControls
          handlersRef={dateHandlers}
          onKeyDown={handleKeyDownInForm}
          styles={(theme) => ({
            input: {
              textAlign: "center",
            },
          })}
          min={1}
          max={getDayMax()}
        />
        <ActionIcon
          tabIndex={-1}
          sx={(theme) => ({ height: "36px" })}
          size={20}
          variant="default"
          onClick={() => dateHandlers.current.increment()}
        >
          <IconChevronRight size={14} />
        </ActionIcon>
      </Group>

      <Button
        onClick={() => {
          postTransactionForm();
        }}
      >
        {"Add Entry!"}
      </Button>
    </Group>
  );
};

export default TransactionForm;
