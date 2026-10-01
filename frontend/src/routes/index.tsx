import type { FunctionComponent } from "react";
import { Navigate, Route, Routes } from "react-router";

import { BASE_ROUTES } from "@app/routes/constants";
import type { IComponentRoute } from "@app/routes/types";
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

const ApplicationRoutes: FunctionComponent = () => {
  useScrollToTopOnRouteChange();

  return (
    <Routes>
      {COMPONENT_ROUTES.map(({ route, component }) => (
        <Route key={route} path={route} element={component} />
      ))}
      {/* Unknown paths (and /contact until R9) go home until R2 adds a 404 page. */}
      <Route path="*" element={<Navigate to={BASE_ROUTES.home} replace />} />
    </Routes>
  );
};

export default ApplicationRoutes;
