import React from "react";
import { MantineProvider, Text, AppShell, Header as MantineHeader, Navbar } from "@mantine/core";
import { MainLinks } from "./Links";
import MonthSelector from "./MonthSelector";
import { useTransactions } from "../transactions/TransactionsContext";
import TotalsTable from "./TotalsTable";

type AppWrapperProps = {
  children: React.ReactNode;
  selectedTab: number;
  setTab: any;
};

const AppWrapper: React.FC<AppWrapperProps> = ({ children, selectedTab, setTab }) => {
  const { budgetMonth, setBudgetMonth, categoryType, setCategoryType } = useTransactions();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 400 }} p="sm">
            <Navbar.Section>
              <TotalsTable></TotalsTable>
            </Navbar.Section>
          </Navbar>
        }
        header={
          <MantineHeader height={70} p="md">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text color={"blue"} weight={"bold"}>
                Bartschi Budget
              </Text>{" "}
              {/*@ts-ignore}*/}
              <MonthSelector
                value={budgetMonth}
                setValue={setBudgetMonth}
                categoryType={categoryType}
                setCategoryType={setCategoryType}
              />
              <MainLinks selectedTab={selectedTab} setTab={setTab} />
            </div>
          </MantineHeader>
        }
      >
        {children}
      </AppShell>
    </MantineProvider>
  );
};

export default AppWrapper;
