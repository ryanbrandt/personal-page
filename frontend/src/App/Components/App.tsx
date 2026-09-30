import type { FunctionComponent } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import RootContainer from "@app/App/Components/RootContainer";
import store from "@app/store";
import AppContextProvider from "@app/App/Components/AppContextProvider";

const App: FunctionComponent = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppContextProvider>
        <RootContainer />
      </AppContextProvider>
    </BrowserRouter>
  </Provider>
);

export default App;
