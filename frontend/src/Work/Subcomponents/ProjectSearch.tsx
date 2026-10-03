import { type FunctionComponent, useEffect, useRef, useState } from "react";
import { SearchInput } from "@ryanbrandt/react-quick-ui";

import { SEARCH_DEBOUNCE_MS } from "@app/Work/constants";

interface Props {
  id: string;
  /** The applied search (from the URL) */
  query: string;
  /** Called with the typed text once typing pauses */
  onQueryChange: (query: string) => void;
}

/** The project search box, debounced: the text applies once typing pauses. */
const ProjectSearch: FunctionComponent<Props> = ({
  id,
  query,
  onQueryChange,
}) => {
  const [text, setText] = useState(query);
  const pendingChange = useRef<number>(undefined);

  // A query changed from outside (clearing the filters) replaces the text.
  const [shownQuery, setShownQuery] = useState(query);
  if (query !== shownQuery) {
    setShownQuery(query);
    setText(query);
  }

  // Any new query, and unmounting, drops a pending change, so a stale one
  // can't undo clearing the filters.
  useEffect(() => () => window.clearTimeout(pendingChange.current), [query]);

  const handleChange = (value: string) => {
    setText(value);
    window.clearTimeout(pendingChange.current);
    pendingChange.current = window.setTimeout(
      () => onQueryChange(value),
      SEARCH_DEBOUNCE_MS
    );
  };

  return (
    <div className="project-search">
      <label htmlFor={id} className="project-search__label">
        Search projects
      </label>
      <SearchInput
        id={id}
        placeholder="Search projects"
        value={text}
        onChange={handleChange}
      />
    </div>
  );
};

export default ProjectSearch;
