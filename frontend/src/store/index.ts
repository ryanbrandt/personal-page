import { configureStore, combineReducers } from "@reduxjs/toolkit";

import workReducer, { WORK_SLICE_NAME } from "@app/content/workSlice";

const store = configureStore({
  reducer: combineReducers({
    [WORK_SLICE_NAME]: workReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
