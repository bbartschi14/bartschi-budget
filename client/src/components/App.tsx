import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Budget from "./Budget";
import { NotificationsProvider, showNotification } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { get, post } from "../utilities";
import { Button, Group, PasswordInput, Stack } from "@mantine/core";

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
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Budget></Budget>
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
    </NotificationsProvider>
  );
};

export default App;
