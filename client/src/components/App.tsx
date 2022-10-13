import React, { useEffect, useState } from "react";
import { Button, Space, Group, TextInput, NumberInput, Select } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { get, post } from "../utilities";
import { DataTable } from "mantine-datatable";
import { NotificationsProvider, showNotification } from "@mantine/notifications";
import AppWrapper from "./modules/AppWapper";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { DatePicker } from "@mantine/dates";
import { IconCurrencyDollar, IconAtom2 } from "@tabler/icons";

type TransactionType = {
  _id?: string;
  uuid: string;
  name: string;
  category: number;
  amount: number;
  date: string;
};

const App = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [amount, setAmount] = useState(0);
  const [date, onDateChange] = useState(new Date());
  const [category, setCategory] = useState<string | null>(null);
  const [name, setName] = useState("");

  const refreshTransactions = () => {
    get("api/transactions", {}).then((transactions) => {
      setTransactions(transactions);
      console.log(transactions);
    });
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  return (
    <NotificationsProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
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
                    data={[
                      { value: "0", label: "Dining" },
                      { value: "1", label: "Groceries" },
                      { value: "2", label: "Transportation" },
                      { value: "3", label: "Donations" },
                    ]}
                    styles={{ input: { backgroundColor: "#F5F5F5", fontWeight: 600 } }}
                    icon={<IconAtom2 size={14} />}
                  />
                  <DatePicker
                    value={date}
                    onChange={onDateChange}
                    allowFreeInput
                    placeholder="Pick date"
                    label="Event date"
                  />
                  <Button
                    onClick={() => {
                      let transaction: TransactionType = {
                        name: name,
                        amount: amount,
                        uuid: uuidv4(),
                        category: parseInt(category),
                        date: date.toDateString(),
                      };
                      console.log("Adding transaction: ", transaction);
                      post("/api/transaction", transaction).then((res) =>
                        console.log("Add success!")
                      );
                      setTransactions((prev) => [...prev, transaction]);
                    }}
                  >
                    Post!
                  </Button>
                </Group>

                <Space h={"lg"}></Space>
                <div>
                  <DataTable
                    minHeight={transactions.length > 0 ? 0 : 200}
                    withBorder
                    borderRadius="sm"
                    withColumnBorders
                    striped
                    highlightOnHover
                    noRecordsText="No transactions yet!"
                    records={transactions}
                    columns={[
                      { accessor: "name" },
                      { accessor: "amount" },
                      { accessor: "category" },
                      { accessor: "date" },
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
                            setTransactions((prev) =>
                              prev.filter((item) => item.uuid !== transaction.uuid)
                            );
                          },
                        },
                      ],
                    }}
                  />
                </div>
              </AppWrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </NotificationsProvider>
  );
};

export default App;
