// This file owns the stylesheet order: the library's compiled CSS must load
// before the page styles (and before any component that imports its own CSS),
// so page rules win ties against it. Keep these above every other import.
import "@ryanbrandt/react-quick-ui/stylesheets/index.css";
import "@ryanbrandt/react-quick-ui/stylesheets/fonts.css";
import "@styles/index.scss";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "@app/App/Components/App";
import { applyTheme, THEME_STORAGE_KEY } from "@app/common/utils/theme";

// index.html's inline script normally themes the page before it paints. If it
// didn't run (e.g. blocked), theme it now rather than ignore the preference.
if (!document.documentElement.dataset.theme) applyTheme(THEME_STORAGE_KEY);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
