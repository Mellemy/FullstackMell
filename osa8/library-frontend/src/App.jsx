import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import BirthYear from "./components/BirthYear"
import { useApolloClient } from '@apollo/client'
import LoginForm from "./components/LoginForm";

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(localStorage.getItem('phonenumbers-user-token'));
  const [page, setPage] = useState("authors");

 const logout = () => {
    setToken(null);
    localStorage.removeItem('phonenumbers-user-token');
    client.resetStore();
    setPage('authors');
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>


      {token && (
        <>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("update")}>edit birth year</button>
        <button onClick={logout}>logout</button>
        </>
        )}

      {!token && (
        <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {page === "login" && !token && (
        <LoginForm setToken={setToken} setError={(msg) => alert(msg)} />
      )}

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add" && token} />

      <BirthYear show={page === "update" && token} />
    </div>
  );
};

export default App;
