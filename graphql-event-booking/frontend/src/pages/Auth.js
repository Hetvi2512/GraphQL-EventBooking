import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import authContext from "../context/AuthContext";
import "./Auth.css";
export default function Auth() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setisLogin] = useState(true);
  const { token, userId, login } = useContext(authContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mail.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${mail}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!isLogin) {
      requestBody = {
        query: `
        mutation {
          createUser(userInput: {email: "${mail}", password: "${password}"}) {
            _id
            email
          }
        }
      `,
      };
    }

    // request
    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const switchMode = () => {
    setisLogin(!isLogin);
  };
  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setMail(e.target.value);
            }}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={switchMode}>
            Switch to {isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
