import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { post } from "../utilities";
import { Button, PasswordInput, Stack } from "@mantine/core";
import { CategoriesProvider } from "./modules/categories/CategoriesContext";
import { TransactionsProvider } from "./modules/transactions/TransactionsContext";
import Home from "./Home";

/**
 * Handle website login and routing to main Home page
 *
 */
const App = () => {
  const [savedPassword, setSavedPassword] = useLocalStorage({ key: "password", defaultValue: "" });
  const [typedPassword, setTypedPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const tryLogin = (text) => {
    post("/api/enter", { password: text }).then((res) => {
      if (res) {
        setSavedPassword(text);
      }
      setIsLoggedIn(res);
    });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setTypedPassword(savedPassword);
      tryLogin(savedPassword);
    }
  }, [savedPassword]);

  return (
    <NotificationsProvider>
      <CategoriesProvider>
        <TransactionsProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Home></Home>
                  ) : (
                    <Stack spacing={"xs"}>
                      <PasswordInput
                        value={typedPassword}
                        onChange={(event) => setTypedPassword(event.currentTarget.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") tryLogin(typedPassword);
                        }}
                      ></PasswordInput>
                      <Button onClick={() => tryLogin(typedPassword)}>Login</Button>
                    </Stack>
                  )
                }
              />
            </Routes>
          </BrowserRouter>
        </TransactionsProvider>
      </CategoriesProvider>
    </NotificationsProvider>
  );
};

export default App;
