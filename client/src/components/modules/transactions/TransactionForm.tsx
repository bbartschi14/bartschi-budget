import { useEffect, useState, useRef } from "react";
import { useCategories, unassignedCategory } from "../categories/CategoriesContext";
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
import { IconCurrencyDollar, IconAtom2, IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { v4 as uuidv4 } from "uuid";
import { post } from "../../../utilities";
import { useTransactions } from "./TransactionsContext";

const TransactionForm = ({
  name,
  setName,
  amount,
  setAmount,
  category,
  setCategory,
  date,
  dayOfMonth,
  setDayOfMonth,
  descriptionInput,
}) => {
  const theme = useMantineTheme();
  const handlers = useRef<NumberInputHandlers>();
  const { categories } = useCategories();
  const getCSSColor = (color: string) => {
    if (!color) return "";
    let splitColor = color.split(".");
    return color in theme.colors || splitColor[0] in theme.colors
      ? splitColor.length > 1 && splitColor[1] in theme.colors[splitColor[0]]
        ? theme.colors[splitColor[0]][splitColor[1]]
        : theme.colors[color]
      : color;
  };
  const { addTransaction } = useTransactions();
  const postTransactionForm = () => {
    let transaction: TransactionType = {
      name: name,
      amount: amount,
      uuid: uuidv4(),
      category: category,
      date: date,
    };
    post("/api/transaction", transaction).then((res) => {});
    addTransaction(transaction);
    descriptionInput.current.select();
  };

  return (
    <Group spacing={"xs"} grow align={"end"}>
      <TextInput
        placeholder="Enter description"
        label="Description"
        value={name}
        onChange={(event) => setName(event.currentTarget.value, () => {})}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === "Enter") postTransactionForm();
        }}
        ref={descriptionInput}
      />
      <NumberInput
        label="Amount"
        value={amount}
        onChange={(val) => setAmount(val)}
        hideControls
        precision={2}
        icon={<IconCurrencyDollar size={18} />}
        onKeyDown={(event) => {
          if (event.key === "Enter") postTransactionForm();
        }}
      />
      <Select
        label="Category"
        value={category}
        onChange={setCategory}
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
                    getCSSColor(categories.find((c) => c.uuid == category)?.color),
                    0.9
                  )
                : "",
          },
        }}
        icon={
          <IconAtom2
            size={14}
            color={categories ? getCSSColor(categories.find((c) => c.uuid == category)?.color) : ""}
          />
        }
      />
      <Group noWrap={true} spacing={2} align={"flex-end"}>
        <ActionIcon
          tabIndex={-1}
          sx={(theme) => ({ height: "36px" })}
          size={20}
          variant="default"
          onClick={() => handlers.current.decrement()}
        >
          <IconChevronLeft size={14} />
        </ActionIcon>
        <NumberInput
          label={"Day"}
          description={
            "(" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")"
          }
          value={dayOfMonth}
          onChange={(val) => {
            setDayOfMonth(val);
          }}
          hideControls
          handlersRef={handlers}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              postTransactionForm();
            }
          }}
          styles={(theme) => ({
            input: {
              textAlign: "center",
            },
          })}
        />
        <ActionIcon
          tabIndex={-1}
          sx={(theme) => ({ height: "36px" })}
          size={20}
          variant="default"
          onClick={() => handlers.current.increment()}
        >
          <IconChevronRight size={14} />
        </ActionIcon>
      </Group>

      <Button
        onClick={() => {
          postTransactionForm();
        }}
      >
        Add Entry!
      </Button>
    </Group>
  );
};

export default TransactionForm;
