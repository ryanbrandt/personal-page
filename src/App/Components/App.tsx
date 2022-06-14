import { FunctionComponent } from "react";
import { BrowserRouter } from "react-router-dom";

import RootContainer from "@app/App/Components/RootContainer";

const App: FunctionComponent = (): JSX.Element => (
  <BrowserRouter>
    <RootContainer />
  </BrowserRouter>
);

export default App;
