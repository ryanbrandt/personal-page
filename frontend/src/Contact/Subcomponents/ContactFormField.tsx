import {
  type FunctionComponent,
  type HTMLInputTypeAttribute,
  useId,
} from "react";

import type { ContactField } from "@app/Contact/types";

interface Props {
  name: ContactField;
  label: string;
  placeholder?: string;
  /** The field's error message, while its value isn't valid */
  error?: string;
  /** Renders a `<textarea>`, not an `<input>` */
  multiline?: boolean;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
}

// The library's TextInput and TextArea can't take a `name`, `type`,
// `autoComplete` or ARIA attributes yet, so this renders native controls in
// the library's input styles (its Sass input mixins).
const ContactFormField: FunctionComponent<Props> = ({
  name,
  label,
  placeholder,
  error,
  multiline = false,
  type = "text",
  autoComplete,
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const controlProps = {
    id,
    name,
    placeholder,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: error
      ? "contact-form__control contact-form__control--error"
      : "contact-form__control",
  };

  return (
    <div className="contact-form__field">
      <label htmlFor={id} className="contact-form__label">
        {label}
      </label>
      {multiline ? (
        <textarea rows={6} {...controlProps} />
      ) : (
        <input type={type} autoComplete={autoComplete} {...controlProps} />
      )}
      {error && (
        <p id={errorId} className="contact-form__error">
          {error}
        </p>
      )}
    </div>
  );
};

export default ContactFormField;
