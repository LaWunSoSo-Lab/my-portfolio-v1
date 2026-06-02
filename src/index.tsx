/**
 * Main entry point for the React application.
 * Initializes the React DOM root and renders the App component.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Get the root DOM element where the React app will be mounted
const root = ReactDOM.createRoot(document.getElementById("root")!);

// Render the main App component wrapped with providers
root.render(<App />);
