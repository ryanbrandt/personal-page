import type { FunctionComponent } from "react";

import type { IWorkEntry } from "@app/content/schemas";

interface Props {
  project: IWorkEntry;
}

// Every card has one of these, so the name adds the project to tell them
// apart for screen readers, and starts with the visible text so speech
// input users can say what they see.
const ProjectGitHubLink: FunctionComponent<Props> = ({ project }) => (
  <a
    className="project-github-link"
    href={project.githubUrl}
    aria-label={`View on GitHub: ${project.title}`}
  >
    View on GitHub <span aria-hidden="true">→</span>
  </a>
);

export default ProjectGitHubLink;
