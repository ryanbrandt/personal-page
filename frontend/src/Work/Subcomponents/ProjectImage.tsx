import type { FunctionComponent } from "react";

import type { IWorkEntry } from "@app/content/schemas";
import { toInitials } from "@app/Work/utils";

interface Props {
  project: IWorkEntry;
  /** The screenshot's alt text; empty where it only decorates */
  alt?: string;
  /**
   * "eager" for images likely in the first screen
   *
   * @default lazy
   */
  loading?: "eager" | "lazy";
}

/**
 * The project's screenshot, or, without one, a gradient with its initials
 * (decorative, hidden from screen readers). Either fills its container,
 * which sets the size.
 */
const ProjectImage: FunctionComponent<Props> = ({
  project,
  alt = "",
  loading = "lazy",
}) => {
  const { image, title } = project;

  if (!image) {
    return (
      <span
        aria-hidden="true"
        className="project-image project-image--fallback"
      >
        {toInitials(title)}
      </span>
    );
  }

  return (
    <img
      className="project-image"
      src={image.src}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={loading}
      decoding="async"
    />
  );
};

export default ProjectImage;
