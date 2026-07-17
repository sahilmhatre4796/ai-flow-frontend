import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./AuthContext";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
