import { createContext } from "react";

import { Theme } from "@app/common/constants/themes";

const ThemeContext = createContext(Theme.LIGHT);

export default ThemeContext;
