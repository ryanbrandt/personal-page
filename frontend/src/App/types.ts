import { Theme } from "@app/common/constants/themes";

export interface IAppHeaderMenuLink {
  text: string;
  route: string;
  active?: boolean;
}

export interface IAppSlice {
  manualThemePreference?: Theme;
}
