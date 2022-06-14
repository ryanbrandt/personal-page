import { FunctionComponent } from "react";
import { TextInput, TextArea, Button } from "@ryanbrandt/react-quick-ui";

const ContactForm: FunctionComponent = (): JSX.Element => (
  <form className="contact-page__form">
    <TextInput size="xlg2" placeholder="Your full name" label="Name" />
    <TextInput size="xlg2" placeholder="Your email address" label="Email" />
    <TextArea label="How can I help you?" />
    <div className="contact-page__form__submit-btn">
      <Button variant="primary" text="Submit" />
    </div>
  </form>
);

export default ContactForm;
