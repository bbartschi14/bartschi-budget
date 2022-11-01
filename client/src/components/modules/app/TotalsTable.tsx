import { useTransactions } from "../transactions/TransactionsContext";
import { useMantineTheme, Text, Table, Box, LoadingOverlay } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CategoryItem from "../categories/CategoryItem";
import CSS from "csstype";
import { useCategories } from "../categories/CategoriesContext";

const baseNumberStyle: CSS.Properties = { width: "100px", textAlign: "center" };

const TotalsRemainingItem = ({ remaining, size }) => {
  const theme = useMantineTheme();
  return (
    <td
      style={{
        width: "100px",
        fontSize: size,
        textAlign: "center",
        fontWeight: "bold",
        color: remaining > 0 ? theme.colors.green[7] : theme.colors.red[6],
      }}
    >
      {remaining?.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}
    </td>
  );
};

const TotalsItem = ({ total }) => {
  return (
    <td style={baseNumberStyle}>
      {total?.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}
    </td>
  );
};

const TotalsTable = () => {
  const { totals, categoryType, fetching } = useTransactions();
  const { getCategoryByID } = useCategories();

  const theme = useMantineTheme();

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
            <th style={baseNumberStyle}>Spent</th>
            <th style={baseNumberStyle}>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {/* Begin TOTAL ROW */}
          <tr>
            <td>
              <Text size={"xl"} weight={"bold"} align={"center"}>
                {categoryType + " Total"}
              </Text>
            </td>
            <TotalsItem total={totals.totalPerType.get(categoryType)} />
            <TotalsRemainingItem
              size={theme.fontSizes.xl}
              remaining={totals.totalRemainingPerType?.get(categoryType)}
            />
          </tr>
          {/* End TOTAL ROW */}

          {/* Begin PER CATEGORY ROWS */}
          {totals.categories.map((c) => {
            return c.type == categoryType ? (
              <tr key={c.uuid}>
                <td>
                  <CategoryItem category={getCategoryByID(c.uuid)}></CategoryItem>
                </td>
                <TotalsItem total={c.total} />
                <TotalsRemainingItem size={theme.fontSizes.sm} remaining={c.remaining} />
              </tr>
            ) : null;
          })}
          {/* End PER CATEGORY ROWS */}
        </tbody>
      </Table>
    </div>
  );
};

export default TotalsTable;
