import type { FunctionComponent } from "react";

import ContactForm from "@app/Contact/Subcomponents/ContactForm";
import PageContainer from "@app/common/Components/PageContainer";
import { toDocumentTitle } from "@app/common/utils/documentTitle";
import SocialLinks from "@app/Contact/Subcomponents/SocialLinks";

const ContactPage: FunctionComponent = () => (
  <PageContainer
    title="Get in Touch"
    documentTitle={toDocumentTitle("Contact")}
  >
    <div className="contact-page">
      <ContactForm />
      <SocialLinks />
    </div>
  </PageContainer>
);

export default ContactPage;
