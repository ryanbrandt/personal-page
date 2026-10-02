import type { FunctionComponent } from "react";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";

import RootContainer from "@app/App/Components/RootContainer";
import store from "@app/store";

const App: FunctionComponent = () => (
  <Provider store={store}>
    <BrowserRouter>
      <RootContainer />
    </BrowserRouter>
  </Provider>
);

export default App;
