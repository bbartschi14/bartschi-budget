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
import {
  Button,
  Space,
  Group,
  TextInput,
  NumberInput,
  Select,
  Divider,
  Tabs,
  Stack,
} from "@mantine/core";
import { useStateCallback } from "use-state-callback";
import { CategoriesProvider } from "./modules/CategoriesContext";
import { useCategories, unassignedCategory } from "./modules/CategoriesContext";
import Budget from "./pages/Budget";

// const lightness = 95;
// const darkerLightness = 40;

// export const categories: CategoryType[] = [
//   {
//     value: "0",
//     label: "Dining",
//     color: `hsl(163, 86%, ${lightness}%)`,
//     darkColor: `hsl(163, 86%, ${darkerLightness}%)`,
//   },
//   {
//     value: "1",
//     label: "Groceries",
//     color: `hsl(214, 86%, ${lightness}%)`,
//     darkColor: `hsl(214, 86%, ${darkerLightness}%)`,
//   },
//   {
//     value: "2",
//     label: "Transportation",
//     color: `hsl(246, 86%, ${lightness}%)`,
//     darkColor: `hsl(246, 86%, ${darkerLightness}%)`,
//   },
//   {
//     value: "3",
//     label: "Donations",
//     color: `hsl(13, 86%, ${lightness}%)`,
//     darkColor: `hsl(13, 86%, ${darkerLightness}%)`,
//   },
// ];

const Transactions = () => {
  const [transactions, setTransactions] = useStateCallback<TransactionType[]>([]);
  const [amount, setAmount] = useState(0);
  const [date, onDateChange] = useState(new Date());
  const [category, setCategory] = useState<string | null>(unassignedCategory.uuid);
  const [name, setName] = useState("");
  const [tab, setTab] = useState(0);
  const { categories } = useCategories();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "date",
    direction: "asc",
  });

  const reSort = (updatedTransactions) => {
    if (sortStatus) {
      const data = sortBy(updatedTransactions, sortStatus.columnAccessor);
      setTransactions(sortStatus.direction === "desc" ? data.reverse() : data, (newState) => {});
    }
  };

  useEffect(() => {
    reSort(transactions);
  }, [sortStatus]);

  const refreshTransactions = () => {
    get("api/transactions", {}).then((transactions) => {
      setTransactions(
        transactions.map((t) => {
          return Object.assign(t, { date: new Date(t.date), category: t.category });
        }),
        (updatedTransactions) => {
          reSort(updatedTransactions);
        }
      );
    });
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  return (
    <AppWrapper selectedTab={tab} setTab={setTab}>
      <Tabs value={tab.toString()}>
        <Tabs.Panel value={"0"}>
          <Stack>
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
                data={
                  categories.length > 0
                    ? categories.map((c) => {
                        return { value: c.uuid, label: c.name };
                      })
                    : [{ value: unassignedCategory.uuid, label: unassignedCategory.name }]
                }
                styles={{
                  input: {
                    backgroundColor:
                      categories.length > 0
                        ? categories.find((c) => c.uuid == category)?.color
                        : "",
                  },
                }}
                icon={
                  <IconAtom2
                    size={14}
                    color={categories ? categories.find((c) => c.uuid == category)?.color : ""}
                  />
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
                    category: category,
                    date: date,
                  };
                  let transactionTranslated: TransactionType = {
                    name: name,
                    amount: amount,
                    uuid: uuidv4(),
                    category: category, // @ts-ignore
                    date: date.toLocaleDateString(),
                  };
                  // console.log("Adding transaction: ", transactionTranslated);
                  post("/api/transaction", transactionTranslated).then((res) => {});
                  setTransactions(
                    (prev) => [...prev, transaction],
                    (updatedTransactions) => {
                      reSort(updatedTransactions);
                    }
                  );
                }}
              >
                Post!
              </Button>
            </Group>
            <Divider my="md" variant="dashed" />
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
                    render: ({ category }) => <CategoryItem categoryId={category}></CategoryItem>,
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
                      color: "red", // @ts-ignore
                      title: `Delete transaction ${transaction.name}`,
                      onClick: () => {
                        post("/api/transactions/delete", transaction).then((res) => {
                          console.log("Delete success!");
                        });
                        setTransactions(
                          // @ts-ignore
                          (prev) => prev.filter((item) => item.uuid !== transaction.uuid)
                        );
                      },
                    },
                  ],
                }}
              />
            </div>
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value={"1"}>
          <Stack>
            <Budget></Budget>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </AppWrapper>
  );
};

export default Transactions;
