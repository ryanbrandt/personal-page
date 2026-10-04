import type { FunctionComponent } from "react";

import PageSection from "@app/common/Components/PageSection";
import Timeline from "@app/common/Components/Timeline";
import TimelineEntry from "@app/common/Components/TimelineEntry";
import { toEntryKey } from "@app/content";
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
          {jobs.map((job) => (
            <TimelineEntry
              key={toEntryKey(job)}
              title={job.title}
              organization={job.organization}
              start={job.start}
              end={job.end}
            />
          ))}
        </Timeline>
        <MoreLink to={BASE_ROUTES.resumé} text="Full résumé" />
      </div>
    </PageSection>
  );
};

export default HomeExperience;
