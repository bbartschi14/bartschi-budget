import React from "react";
import { MantineProvider, Text, AppShell, Navbar, Header, Button } from "@mantine/core";
import { MainLinks } from "./modules/Links";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const AppWrapper: React.FC = ({ children }) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        header={
          <Header height={70} p="md">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Text>Typescript-React-Mantine Template</Text>
            </div>
          </Header>
        }
        navbar={
          <Navbar width={{ base: 300 }} height={500} p="md">
            <Navbar.Section>
              <MainLinks />
            </Navbar.Section>
          </Navbar>
        }
      >
        {children}
      </AppShell>
    </MantineProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppWrapper>
              <Text>Welcome to the template! Setup includes:</Text>
              <ul>
                <li>Typescript</li>
                <li>React</li>
                <li>Mantine UI</li>
                <li>React Router DOM</li>
                <li>Tabler Icons</li>
              </ul>
            </AppWrapper>
          }
        />
        <Route
          path="/first"
          element={
            <AppWrapper>
              <Text>First page</Text>
            </AppWrapper>
          }
        />
        <Route
          path="/second"
          element={
            <AppWrapper>
              <Text>Second page</Text>
            </AppWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
