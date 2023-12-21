import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AuthContextProvider } from "./context/authContext";
import { QueryProvider } from "./lib/react-query/queryProvider";

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </QueryProvider>
  </BrowserRouter>
  // </React.StrictMode>
)
