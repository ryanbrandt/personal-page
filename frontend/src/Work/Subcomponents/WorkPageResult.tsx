import { FunctionComponent, JSX, useState } from "react";

import { IWorkEntry } from "@app/types/work";
import WorkPageResultDetailsOverlay from "@app/Work/Subcomponents/WorkPageResultDetailsOverlay";
import { ALT_WORK_IMG_SRC } from "@app/Work/constants";

interface Props {
  entry: IWorkEntry;
}
const WorkPageResult: FunctionComponent<Props> = (
  props: Props
): JSX.Element => {
  const { entry } = props;
  const { title, primaryMediaLink } = entry;

  const [detailOverlayOpen, setDetailOverlayOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setDetailOverlayOpen(true)}
        className="work-page__results-display__result"
      >
        <img
          className="work-page__results-display__result__img"
          src={primaryMediaLink || ALT_WORK_IMG_SRC}
          alt=""
        />
        <label className="work-page__results-display__result__title">
          {title}
        </label>
      </div>
      <WorkPageResultDetailsOverlay
        entry={entry}
        onClose={() => setDetailOverlayOpen(false)}
        show={detailOverlayOpen}
      />
    </>
  );
};

export default WorkPageResult;
