import { useEffect, useState } from "react";
import { IconTrash, IconCopy, IconTableOptions, IconUsers } from "@tabler/icons";
import CategoryItem from "../categories/CategoryItem";
import DateItem from "../app/DateItem";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import { ActionIcon, Checkbox, Menu, Text } from "@mantine/core";
import { useTransactions } from "../transactions/TransactionsContext";
import { useCategories } from "../categories/CategoriesContext";

type TransactionsTableProps = {
  copyTransactionToForm: (transaction: TransactionType) => void;
};

/**
 * Date table of all transactions in the current month/year
 */
const TransactionsTable = (props: TransactionsTableProps) => {
  const { transactions, deleteTransaction, fetching } = useTransactions();
  const { getCategoryByID } = useCategories();
  const [localTransactions, setLocalTransactions] = useState<TransactionType[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "date",
    direction: "asc",
  });
  const [showUser, setShowUser] = useState<boolean>(false);

  // Table hooks
  const reSort = (updatedTransactions) => {
    if (sortStatus) {
      const data = sortBy(updatedTransactions, sortStatus.columnAccessor);
      setLocalTransactions(sortStatus.direction === "desc" ? data.reverse() : data);
    }
  };
  useEffect(() => {
    reSort(transactions);
  }, [sortStatus, transactions]);

  return (
    <div style={{ position: "relative" }}>
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
            render: ({ category }) => (
              <CategoryItem category={getCategoryByID(category)}></CategoryItem>
            ),
          },

          // Column: Date
          {
            width: 140,
            accessor: "date",
            sortable: true,
            render: ({ date }) => <DateItem date={date}></DateItem>,
          },

          // Column: User
          {
            width: 50,
            accessor: "user",
            sortable: true,
            hidden: !showUser,
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
                props.copyTransactionToForm(transaction);
              },
            },

            // Context Action: Delete
            {
              icon: <IconTrash size={14} />,
              key: "delete",
              color: "red",
              title: `Delete transaction`,
              onClick: () => {
                deleteTransaction(transaction);
              },
            },
          ],
        }}
      />
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon
            style={{ position: "absolute", left: "-4px", top: "-4px", zIndex: 100 }}
            variant={"filled"}
          >
            <IconTableOptions />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Table Options</Menu.Label>
          <Menu.Item closeMenuOnClick={false} icon={<IconUsers size={14} />}>
            <Checkbox
              label={"Show user"}
              labelPosition={"left"}
              checked={showUser}
              onChange={(event) => setShowUser(event.currentTarget.checked)}
            />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default TransactionsTable;
