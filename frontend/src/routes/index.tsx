import { FunctionComponent, JSX } from "react";
import { Route, Routes } from "react-router";

import { BASE_ROUTES } from "@app/routes/constants";
import { IComponentRoute } from "@app/routes/types";
import { useScrollToTopOnRouteChange } from "@app/routes/hooks";
import ResumePage from "@app/Resume/Components/ResumePage";
import LandingPage from "@app/Home/Components/LandingPage";
import WorkPage from "@app/Work/Components/WorkPage";

const COMPONENT_ROUTES: Array<IComponentRoute> = [
  {
    route: BASE_ROUTES.home,
    component: <LandingPage />,
  },
  {
    route: BASE_ROUTES.work,
    component: <WorkPage />,
  },
  {
    route: BASE_ROUTES.resumé,
    component: <ResumePage />,
  },
  // Contact page is disabled until R9 (Netlify Forms):
  // { route: BASE_ROUTES.contact, component: <ContactPage /> },
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
