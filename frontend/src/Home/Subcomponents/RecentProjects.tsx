import type { FunctionComponent } from "react";
import { Heading } from "@ryanbrandt/react-quick-ui";

import MoreLink from "@app/Home/Subcomponents/MoreLink";
import { BASE_ROUTES } from "@app/routes/constants";
import { useAppSelector } from "@app/store/hooks";
import type { IWorkEntryLocationState } from "@app/Work/constants";
import { selectRecentWorkEntries } from "@app/Work/memoizedSelectors";
import ProjectGrid from "@app/Work/Subcomponents/ProjectGrid";

// Closing a project opened here goes back to the home page. It remounts
// (the projects page renders the dialog); a react-router background
// location modal would keep it mounted instead.
const LINK_STATE = {
  returnOnClose: true,
  search: "",
} satisfies IWorkEntryLocationState;

/**
 * The projects started most recently, across the page as in D0. The cards
 * open a project's detail view on the projects page.
 */
const RecentProjects: FunctionComponent = () => {
  const projects = useAppSelector(selectRecentWorkEntries);

  return (
    <section className="recent-projects">
      <Heading variant="section" text="Recent projects" />
      {/* Below the fold: its images mustn't compete with the hero. */}
      <ProjectGrid
        projects={projects}
        headingLevel="h3"
        linkState={LINK_STATE}
        eagerImageCount={0}
      />
      <MoreLink to={BASE_ROUTES.work} text="All projects" />
    </section>
  );
};

export default RecentProjects;
