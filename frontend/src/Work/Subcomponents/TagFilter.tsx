import { type FunctionComponent, useId } from "react";

interface Props {
  tags: ReadonlyArray<string>;
  selected: ReadonlyArray<string>;
  onToggle: (tag: string) => void;
}

/** A row of toggle buttons, one per tag. */
const TagFilter: FunctionComponent<Props> = ({ tags, selected, onToggle }) => {
  const labelId = useId();

  return (
    <div role="group" aria-labelledby={labelId} className="tag-filter">
      <span id={labelId} className="tag-filter__label">
        Filter by tag
      </span>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className="tag-filter__chip"
          aria-pressed={selected.includes(tag)}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
