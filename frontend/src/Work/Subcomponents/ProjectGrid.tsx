import { type FunctionComponent, useRef } from "react";

import { useClientSideLinks } from "@app/common/hooks";
import type { IWorkEntry } from "@app/types/work";
import ProjectCard, {
  type ProjectHeadingLevel,
} from "@app/Work/Subcomponents/ProjectCard";
import {
  CARD_LINK_SELECTOR,
  EAGER_IMAGE_COUNT,
  toWorkEntryPath,
} from "@app/Work/constants";

interface Props {
  projects: ReadonlyArray<IWorkEntry>;
  /**
   * The card titles' heading level, one below the heading the grid sits
   * under
   *
   * @default h2
   */
  headingLevel?: ProjectHeadingLevel;
  /** A query string (e.g. the page's filters) the card links carry along */
  linkSearch?: string;
  /**
   * The history state the card links navigate with: the projects page
   * passes an IWorkEntryLocationState, so closing the dialog goes back to it
   */
  linkState?: unknown;
}

/**
 * The responsive project card grid (3, 2 or 1 columns). Each card opens the
 * project's detail view (`/work/:slug`) in the app.
 */
const ProjectGrid: FunctionComponent<Props> = ({
  projects,
  headingLevel = "h2",
  linkSearch = "",
  linkState,
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  useClientSideLinks(listRef, CARD_LINK_SELECTOR, linkState);

  return (
    <ul ref={listRef} className="project-grid">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <ProjectCard
            project={project}
            href={`${toWorkEntryPath(project.slug)}${linkSearch}`}
            headingLevel={headingLevel}
            imageLoading={index < EAGER_IMAGE_COUNT ? "eager" : "lazy"}
          />
        </li>
      ))}
    </ul>
  );
};

export default ProjectGrid;
