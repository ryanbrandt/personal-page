import { FunctionComponent } from "react";

import { Modal } from "@ryanbrandt/react-quick-ui";
import { IWorkEntry } from "@app/types/work";
import { ALT_WORK_IMG_SRC } from "@app/Work/constants";
import GithubSvg from "@app/assets/svg/GithubSvg";
import { safeOpenWindow } from "@app/common/utils/browser";

interface Props {
  entry: IWorkEntry;
  show: boolean;
  onClose: () => void;
}

const WorkPageResultDetailsOverlay: FunctionComponent<Props> = (
  props: Props
): JSX.Element => {
  const {
    entry: { title, start, end, description, secondaryMediaLink, url },
    show,
    onClose,
  } = props;

  return (
    <Modal
      className="work-page__results-display__result__details-overlay"
      onClose={onClose}
      open={show}
      animated
    >
      <div
        onClick={onClose}
        className="work-page__results-display__result__details-overlay__close"
      >
        x
      </div>
      <h3 className="work-page__results-display__result__details-overlay__title">
        {title}
      </h3>
      <GithubSvg onClick={() => safeOpenWindow(url)} />
      <p className="work-page__results-display__result__details-overlay__text">{`${start}${
        end ? `- ${end}` : ""
      }`}</p>
      <img
        className="work-page__results-display__result__details-overlay__img"
        src={secondaryMediaLink || ALT_WORK_IMG_SRC}
        alt=""
      />

      <p className="work-page__results-display__result__details-overlay__text">
        {description}
      </p>
    </Modal>
  );
};

export default WorkPageResultDetailsOverlay;
