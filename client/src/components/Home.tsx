import { useState } from "react";
import AppWrapper from "./modules/app/AppWapper";
import { Tabs, Stack } from "@mantine/core";
import Budget from "./pages/Budget";
import Transactions from "./pages/Transactions";

/**
 * Main home page wrapper and tab controls
 *
 */
const Home = () => {
  const [tab, setTab] = useState(0);

  return (
    <AppWrapper selectedTab={tab} setTab={setTab}>
      <Tabs value={tab.toString()}>
        <Tabs.Panel value={"0"}>
          <Transactions />
        </Tabs.Panel>
        <Tabs.Panel value={"1"}>
          <Stack>
            <Budget />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </AppWrapper>
  );
};

export default Home;
