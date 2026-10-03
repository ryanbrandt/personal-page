import type { FunctionComponent } from "react";
import { Link } from "react-router";

import PageContainer from "@app/common/Components/PageContainer";
import { BASE_ROUTES } from "@app/routes/constants";

const NotFoundPage: FunctionComponent = () => (
  <PageContainer title="Page not found" documentTitle="Page not found">
    <div className="not-found-page">
      <p>Sorry, there's nothing at this address.</p>
      <Link to={BASE_ROUTES.home}>Go to the home page</Link>
    </div>
  </PageContainer>
);

export default NotFoundPage;
