import { useTransactions } from "./TransactionsContext";
import { useMantineTheme, Text, Table } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";

const TotalsTable = () => {
  const theme = useMantineTheme();
  const { totals } = useTransactions();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Table
      highlightOnHover
      striped
      withColumnBorders
      withBorder
      sx={(theme) => ({
        boxShadow: "#CCCCCC88 1px 6px 8px",
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
            <Text size={"xl"} weight={"bold"} align={"center"}>
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
              fontSize: theme.fontSizes.xl,
              textAlign: "center",
              fontWeight: "bold",
              color: totals.totalRemaining > 0 ? theme.colors.green[7] : theme.colors.red[7],
            }}
          >
            {totals.totalRemaining.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </td>
        </tr>
        {!collapsed ? (
          totals.categories.map((c) => {
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
          })
        ) : (
          <></>
        )}
      </tbody>
    </Table>
  );
};

export default TotalsTable;
