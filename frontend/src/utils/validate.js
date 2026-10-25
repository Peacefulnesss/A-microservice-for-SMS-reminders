const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkEmail(email) {
  if (!email.trim()) return 'Введите email';
  if (!EMAIL_RE.test(email.trim())) return 'Некорректный email';
  return null;
}

export function validateLogin({ email, password }) {
  const errors = {};
  const emailError = checkEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = 'Введите пароль';
  return errors;
}

export function validateRegister({ name, email, password, confirm }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Введите ФИО';
  const emailError = checkEmail(email);
  if (emailError) errors.email = emailError;
  if (password.length < 6) errors.password = 'Пароль не короче 6 символов';
  if (confirm !== password) errors.confirm = 'Пароли не совпадают';
  return errors;
}
