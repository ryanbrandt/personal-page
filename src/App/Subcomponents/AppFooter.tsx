import { FunctionComponent } from "react";

const AppFooter: FunctionComponent = (): JSX.Element => (
  <footer className="app-footer">
    © {new Date().getFullYear()} Ryan Brandt. All rights reserved.
  </footer>
);

export default AppFooter;
