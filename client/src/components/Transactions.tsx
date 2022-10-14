import React, { useEffect, useState } from "react";
import AppWrapper from "./modules/AppWapper";
import { v4 as uuidv4 } from "uuid";
import { DatePicker } from "@mantine/dates";
import { IconCurrencyDollar, IconAtom2 } from "@tabler/icons";
import CategoryItem from "./modules/CategoryItem";
import DateItem from "./modules/DateItem";
import { post } from "../utilities";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import {
  Button,
  Group,
  TextInput,
  NumberInput,
  Select,
  Divider,
  Tabs,
  Stack,
  useMantineTheme,
  Text,
  Table,
  Center,
} from "@mantine/core";
import { useStateCallback } from "use-state-callback";
import { useCategories, unassignedCategory } from "./modules/CategoriesContext";
import Budget from "./pages/Budget";
import { useTransactions } from "./modules/TransactionsContext";

const Transactions = () => {
  const theme = useMantineTheme();

  const getCSSColor = (color: string) => {
    if (!color) return "";
    let splitColor = color.split(".");
    return color in theme.colors || splitColor[0] in theme.colors
      ? splitColor.length > 1 && splitColor[1] in theme.colors[splitColor[0]]
        ? theme.colors[splitColor[0]][splitColor[1]]
        : theme.colors[color]
      : color;
  };

  const { budgetMonth, transactions, setTransactions, fetching, totals } = useTransactions();
  const [localTransactions, setLocalTransactions] = useStateCallback<TransactionType[]>([]);
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
      setLocalTransactions(
        sortStatus.direction === "desc" ? data.reverse() : data,
        (newState) => {}
      );
    }
  };

  useEffect(() => {
    reSort(transactions);
  }, [sortStatus, transactions]);

  const postTransactionForm = () => {
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
    post("/api/transaction", transactionTranslated).then((res) => {});
    setTransactions((prev) => [...prev, transaction]);
  };

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
                onKeyDown={(event) => {
                  if (event.key === "Enter") postTransactionForm();
                }}
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
                    color={
                      categories
                        ? getCSSColor(categories.find((c) => c.uuid == category)?.color)
                        : ""
                    }
                  />
                }
              />
              <DatePicker
                value={date}
                onChange={onDateChange}
                allowFreeInput
                placeholder="Pick date"
                label="Date"
                onKeyDown={(event) => {
                  if (event.key === "Enter") postTransactionForm();
                }}
              />
              <Button
                onClick={() => {
                  postTransactionForm();
                }}
              >
                Post!
              </Button>
            </Group>
            <Divider my="md" variant="dashed" />
            <div>
              <DataTable
                fetching={fetching}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={localTransactions.length > 0 ? 0 : 200}
                withBorder
                borderRadius="sm"
                withColumnBorders
                striped
                highlightOnHover
                noRecordsText="No transactions yet!"
                records={localTransactions}
                columns={[
                  { accessor: "name", sortable: true, width: 200, textAlignment: "right" },
                  {
                    width: 140,
                    accessor: "amount",
                    title: "Amount ($)",
                    sortable: true,
                    render: ({ amount }) => (
                      <Text>
                        {amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Text>
                    ),
                  },
                  {
                    width: 160,
                    accessor: "category",
                    sortable: true,
                    render: ({ category }) => <CategoryItem categoryId={category}></CategoryItem>,
                  },
                  {
                    width: 140,
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
            <Center inline>
              <Table
                highlightOnHover
                striped
                withColumnBorders
                withBorder
                sx={(theme) => ({
                  display: "inline-block",
                  width: "inherit",
                })}
              >
                <thead>
                  <tr>
                    <th></th>
                    <th style={{ width: "100px", textAlign: "center" }}>Spent</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Text size={"xl"} weight={"bold"} align={"right"}>
                        {"Monthly Total"}
                      </Text>
                    </td>
                    <td style={{ width: "100px", textAlign: "center" }}>
                      {totals.total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td
                      style={{
                        width: "100px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color:
                          totals.totalRemaining > 0 ? theme.colors.green[7] : theme.colors.red[7],
                      }}
                    >
                      {totals.totalRemaining.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                  {totals.categories.map((c) => {
                    return (
                      <tr key={c.uuid}>
                        <td style={{ textAlign: "right" }}>
                          <CategoryItem categoryId={c.uuid}></CategoryItem>
                        </td>
                        <td style={{ width: "100px", textAlign: "center" }}>
                          {c.total.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </td>
                        <td
                          style={{
                            width: "100px",
                            textAlign: "center",
                            fontWeight: "bold",
                            color: c.remaining > 0 ? theme.colors.green[7] : theme.colors.red[6],
                          }}
                        >
                          {c.remaining.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Center>
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
