import React, { useEffect, useState } from "react";
import AppWrapper from "./modules/AppWapper";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { DatePicker } from "@mantine/dates";
import { IconCurrencyDollar, IconAtom2 } from "@tabler/icons";
import CategoryItem from "./modules/CategoryItem";
import DateItem from "./modules/DateItem";
import { useLocalStorage } from "@mantine/hooks";
import { get, post } from "../utilities";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import { Button, Space, Group, TextInput, NumberInput, Select, Divider } from "@mantine/core";

type TransactionType = {
  _id?: string;
  uuid: string;
  name: string;
  category: number;
  amount: number;
  date: Date;
};

const lightness = 95;
const darkerLightness = 40;

export const categories: CategoryType[] = [
  {
    value: "0",
    label: "Dining",
    color: `hsl(163, 86%, ${lightness}%)`,
    darkColor: `hsl(163, 86%, ${darkerLightness}%)`,
  },
  {
    value: "1",
    label: "Groceries",
    color: `hsl(214, 86%, ${lightness}%)`,
    darkColor: `hsl(214, 86%, ${darkerLightness}%)`,
  },
  {
    value: "2",
    label: "Transportation",
    color: `hsl(246, 86%, ${lightness}%)`,
    darkColor: `hsl(246, 86%, ${darkerLightness}%)`,
  },
  {
    value: "3",
    label: "Donations",
    color: `hsl(13, 86%, ${lightness}%)`,
    darkColor: `hsl(13, 86%, ${darkerLightness}%)`,
  },
];
const Budget = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [amount, setAmount] = useState(0);
  const [date, onDateChange] = useState(new Date());
  const [category, setCategory] = useState<string | null>("0");
  const [name, setName] = useState("");

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "date",
    direction: "asc",
  });

  const reSort = () => {
    if (sortStatus) {
      const data = sortBy(transactions, sortStatus.columnAccessor);
      setTransactions(sortStatus.direction === "desc" ? data.reverse() : data);
    }
  };
  useEffect(() => {
    reSort();
  }, [sortStatus]);

  useEffect(() => {
    reSort();
  }, [transactions]);

  const refreshTransactions = () => {
    get("api/transactions", {}).then((transactions) => {
      setTransactions(
        transactions.map((t) => {
          return Object.assign(t, { date: new Date(t.date), category: t.category.toString() });
        })
      );
      console.log(transactions);
    });
  };

  useEffect(() => {
    refreshTransactions();
  }, []);
  return (
    <AppWrapper>
      <Group spacing={"xs"} grow align={"end"}>
        <TextInput
          placeholder="Enter description"
          label="Description"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <NumberInput
          label="Amount"
          value={amount}
          onChange={(val) => setAmount(val)}
          hideControls
          precision={2}
          icon={<IconCurrencyDollar size={18} />}
        />
        <Select
          label="Category"
          value={category}
          onChange={setCategory}
          searchable
          clearable
          data={categories.map((c) => {
            return { value: c.value, label: c.label };
          })}
          styles={{
            input: {
              backgroundColor: categories.find((c) => c.value == category)?.color,
            },
          }}
          icon={
            <IconAtom2 size={14} color={categories.find((c) => c.value == category)?.darkColor} />
          }
        />
        <DatePicker
          value={date}
          onChange={onDateChange}
          allowFreeInput
          placeholder="Pick date"
          label="Date"
        />
        <Button
          onClick={() => {
            let transaction: TransactionType = {
              name: name,
              amount: amount,
              uuid: uuidv4(),
              category: parseInt(category),
              date: date,
            };
            let transactionTranslated: TransactionType = {
              name: name,
              amount: amount,
              uuid: uuidv4(),
              category: parseInt(category), // @ts-ignore
              date: date.toLocaleDateString(),
            };
            console.log("Adding transaction: ", transactionTranslated);
            post("/api/transaction", transactionTranslated).then((res) =>
              console.log("Add success!")
            );
            setTransactions((prev) => [...prev, transaction]);
          }}
        >
          Post!
        </Button>
      </Group>
      <Divider my="md" variant="dashed" />
      {/* <Space h={"lg"}></Space> */}
      <div>
        <DataTable
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          minHeight={transactions.length > 0 ? 0 : 200}
          withBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          noRecordsText="No transactions yet!"
          records={transactions}
          columns={[
            { accessor: "name", sortable: true },
            { accessor: "amount", title: "Amount ($)", sortable: true },
            {
              accessor: "category",
              sortable: true,
              render: ({ category }) => (
                <CategoryItem category={category.toString()}></CategoryItem>
              ),
            },
            {
              accessor: "date",
              sortable: true,
              render: ({ date }) => <DateItem date={date}></DateItem>,
            },
          ]}
          idAccessor={"uuid"}
          rowContextMenu={{
            items: (transaction) => [
              {
                key: "delete",
                color: "red",
                title: `Delete transaction ${transaction.name}`,
                onClick: () => {
                  post("/api/transactions/delete", transaction).then((res) => {
                    console.log("Delete success!");
                  });
                  setTransactions((prev) => prev.filter((item) => item.uuid !== transaction.uuid));
                },
              },
            ],
          }}
        />
      </div>
    </AppWrapper>
  );
};

export default Budget;
