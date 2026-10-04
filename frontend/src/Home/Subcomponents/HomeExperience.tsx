import type { FunctionComponent } from "react";

import PageSection from "@app/common/Components/PageSection";
import Timeline from "@app/common/Components/Timeline";
import TimelineEntry from "@app/common/Components/TimelineEntry";
import { useExperience } from "@app/content/hooks";
import MoreLink from "@app/Home/Subcomponents/MoreLink";
import { BASE_ROUTES } from "@app/routes/constants";

/** The jobs at a glance (dates, role, company), as in D0; the résumé has more. */
const HomeExperience: FunctionComponent = () => {
  const jobs = useExperience();

  return (
    <PageSection title="Experience">
      <div className="home-experience">
        <Timeline>
          {jobs.map(({ title, organization, start, end }) => (
            <TimelineEntry
              key={`${start} ${title}`}
              title={title}
              organization={organization}
              start={start}
              end={end}
            />
          ))}
        </Timeline>
        <MoreLink to={BASE_ROUTES.resumé} text="Full résumé" />
      </div>
    </PageSection>
  );
};

export default HomeExperience;
