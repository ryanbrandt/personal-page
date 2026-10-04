import type { FunctionComponent } from "react";
import { Provider } from "react-redux";

import PageTransitionRouter from "@app/App/Components/PageTransitionRouter";
import RootContainer from "@app/App/Components/RootContainer";
import store from "@app/store";

const App: FunctionComponent = () => (
  <Provider store={store}>
    <PageTransitionRouter>
      <RootContainer />
    </PageTransitionRouter>
  </Provider>
);

export default App;
