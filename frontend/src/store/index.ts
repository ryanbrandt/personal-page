import { configureStore, combineReducers } from "@reduxjs/toolkit";

import workReducer, { WORK_SLICE_NAME } from "@app/Work/slice";
import appReducer, { APP_SLICE_NAME } from "@app/App/slice";

const store = configureStore({
  reducer: combineReducers({
    [APP_SLICE_NAME]: appReducer,
    [WORK_SLICE_NAME]: workReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
