import type { FunctionComponent } from "react";
import { Link } from "react-router";

interface Props {
  /** The page with the rest */
  to: string;
  text: string;
}

/** A link from a home page section to the page with all of it. */
const MoreLink: FunctionComponent<Props> = ({ to, text }) => (
  <Link to={to} className="more-link">
    {text} <span aria-hidden="true">→</span>
  </Link>
);

export default MoreLink;
