import { useState } from "react";
import AppWrapper from "./modules/app/AppWapper";
import { Tabs } from "@mantine/core";
import Budget from "./pages/Budget";
import Transactions from "./pages/Transactions";
import Graphs from "./pages/Graphs";

/**
 * Main home page wrapper and tab controls
 */
const Home = () => {
  const [tab, setTab] = useState(0);

  return (
    <AppWrapper selectedTab={tab} setTab={setTab}>
      <Tabs value={tab.toString()} sx={(theme) => ({ height: "100%" })}>
        <Tabs.Panel value={"0"}>
          <Transactions />
        </Tabs.Panel>
        <Tabs.Panel value={"1"}>
          <Budget />
        </Tabs.Panel>
        <Tabs.Panel value={"2"} sx={(theme) => ({ height: "100%" })}>
          <Graphs />
        </Tabs.Panel>
      </Tabs>
    </AppWrapper>
  );
};

export default Home;
