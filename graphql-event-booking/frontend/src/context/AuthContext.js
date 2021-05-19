import React, { createContext } from "react";

const initialState = {
  token: null,
  userId: null,
  login: (token, userId, tokenExpiration) => {},
  logout: () => {},
};
const authContext = createContext(initialState);
const AuthProvider = authContext.Provider;
// const AuthConsumer = authContext.Consumer; => instead of using consumer we use useContext

export default authContext;
export { AuthProvider };
