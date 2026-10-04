import { type FunctionComponent, useRef } from "react";
import { Heading } from "@ryanbrandt/react-quick-ui";

import { useFocusReturnTarget } from "@app/common/hooks";
import { useRecentProjects } from "@app/content/hooks";
import MoreLink from "@app/Home/Subcomponents/MoreLink";
import { BASE_ROUTES } from "@app/routes/constants";
import {
  CARD_LINK_SELECTOR,
  type IWorkEntryLocationState,
  RECENT_PROJECT_COUNT,
} from "@app/Work/constants";
import ProjectGrid from "@app/Work/Subcomponents/ProjectGrid";

// Closing a project opened here goes back to the home page. It remounts
// (the projects page renders the dialog) and refocuses the card; a
// react-router background location modal would keep it mounted instead.
const LINK_STATE = {
  returnOnClose: true,
  search: "",
} satisfies IWorkEntryLocationState;

/**
 * The projects started most recently, across the page as in D0. The cards
 * open a project's detail view on the projects page.
 */
const RecentProjects: FunctionComponent = () => {
  const projects = useRecentProjects(RECENT_PROJECT_COUNT);
  const sectionRef = useRef<HTMLElement>(null);
  useFocusReturnTarget(sectionRef, CARD_LINK_SELECTOR);

  // The link to all projects shows beside the heading on wide screens, so
  // it follows it in the markup (and focus order).
  return (
    <section ref={sectionRef} className="recent-projects">
      <Heading variant="section" text="Recent projects" />
      <MoreLink to={BASE_ROUTES.work} text="All projects" />
      {/* Below the fold: its images mustn't compete with the hero. */}
      <ProjectGrid
        projects={projects}
        headingLevel="h3"
        linkState={LINK_STATE}
        eagerImageCount={0}
      />
    </section>
  );
};

export default RecentProjects;
