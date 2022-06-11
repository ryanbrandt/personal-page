import { FunctionComponent } from "react";
import { Route, Routes } from "react-router";

import { BASE_ROUTES } from "@app/routes/constants";
import { IComponentRoute } from "@app/routes/types";
import { useScrollToTopOnRouteChange } from "@app/routes/hooks";

export const COMPONENT_ROUTES: Array<IComponentRoute> = [
  {
    route: BASE_ROUTES.home,
    component: <div>Home</div>,
  },
  {
    route: BASE_ROUTES.work,
    component: <div>Work</div>,
  },
  {
    route: BASE_ROUTES.resumé,
    component: <div>Resumè</div>,
  },
  {
    route: BASE_ROUTES.contact,
    component: <div>Contact</div>,
  },
];

const ApplicationRoutes: FunctionComponent = (): JSX.Element => {
  useScrollToTopOnRouteChange();

  return (
    <Routes>
      {COMPONENT_ROUTES.map(({ route, component }) => (
        <Route key={route} path={route} element={component} />
      ))}
    </Routes>
  );
};

export default ApplicationRoutes;
