import { type FunctionComponent, useRef } from "react";
import { Button, Tag } from "@ryanbrandt/react-quick-ui";

import SocialLinks from "@app/common/Components/SocialLinks";
import { OWNER_NAME } from "@app/common/constants/site";
import {
  useClientSideLinks,
  useFocusHeadingOnPageMount,
} from "@app/common/hooks";
import { WORK_ENTRIES } from "@app/repositories/resume";
import { BASE_ROUTES } from "@app/routes/constants";

/** The job without an end date, if there is one. */
const CURRENT_JOB = WORK_ENTRIES.find(({ endDate }) => endDate === null);

// HomePage.scss lines the icons up with the text from this size.
const SOCIAL_ICON_SIZE = 24;

/**
 * The page's `<h1>` (the name), the current job as an eyebrow, a short bio,
 * calls to action and the social links.
 *
 * The `<h1>` is the page's heading, so it takes focus when the page mounts
 * after another (see useFocusHeadingOnPageMount). It's a plain `<h1>`, as
 * the library's Heading takes neither a ref nor a tabIndex (TODO(L2c)).
 * The eyebrow is shown above it but comes after it in the markup, so the
 * heading starts the page for screen readers and heading navigation.
 */
const HomeHero: FunctionComponent = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useFocusHeadingOnPageMount(headingRef);
  // The calls to action are library Buttons, which render plain links.
  useClientSideLinks(actionsRef, "a");

  return (
    <section className="home-hero">
      <h1 ref={headingRef} tabIndex={-1} className="home-hero__title">
        Hello, World!{" "}
        <span className="home-hero__title__name">
          My name is <strong>{OWNER_NAME}</strong>.
        </span>
      </h1>
      {CURRENT_JOB && (
        <p className="home-hero__eyebrow">
          <Tag
            size="lg"
            className="home-hero__eyebrow__tag"
            text={`${CURRENT_JOB.title} at ${CURRENT_JOB.organization}`}
          />
        </p>
      )}
      <p className="home-hero__bio">
        I'm a Software Engineer based out of Philadelphia.
      </p>
      <div ref={actionsRef} className="home-hero__actions">
        <Button
          href={BASE_ROUTES.resumé}
          size="xlg"
          width="auto"
          text="View résumé"
        />
        <Button
          href={BASE_ROUTES.work}
          size="xlg"
          width="auto"
          variant="secondary"
          text="Personal projects"
        />
      </div>
      <SocialLinks iconSize={SOCIAL_ICON_SIZE} className="home-hero__social" />
    </section>
  );
};

export default HomeHero;
