import { FunctionComponent, useContext } from "react";
import { Route, Routes, useLocation } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { BASE_ROUTES } from "@app/routes/constants";
import { IComponentRoute } from "@app/routes/types";
import { useScrollToTopOnRouteChange } from "@app/routes/hooks";
import ContactPage from "@app/Contact/Components/ContactPage";
import ResumePage from "@app/Resume/Components/ResumePage";
import MobileContext from "@app/common/contexts/MobileContext";
import LandingPage from "@app/Home/Components/LandingPage";
import WorkPage from "@app/Work/Components/WorkPage";

export const COMPONENT_ROUTES: Array<IComponentRoute> = [
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
  {
    route: BASE_ROUTES.contact,
    component: <ContactPage />,
  },
];

const ApplicationRoutes: FunctionComponent = (): JSX.Element => {
  useScrollToTopOnRouteChange();
  const location = useLocation();
  const isMobile = useContext(MobileContext);

  if (isMobile) {
    return (
      <Routes>
        {COMPONENT_ROUTES.map(({ route, component }) => (
          <Route key={route} path={route} element={component} />
        ))}
      </Routes>
    );
  }

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="slide" timeout={500}>
        <Routes location={location}>
          {COMPONENT_ROUTES.map(({ route, component }) => (
            <Route key={route} path={route} element={component} />
          ))}
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default ApplicationRoutes;
