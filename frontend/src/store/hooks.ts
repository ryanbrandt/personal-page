// eslint-disable-next-line no-restricted-imports -- the typed hooks wrap these
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@app/store";

// Use these instead of plain `useDispatch`/`useSelector`: they know the
// store's state and dispatch types.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
