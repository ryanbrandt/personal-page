import type { FunctionComponent } from "react";

const AppFooter: FunctionComponent = () => (
  <footer className="app-footer">
    © {new Date().getFullYear()} Ryan Brandt. All rights reserved.
  </footer>
);

export default AppFooter;
