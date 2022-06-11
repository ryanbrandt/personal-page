import { useEffect } from "react";
import { useLocation } from "react-router";

export const useScrollToTopOnRouteChange = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};
