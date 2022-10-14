import React from "react";
import { MantineProvider, Text, AppShell, Header as MantineHeader, Navbar } from "@mantine/core";
import { MainLinks } from "./Links";
import MonthSelector from "./MonthSelector";
import { useTransactions } from "./TransactionsContext";

type AppWrapperProps = {
  children: React.ReactNode;
  selectedTab: number;
  setTab: any;
};

const AppWrapper: React.FC<AppWrapperProps> = ({ children, selectedTab, setTab }) => {
  const { budgetMonth, setBudgetMonth } = useTransactions();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
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
              <Text>Bartschi Budget</Text> {/*@ts-ignore}*/}
              <MonthSelector value={budgetMonth} setValue={setBudgetMonth} />
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
