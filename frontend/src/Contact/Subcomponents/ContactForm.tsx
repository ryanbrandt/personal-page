import {
  type FormEvent,
  type FunctionComponent,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { Button } from "@ryanbrandt/react-quick-ui";

import {
  CONTACT_FIELDS,
  CONTACT_FORM_NAME,
  FORM_NAME_FIELD,
  HONEYPOT_FIELD,
} from "@app/Contact/constants";
import ContactFormField from "@app/Contact/Subcomponents/ContactFormField";
import type {
  ContactField,
  ContactFormErrors,
  SubmitStatus,
} from "@app/Contact/types";
import {
  postContactForm,
  validateContactField,
  validateContactForm,
} from "@app/Contact/utils";

// The submit button is disabled while sending, which drops its focus, so
// the outcome's message takes it as it appears: keyboard users land there,
// and screen readers read it out (once: it isn't a live region too).
// Module-level, so React calls it only when the element mounts.
const focusOnMount = (element: HTMLElement | null) => element?.focus();

/**
 * The contact form, sent to Netlify Forms. It checks the fields itself
 * (noValidate) on submit, then re-checks a field with an error as it's
 * edited. A sent form is cleared; a failed one keeps its values to retry.
 *
 * While sending, the disabled submit button also blocks submitting with
 * Enter (implicit submission), and Try again isn't shown.
 */
const ContactForm: FunctionComponent = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const submitting = status === "submitting";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const newErrors = validateContactForm(data);

    // Render the errors first, so the focused field announces its own.
    flushSync(() => setErrors(newErrors));
    const firstInvalid = CONTACT_FIELDS.find((field) => newErrors[field]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement).focus();
      return;
    }

    setStatus("submitting");
    const sent = await postContactForm(data);
    if (sent) form.reset();
    setStatus(sent ? "sent" : "failed");
  };

  // Change events from every field bubble up to the form.
  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    // The honeypot and form-name aren't fields, so they never have errors.
    const name = target.name as ContactField;
    if (!errors[name]) return;
    setErrors((current) => ({
      ...current,
      [name]: validateContactField(name, target.value),
    }));
  };

  return (
    <>
      <form
        ref={formRef}
        className="contact-form"
        noValidate
        aria-busy={submitting}
        onSubmit={(event) => void handleSubmit(event)}
        onChange={handleChange}
      >
        <input type="hidden" name={FORM_NAME_FIELD} value={CONTACT_FORM_NAME} />
        {/* The honeypot: out of sight and out of the accessibility tree. */}
        <label hidden>
          Don’t fill this out if you’re human:{" "}
          <input name={HONEYPOT_FIELD} autoComplete="off" />
        </label>
        <ContactFormField
          name="name"
          label="Name"
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name}
        />
        <ContactFormField
          name="email"
          label="Email"
          type="email"
          placeholder="Your email address"
          autoComplete="email"
          error={errors.email}
        />
        <ContactFormField
          name="message"
          label="How can I help you?"
          multiline
          error={errors.message}
        />
        <div className="contact-form__actions">
          <Button
            variant="primary"
            size="xlg"
            width="auto"
            text={submitting ? "Sending…" : "Submit"}
            disabled={submitting}
          />
        </div>
      </form>
      {status === "sent" && (
        <p ref={focusOnMount} tabIndex={-1} className="contact-form__sent">
          Thanks for getting in touch! Your message was sent.
        </p>
      )}
      {status === "failed" && (
        <div className="contact-form__failed">
          <p ref={focusOnMount} tabIndex={-1}>
            Sorry, your message couldn’t be sent. Please try again.
          </p>
          <Button
            variant="secondary"
            size="xlg"
            width="auto"
            text="Try again"
            onClick={() => formRef.current?.requestSubmit()}
          />
        </div>
      )}
    </>
  );
};

export default ContactForm;
