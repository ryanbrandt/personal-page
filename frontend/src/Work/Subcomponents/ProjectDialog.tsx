import { type FunctionComponent, useId, useState } from "react";
import { Dialog, Tag } from "@ryanbrandt/react-quick-ui";

import type { IWorkEntry } from "@app/types/work";
import ProjectGitHubLink from "@app/Work/Subcomponents/ProjectGitHubLink";
import ProjectImage from "@app/Work/Subcomponents/ProjectImage";
import { formatWorkDates } from "@app/Work/utils";

interface Props {
  /** The project to show; the dialog is open while there is one */
  project: IWorkEntry | undefined;
  onClose: () => void;
}

/** A project's detail view. */
const ProjectDialog: FunctionComponent<Props> = ({ project, onClose }) => {
  // Keep showing the last project while the dialog animates closed.
  const [shown, setShown] = useState(project);
  if (project && project !== shown) setShown(project);

  const descriptionId = useId();

  if (!shown) return null;

  return (
    <Dialog
      className="project-dialog"
      open={!!project}
      onClose={onClose}
      title={shown.title}
      aria-describedby={descriptionId}
    >
      <p className="project-dialog__dates">{formatWorkDates(shown)}</p>
      <div className="project-dialog__media">
        <ProjectImage project={shown} alt={`Screenshot of ${shown.title}`} />
      </div>
      <p id={descriptionId}>{shown.description}</p>
      <ul className="project-dialog__tags">
        {shown.tags.map((tag) => (
          <li key={tag}>
            <Tag text={tag} />
          </li>
        ))}
      </ul>
      <ProjectGitHubLink project={shown} />
    </Dialog>
  );
};

export default ProjectDialog;
