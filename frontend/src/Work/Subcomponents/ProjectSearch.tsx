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

  // When the query changes, it replaces the text only if it changed from
  // outside (clearing the filters, back/forward): not when it's the one
  // this box last sent arriving (in a transition, so after the send), so
  // typing on while a send is in flight keeps every keystroke.
  const [seenQuery, setSeenQuery] = useState(query);
  const [sentQuery, setSentQuery] = useState(query);
  if (query !== seenQuery) {
    setSeenQuery(query);
    if (query !== sentQuery) {
      setSentQuery(query);
      setText(query);
    }
  }

  // The same check for the timer, which render can't touch: a query
  // changed from outside drops a pending change, so a stale one can't undo
  // clearing the filters.
  const lastSentQuery = useRef(query);
  useEffect(() => {
    if (query === lastSentQuery.current) return;
    lastSentQuery.current = query;
    window.clearTimeout(pendingChange.current);
  }, [query]);

  useEffect(() => () => window.clearTimeout(pendingChange.current), []);

  const handleChange = (value: string) => {
    setText(value);
    window.clearTimeout(pendingChange.current);
    pendingChange.current = window.setTimeout(() => {
      lastSentQuery.current = value;
      setSentQuery(value);
      onQueryChange(value);
    }, SEARCH_DEBOUNCE_MS);
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
