import { FunctionComponent, JSX, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Input, SearchInput, useDebounce } from "@ryanbrandt/react-quick-ui";
import { workQueryChange } from "@app/Work/slice";

const WorkPageSearchFilters: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    dispatch(workQueryChange(debouncedQuery));
  }, [debouncedQuery, dispatch]);

  return (
    <div className="work-page__search-filters">
      <Input
        inputType="search"
        placeholder="Search projects"
        value={query}
        onChange={setQuery}
        size="xlg"
      />
    </div>
  );
};

export default WorkPageSearchFilters;
