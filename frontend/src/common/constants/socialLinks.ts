import LinkedinSvg from "@app/assets/svg/LinkedInSvg";
import GithubSvg from "@app/assets/svg/GithubSvg";
import { GITHUB_URL, LINKEDIN_URL } from "@app/common/constants/urls";

export const SOCIAL_LINKS = [
  { label: "LinkedIn", url: LINKEDIN_URL, Icon: LinkedinSvg },
  { label: "GitHub", url: GITHUB_URL, Icon: GithubSvg },
] as const;
