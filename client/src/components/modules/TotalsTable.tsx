import { useTransactions } from "./TransactionsContext";
import { useMantineTheme, Text, Table, Box, LoadingOverlay } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";

const TotalsTable = () => {
  const theme = useMantineTheme();
  const { totals, categoryType, fetching } = useTransactions();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={fetching} overlayBlur={2} />

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
                {categoryType + " Total"}
              </Text>
            </td>
            <td style={{ width: "100px", textAlign: "center" }}>
              {totals.totalPerType.get(categoryType)?.toLocaleString("en-US", {
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
                color:
                  totals.totalRemainingPerType.get(categoryType) > 0
                    ? theme.colors.green[7]
                    : theme.colors.red[7],
              }}
            >
              {totals.totalRemainingPerType.get(categoryType)?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </td>
          </tr>

          {!collapsed ? (
            totals.categories.map((c) => {
              return c.type == categoryType ? (
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
              ) : null;
            })
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TotalsTable;
