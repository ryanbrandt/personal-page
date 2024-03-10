import { FunctionComponent } from "react";

import ContactForm from "@app/Contact/Subcomponents/ContactForm";
import PageContainer from "@app/common/Components/PageContainer";
import SocialLinks from "@app/Contact/Subcomponents/SocialLinks";

const ContactPage: FunctionComponent = (): JSX.Element => (
  <PageContainer title="Get in Touch">
    <div className="contact-page">
      <ContactForm />
      <SocialLinks />
    </div>
  </PageContainer>
);

export default ContactPage;
