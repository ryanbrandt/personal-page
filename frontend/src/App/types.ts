import type { ThemePreference } from "@ryanbrandt/react-quick-ui";

export interface IAppHeaderMenuLink {
  text: string;
  route: string;
}

export interface IAppSlice {
  themePreference: ThemePreference;
}
