import { Validation, ValidationRule } from "./interfaces";

export const EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_RULES: Record<string, ValidationRule> = {
  UPPERCASE: {
    validate: (value) => /[A-Z]/.test(value),
    message: "at least one uppercase letter",
  },
  LOWERCASE: {
    validate: (value) => /[a-z]/.test(value),
    message: "at least one lowercase letter",
  },
  NUMBER: {
    validate: (value) => /[0-9]/.test(value),
    message: "at least one number",
  },
  SPECIAL: {
    validate: (value) => /[^A-Za-z0-9]/.test(value),
    message: "at least one special symbol",
  },
  LENGTH: {
    validate: (value) => /^.{8,}$/.test(value),
    message: "at least 8 characters long",
  },
};

export const ERROR_MESSAGE = {
  NAME: "Please enter your name.",
  EMAIL: "Please enter a valid email address.",
  PASSWORD: "Please enter a password.",
  CONFIRM_PASSWORD: "Passwords do not match.",
  AGREE: "Please agree to the above information.",
};

export const VALIDATIONS: Validation[] = [
  {
    id: "name",
    validate: (value) => {
      if (!value) {
        return ERROR_MESSAGE.NAME;
      }
      const errors = checkRules(value, ["UPPERCASE", "LOWERCASE"]);
      return createErrorMessage(errors);
    },
  },
  {
    id: "email",
    validate: (value) =>
      EMAIL_VALIDATION.test(value) ? "" : ERROR_MESSAGE.EMAIL,
  },
  {
    id: "password",
    validate: (value) => {
      if (!value) {
        return ERROR_MESSAGE.PASSWORD;
      }
      const errors = checkRules(value, [
        "UPPERCASE",
        "LOWERCASE",
        "NUMBER",
        "SPECIAL",
        "LENGTH",
      ]);
      return createErrorMessage(errors);
    },
  },
  {
    id: "confirmPassword",
    validate: (value) => {
      const password = (document.getElementById("password") as HTMLInputElement)
        .value;
      return value === password ? "" : ERROR_MESSAGE.CONFIRM_PASSWORD;
    },
  },
  {
    id: "agree",
    validate: () =>
      (document.getElementById("agree") as HTMLInputElement).checked
        ? ""
        : ERROR_MESSAGE.AGREE,
  },
];

function checkRules(value: string, rules: string[]): string[] {
  const errors = rules.reduce<string[]>((accumulator, ruleName) => {
    const rule = VALIDATION_RULES[ruleName];
    if (!rule.validate(value)) {
      accumulator.push(rule.message);
    }
    return accumulator;
  }, []);

  return errors;
}

function createErrorMessage(errors: string[]): string | string[] {
  if (errors.length) {
    return "Must contain: " + errors;
  }
  return "";
}
