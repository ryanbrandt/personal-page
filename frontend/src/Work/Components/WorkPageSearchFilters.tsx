import { type FunctionComponent, useEffect, useState } from "react";

import { Input, useDebounce } from "@ryanbrandt/react-quick-ui";
import { workQueryChange } from "@app/Work/slice";
import { useAppDispatch } from "@app/store/hooks";

const WorkPageSearchFilters: FunctionComponent = () => {
  const dispatch = useAppDispatch();

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
