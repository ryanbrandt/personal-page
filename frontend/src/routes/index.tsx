import type { FunctionComponent } from "react";
import { Route, Routes } from "react-router";

import { BASE_ROUTES } from "@app/routes/constants";
import type { IComponentRoute } from "@app/routes/types";
import { useResetScrollAndFocusOnRouteChange } from "@app/routes/hooks";
import ResumePage from "@app/Resume/Components/ResumePage";
import LandingPage from "@app/Home/Components/LandingPage";
import WorkPage from "@app/Work/Components/WorkPage";
import NotFoundPage from "@app/NotFound/Components/NotFoundPage";

const COMPONENT_ROUTES: Array<IComponentRoute> = [
  {
    route: BASE_ROUTES.home,
    component: <LandingPage />,
  },
  {
    // One route, so opening a project's detail view keeps the grid mounted.
    route: `${BASE_ROUTES.work}/:slug?`,
    component: <WorkPage />,
  },
  {
    route: BASE_ROUTES.resumé,
    component: <ResumePage />,
  },
  // Contact page is disabled until R9 (Netlify Forms):
  // { route: BASE_ROUTES.contact, component: <ContactPage /> },
];

const ROUTE_PATTERNS = COMPONENT_ROUTES.map(({ route }) => route);

const ApplicationRoutes: FunctionComponent = () => {
  useResetScrollAndFocusOnRouteChange(ROUTE_PATTERNS);

  return (
    <Routes>
      {COMPONENT_ROUTES.map(({ route, component }) => (
        <Route key={route} path={route} element={component} />
      ))}
      {/* Unknown paths (and /contact until R9) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ApplicationRoutes;
