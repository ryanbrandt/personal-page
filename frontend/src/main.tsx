import React from "react";
import ReactDOM from "react-dom/client";

import App from "@app/App/Components/App";

import "@ryanbrandt/react-quick-ui/stylesheets/index.css";
import "@styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
