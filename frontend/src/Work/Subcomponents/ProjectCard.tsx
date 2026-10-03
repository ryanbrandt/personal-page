import type { ComponentProps, FunctionComponent } from "react";
import { Card } from "@ryanbrandt/react-quick-ui";

import type { IWorkEntry } from "@app/types/work";
import ProjectGitHubLink from "@app/Work/Subcomponents/ProjectGitHubLink";
import ProjectImage from "@app/Work/Subcomponents/ProjectImage";

export type ProjectHeadingLevel = ComponentProps<typeof Card>["headingLevel"];

interface Props {
  project: IWorkEntry;
  /** Where the card links: the project's detail view */
  href: string;
  headingLevel: ProjectHeadingLevel;
  imageLoading: "eager" | "lazy";
}

/** A project's card: image, title, one-liner, tags and GitHub link. */
const ProjectCard: FunctionComponent<Props> = ({
  project,
  href,
  headingLevel,
  imageLoading,
}) => (
  <Card
    title={project.title}
    href={href}
    headingLevel={headingLevel}
    media={<ProjectImage project={project} loading={imageLoading} />}
    tags={project.tags}
    footer={<ProjectGitHubLink project={project} />}
  >
    <p>{project.description}</p>
  </Card>
);

export default ProjectCard;
