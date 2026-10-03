import { type FunctionComponent, useId } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import PageContainer from "@app/common/Components/PageContainer";
import { toDocumentTitle } from "@app/common/utils/documentTitle";
import NotFoundPage from "@app/NotFound/Components/NotFoundPage";
import { BASE_ROUTES } from "@app/routes/constants";
import { useAppSelector } from "@app/store/hooks";
import { selectWorkTags } from "@app/Work/memoizedSelectors";
import { selectWorkEntries, selectWorkEntryBySlug } from "@app/Work/selectors";
import { useFocusCardOnDeepLinkClose, useWorkFilters } from "@app/Work/hooks";
import { filterWorkEntries } from "@app/Work/utils";
import { isOpenedFromCard } from "@app/Work/constants";
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

  const entries = useAppSelector(selectWorkEntries);
  const allTags = useAppSelector(selectWorkTags);
  const selected = useAppSelector((state) =>
    slug ? selectWorkEntryBySlug(state, slug) : undefined
  );

  const { query, tags, setQuery, toggleTag, clearFilters } = useWorkFilters();
  const filtered = filterWorkEntries(entries, { query, tags });

  useFocusCardOnDeepLinkClose(slug);

  if (slug && !selected) return <NotFoundPage />;

  // Back to the card's page if a card opened it; otherwise (a link from
  // elsewhere) replace it with the grid, keeping the filters.
  const closeDialog = () => {
    if (isOpenedFromCard(location.state)) {
      void navigate(-1);
    } else {
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
          <ProjectGrid projects={filtered} linkSearch={location.search} />
        ) : (
          <WorkPageEmptyState onClearFilters={clearFiltersAndFocusSearch} />
        )}
      </div>
      <ProjectDialog project={selected} onClose={closeDialog} />
    </PageContainer>
  );
};

export default WorkPage;
