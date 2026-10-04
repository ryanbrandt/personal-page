import {
  type FormEvent,
  type FunctionComponent,
  useEffect,
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

const isContactField = (name: string): name is ContactField =>
  (CONTACT_FIELDS as ReadonlyArray<string>).includes(name);

/**
 * The contact form, sent to Netlify Forms. It checks the fields itself
 * (noValidate) on submit, then re-checks a field with an error as it's
 * edited. A sent form is cleared; a failed one keeps its values to retry.
 */
const ContactForm: FunctionComponent = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const failedRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const submitting = status === "submitting";

  // The submit button is disabled while sending, which drops its focus:
  // move it to the outcome, so keyboard and screen reader users land there.
  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
    if (status === "failed") failedRef.current?.focus();
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const newErrors = validateContactForm(data);
    const firstInvalid = CONTACT_FIELDS.find((field) => newErrors[field]);
    if (firstInvalid) {
      // Render the errors first, so the focused field announces its own.
      flushSync(() => setErrors(newErrors));
      (form.elements.namedItem(firstInvalid) as HTMLElement).focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    const sent = await postContactForm(data);
    if (sent) form.reset();
    setStatus(sent ? "sent" : "failed");
  };

  // Change events from every field bubble up to the form.
  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    if (!isContactField(name) || !errors[name]) return;
    setErrors((current) => ({
      ...current,
      [name]: validateContactField(name, value),
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
          <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
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
      <div role="status" className="contact-form__status">
        {status === "sent" && (
          <p ref={sentRef} tabIndex={-1} className="contact-form__sent">
            Thanks for getting in touch! Your message was sent.
          </p>
        )}
      </div>
      {status === "failed" && (
        <div
          ref={failedRef}
          role="alert"
          tabIndex={-1}
          className="contact-form__failed"
        >
          <p>Sorry, your message couldn’t be sent. Please try again.</p>
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
