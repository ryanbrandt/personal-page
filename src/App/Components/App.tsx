import { FunctionComponent } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import RootContainer from "@app/App/Components/RootContainer";
import store from "@app/store";

const App: FunctionComponent = (): JSX.Element => (
  <Provider store={store}>
    <BrowserRouter>
      <RootContainer />
    </BrowserRouter>
  </Provider>
);

export default App;
