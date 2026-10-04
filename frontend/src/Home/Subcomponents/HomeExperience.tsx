import type { FunctionComponent } from "react";

import PageSection from "@app/common/Components/PageSection";
import Timeline from "@app/common/Components/Timeline";
import TimelineEntry from "@app/common/Components/TimelineEntry";
import MoreLink from "@app/Home/Subcomponents/MoreLink";
import { WORK_ENTRIES } from "@app/repositories/resume";
import { BASE_ROUTES } from "@app/routes/constants";

/** The jobs at a glance (dates, role, company), as in D0; the résumé has more. */
const HomeExperience: FunctionComponent = () => (
  <PageSection title="Experience">
    <div className="home-experience">
      <Timeline>
        {WORK_ENTRIES.map((job) => (
          <TimelineEntry key={job.id} {...job} />
        ))}
      </Timeline>
      <MoreLink to={BASE_ROUTES.resumé} text="Full résumé" />
    </div>
  </PageSection>
);

export default HomeExperience;
