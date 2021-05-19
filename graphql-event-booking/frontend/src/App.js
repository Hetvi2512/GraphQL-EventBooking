import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";
import MainNavigation from "./components/MainNavigation";
import "./App.css";
export default function App() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {
    setToken("");
    setUserId("");
  };
  return (
    <BrowserRouter>
      <AuthProvider
        value={{ token: token, userId: userId, login: login, logout: logout }}
      >
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {token && <Redirect from="/" to="/events" exact />}
            {token && <Redirect from="/auth" to="/events" exact />}
            {!token && <Route path="/auth" component={Auth} />}
            <Route path="/events" component={Events} />
            {token && <Route path="/bookings" component={Bookings} />}
            {!token && <Redirect to="/auth" exact />}
          </Switch>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
