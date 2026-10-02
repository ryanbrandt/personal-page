import { useWindowSize } from "@ryanbrandt/react-quick-ui";

export const MOBILE_WIDTH_UPPER_BOUND = 1024;

export const useIsMobile = (): boolean => {
  const { innerWidth } = useWindowSize();

  if (innerWidth > MOBILE_WIDTH_UPPER_BOUND) {
    return false;
  }

  return true;
};
