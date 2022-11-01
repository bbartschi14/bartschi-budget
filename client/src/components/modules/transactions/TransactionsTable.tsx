import { useEffect, useState } from "react";
import { IconTrash, IconCopy } from "@tabler/icons";
import { post } from "../../../utilities";
import CategoryItem from "../categories/CategoryItem";
import DateItem from "../app/DateItem";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import { Text } from "@mantine/core";
import { useStateCallback } from "use-state-callback";
import { useTransactions } from "../transactions/TransactionsContext";

const TransactionsTable = ({
  setName,
  setAmount,
  setCategory,
  setDayOfMonth,
  descriptionInput,
}) => {
  const { transactions, setTransactions, fetching } = useTransactions();
  const [localTransactions, setLocalTransactions] = useStateCallback<TransactionType[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "date",
    direction: "asc",
  });

  // Table hooks
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

  return (
    <div>
      <DataTable
        // Styling
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        fetching={fetching}
        minHeight={localTransactions.length > 0 ? 0 : 200}
        borderRadius="sm"
        noRecordsText="No transactions yet!"
        // Records and Sorting
        records={localTransactions}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        columns={[
          // Column: Name
          { accessor: "name", sortable: true, width: 200, textAlignment: "right" },

          // Column: Amount
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

          // Column: Category
          {
            width: 160,
            accessor: "category",
            sortable: true,
            render: ({ category }) => <CategoryItem categoryId={category}></CategoryItem>,
          },

          // Column: Date
          {
            width: 140,
            accessor: "date",
            sortable: true,
            render: ({ date }) => <DateItem date={date}></DateItem>,
          },
        ]}
        // Use our transactions uuids for React
        idAccessor={"uuid"}
        rowContextMenu={{
          items: (transaction: TransactionType) => [
            // Context Action: Copy
            {
              icon: <IconCopy size={14} />,
              key: "copy",
              title: `Copy details`,
              onClick: () => {
                setName(transaction.name, () => {
                  if (descriptionInput.current) descriptionInput.current.select();
                });
                setAmount(transaction.amount);
                setCategory(transaction.category);
                setDayOfMonth(transaction.date.getDate());
              },
            },

            // Context Action: Delete
            {
              icon: <IconTrash size={14} />,
              key: "delete",
              color: "red", // @ts-ignore
              title: `Delete transaction`,
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
  );
};

export default TransactionsTable;
