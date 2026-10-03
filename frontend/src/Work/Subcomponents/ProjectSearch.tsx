import {
  type FunctionComponent,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { SearchInput, useDebounce } from "@ryanbrandt/react-quick-ui";

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
  const debouncedText = useDebounce(text, SEARCH_DEBOUNCE_MS);

  // A query changed from outside (clearing the filters, back/forward)
  // replaces the text.
  const [appliedQuery, setAppliedQuery] = useState(query);
  if (query !== appliedQuery) {
    setAppliedQuery(query);
    setText(query);
  }

  const applyText = useEffectEvent((value: string) => {
    if (value !== query) onQueryChange(value);
  });
  useEffect(() => applyText(debouncedText), [debouncedText]);

  return (
    <div className="project-search">
      <label htmlFor={id} className="project-search__label">
        Search projects
      </label>
      <SearchInput
        id={id}
        placeholder="Search projects"
        value={text}
        onChange={setText}
      />
    </div>
  );
};

export default ProjectSearch;
