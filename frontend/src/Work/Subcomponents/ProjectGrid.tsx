import { type FunctionComponent, useRef } from "react";

import type { IWorkEntry } from "@app/types/work";
import ProjectCard, {
  type ProjectHeadingLevel,
} from "@app/Work/Subcomponents/ProjectCard";
import { useClientSideLinks } from "@app/Work/hooks";
import {
  CARD_LINK_SELECTOR,
  EAGER_IMAGE_COUNT,
  OPENED_FROM_CARD_STATE,
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
}

/**
 * The responsive project card grid (3, 2 or 1 columns). Each card opens the
 * project's detail view (`/work/:slug`) in the app.
 */
const ProjectGrid: FunctionComponent<Props> = ({
  projects,
  headingLevel = "h2",
  linkSearch = "",
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  useClientSideLinks(listRef, CARD_LINK_SELECTOR, OPENED_FROM_CARD_STATE);

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
