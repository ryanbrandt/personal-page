import type { FunctionComponent } from "react";
import { Heading } from "@ryanbrandt/react-quick-ui";

import MoreLink from "@app/Home/Subcomponents/MoreLink";
import { BASE_ROUTES } from "@app/routes/constants";
import { useAppSelector } from "@app/store/hooks";
import { selectRecentWorkEntries } from "@app/Work/memoizedSelectors";
import ProjectGrid from "@app/Work/Subcomponents/ProjectGrid";

/**
 * The projects started most recently, across the page as in D0. The cards
 * open a project's detail view on the projects page.
 */
const RecentProjects: FunctionComponent = () => {
  const projects = useAppSelector(selectRecentWorkEntries);

  return (
    <section className="recent-projects">
      <Heading variant="section" text="Recent projects" />
      <ProjectGrid projects={projects} headingLevel="h3" />
      <MoreLink to={BASE_ROUTES.work} text="All projects" />
    </section>
  );
};

export default RecentProjects;
