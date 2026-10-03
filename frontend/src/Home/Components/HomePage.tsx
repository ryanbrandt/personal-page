import type { FunctionComponent } from "react";

import { HOME_TITLE } from "@app/common/utils/documentTitle";
import HomeExperience from "@app/Home/Subcomponents/HomeExperience";
import HomeHero from "@app/Home/Subcomponents/HomeHero";
import RecentProjects from "@app/Home/Subcomponents/RecentProjects";

/** The home page, as in D0: the hero, then experience, then recent projects. */
const HomePage: FunctionComponent = () => (
  <div className="home-page">
    <title>{HOME_TITLE}</title>
    <HomeHero />
    <HomeExperience />
    <RecentProjects />
  </div>
);

export default HomePage;
