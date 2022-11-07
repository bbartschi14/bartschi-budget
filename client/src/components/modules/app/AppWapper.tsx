import React from "react";
import {
  MantineProvider,
  Text,
  AppShell,
  Header as MantineHeader,
  Navbar,
  ScrollArea,
  Group,
  NativeSelect,
  Tooltip,
} from "@mantine/core";
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
  const { budgetMonth, setBudgetMonth, categoryType, setCategoryType, user, setUser } =
    useTransactions();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 400 }} p="xs">
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
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
              <Group>
                <Text color={"blue"} weight={"bold"}>
                  Bartschi Budget
                </Text>
                <Tooltip label={"Current User"} position={"right"}>
                  <NativeSelect
                    data={["Ben", "Amanda"]}
                    value={user}
                    onChange={(event) => setUser(event.currentTarget.value)}
                  />
                </Tooltip>
              </Group>
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
