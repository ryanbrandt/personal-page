import { type FunctionComponent, useEffect, useId } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { usePrevious } from "@ryanbrandt/react-quick-ui";

import { CONTENT_ID } from "@app/App/constants";
import PageContainer from "@app/common/Components/PageContainer";
import {
  rememberReturnTarget,
  takeReturnTarget,
} from "@app/common/returnFocus";
import { toDocumentTitle } from "@app/common/utils/documentTitle";
import { useProject, useProjects, useProjectTags } from "@app/content/hooks";
import NotFoundPage from "@app/NotFound/Components/NotFoundPage";
import { BASE_ROUTES } from "@app/routes/constants";
import { useWorkFilters } from "@app/Work/hooks";
import { filterWorkEntries } from "@app/Work/utils";
import {
  CARD_LINK_SELECTOR,
  type IWorkEntryLocationState,
  toWorkEntryPath,
} from "@app/Work/constants";
import ProjectDialog from "@app/Work/Subcomponents/ProjectDialog";
import ProjectGrid from "@app/Work/Subcomponents/ProjectGrid";
import ProjectSearch from "@app/Work/Subcomponents/ProjectSearch";
import TagFilter from "@app/Work/Subcomponents/TagFilter";
import WorkPageEmptyState from "@app/Work/Subcomponents/WorkPageEmptyState";

/**
 * The projects: a filterable card grid. `/work/:slug` opens a project's
 * detail view over it.
 */
const WorkPage: FunctionComponent = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchId = useId();

  const entries = useProjects();
  const allTags = useProjectTags();
  const selected = useProject(slug);

  const { query, tags, setQuery, toggleTag, clearFilters } = useWorkFilters();
  const filtered = filterWorkEntries(entries, { query, tags });

  // Where focus goes once the dialog has closed (by its own controls or by
  // Back): it can't move before then, as the open modal dialog makes the
  // page inert, and the dialog only closes in an effect after the
  // navigation renders. When a card opened the dialog and is still there,
  // the Dialog has already returned focus to it. Otherwise (a deep link, a
  // reload) focus would be lost: focus the project's card, or, if the
  // filters hide it, the page heading.
  const previousSlug = usePrevious(slug);
  useEffect(() => {
    if (slug || !previousSlug) return;
    // Closed back onto this page, which stayed mounted: nothing remounts to
    // take the return target closeDialog remembered.
    takeReturnTarget();

    const focused = document.activeElement;
    const focusReturned =
      focused && focused !== document.body && !focused.closest("dialog");
    if (focusReturned) return;

    const path = toWorkEntryPath(previousSlug);
    const card = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(CARD_LINK_SELECTOR)
    ).find((link) => new URL(link.href).pathname === path);
    (card ?? document.querySelector<HTMLElement>(`#${CONTENT_ID} h1`))?.focus();
  }, [slug, previousSlug]);

  if (slug && !selected) return <NotFoundPage />;

  const closeDialog = () => {
    const { returnOnClose, search } = (location.state ??
      {}) as IWorkEntryLocationState;
    if (returnOnClose && search === location.search) {
      // Back to the page the card was on (this one, or e.g. the home page,
      // which remounts and refocuses the card).
      rememberReturnTarget(toWorkEntryPath(slug!));
      void navigate(-1);
    } else {
      // A link from elsewhere (or a new tab), or the filters changed since
      // the card opened it (a search applied under the dialog): go to the
      // grid with the current filters instead.
      void navigate(
        { pathname: BASE_ROUTES.work, search: location.search },
        { replace: true }
      );
    }
  };

  const clearFiltersAndFocusSearch = () => {
    clearFilters();
    document.getElementById(searchId)?.focus();
  };

  return (
    <PageContainer
      title="Recent Personal Projects"
      documentTitle={toDocumentTitle(selected?.title ?? "Projects")}
    >
      <div className="work-page">
        <div className="work-page__filters">
          <ProjectSearch id={searchId} query={query} onQueryChange={setQuery} />
          <TagFilter tags={allTags} selected={tags} onToggle={toggleTag} />
        </div>
        <p role="status" className="work-page__status">
          {filtered.length === entries.length
            ? `${entries.length} projects`
            : `${filtered.length} of ${entries.length} projects`}
        </p>
        {filtered.length > 0 ? (
          <ProjectGrid
            projects={filtered}
            linkSearch={location.search}
            linkState={
              {
                returnOnClose: true,
                search: location.search,
              } satisfies IWorkEntryLocationState
            }
          />
        ) : (
          <WorkPageEmptyState onClearFilters={clearFiltersAndFocusSearch} />
        )}
      </div>
      <ProjectDialog project={selected} onClose={closeDialog} />
    </PageContainer>
  );
};

export default WorkPage;
