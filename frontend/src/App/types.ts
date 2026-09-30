import type { Theme } from "@app/common/constants/themes";

export interface IAppHeaderMenuLink {
  text: string;
  route: string;
}

export interface IAppSlice {
  manualThemePreference?: Theme;
}
