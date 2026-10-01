// This file owns the stylesheet order: the library's compiled CSS must load
// before the page styles (and before any component that imports its own CSS),
// so page rules win ties against it. Keep these above every other import.
import "@ryanbrandt/react-quick-ui/stylesheets/index.css";
import "@styles/index.scss";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "@app/App/Components/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
