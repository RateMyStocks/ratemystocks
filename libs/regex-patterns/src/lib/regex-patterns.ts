export const USERNAME_REGEX = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
export const USERNAME_VALIDATION_MESSAGE =
  'Username can only contain alphanumeric characters, underscores, and periods.';

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const EMAIL_VALIDATION_MESSAGE = 'Please enter a valid email address.';

/** {@link https://www.computerworld.com/article/2833081/how-to-validate-password-strength-using-a-regular-expression.html} */
export const PASSWORD_REGEX = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const PASSWORD_VALIDATION_MESSAGE =
  'Password must be at least 8 characters & contain at least one of each of the following: uppercase letter, lowercase letter, number, & special character (!@#$%^&*)';
