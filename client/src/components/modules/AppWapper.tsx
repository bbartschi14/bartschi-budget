import React from "react";
import { MantineProvider, Text, AppShell, Header as MantineHeader } from "@mantine/core";

type AppWrapperProps = {
  children: React.ReactNode;
};

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        header={
          <MantineHeader height={70} p="md">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Text>Bartschi Budget</Text>
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
