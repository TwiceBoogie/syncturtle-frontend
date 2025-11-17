export type FieldErrors = Record<string, string | string[]>;
export class ValidationError extends Error {
  fieldErrors: FieldErrors;

  constructor(fieldErrors: FieldErrors, message = "Validation error") {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
