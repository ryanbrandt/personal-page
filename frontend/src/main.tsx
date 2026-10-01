import React from "react";
import ReactDOM from "react-dom/client";

import App from "@app/App/Components/App";

// This file owns the stylesheet order: the library's compiled CSS must load
// before the page styles, so page rules win ties against it. Keep it first.
import "@ryanbrandt/react-quick-ui/stylesheets/index.css";
import "@styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
