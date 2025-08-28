import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx"; // Ensure path is correct

// Get container element
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element with id 'root' not found");
}

// Create root and render
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
