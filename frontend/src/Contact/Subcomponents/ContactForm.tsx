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

/**
 * The contact form, sent to Netlify Forms. It checks the fields itself
 * (noValidate) on submit, then re-checks a field with an error as it's
 * edited. A sent form is cleared; a failed one keeps its values to retry.
 * The outcome stays until the next edit or submit.
 *
 * While sending, the fields are read-only (so no edit is lost to the reset
 * that follows), and the disabled submit button also blocks submitting
 * with Enter (implicit submission).
 */
const ContactForm: FunctionComponent = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const submitting = status === "submitting";
  const hasOutcome = status === "sent" || status === "failed";

  // The outcome is announced by its live region, which is always rendered
  // so screen readers reliably pick up the text set into it. Focus moves
  // there too, as disabling the submit button drops it (and Try again is
  // then the next tab stop). A screen reader may read the outcome for both;
  // we accept that over it going unannounced.
  useEffect(() => {
    if (!hasOutcome) return;
    // After the commit, so the text is in place before focus arrives.
    const frame = requestAnimationFrame(() => outcomeRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [hasOutcome]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const newErrors = validateContactForm(data);

    // Render the errors first, so the focused field announces its own.
    flushSync(() => {
      setErrors(newErrors);
      setStatus("idle");
    });
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
    if (hasOutcome) setStatus("idle");

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
          readOnly={submitting}
        />
        <ContactFormField
          name="email"
          label="Email"
          type="email"
          placeholder="Your email address"
          autoComplete="email"
          error={errors.email}
          readOnly={submitting}
        />
        <ContactFormField
          name="message"
          label="How can I help you?"
          multiline
          error={errors.message}
          readOnly={submitting}
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
      <div
        ref={outcomeRef}
        role="status"
        aria-atomic="true"
        tabIndex={-1}
        className="contact-form__outcome"
      >
        {status === "sent" && (
          <p className="contact-form__sent">
            Thanks for getting in touch! Your message was sent.
          </p>
        )}
        {status === "failed" && (
          <div className="contact-form__failed">
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
      </div>
    </>
  );
};

export default ContactForm;
