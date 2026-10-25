import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import TextField from '../components/TextField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { validateLogin } from '../utils/validate.js';
import s from './AuthForm.module.css';

export default function Login() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  // Уже вошли — на главную
  if (user) return <Navigate to="/" replace />;

  const bind = (field) => ({
    value: form[field],
    error: errors[field],
    onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const found = validateLogin(form);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    const result = login(form.email, form.password);
    if (!result.ok) setFormError(result.error);
    // при успехе user изменится, и компонент сам перенаправит на главную
  }

  return (
    <section className={s.card}>
      <h1 className={s.title}>Вход</h1>
      <p className={s.subtitle}>Войдите, чтобы управлять бронированиями</p>

      <form className={s.form} onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className={s.formError} role="alert">
            {formError}
          </div>
        )}
        <TextField label="Email" type="email" placeholder="name@example.com" autoComplete="email" {...bind('email')} />
        <TextField
          label="Пароль"
          type="password"
          placeholder="Введите пароль"
          autoComplete="current-password"
          {...bind('password')}
        />
        <button type="submit" className={s.submit}>
          Войти
        </button>
      </form>

      <p className={s.switch}>
        Нет аккаунта?<Link to="/register">Зарегистрироваться</Link>
      </p>

      <div className={s.hint}>
        Демо-вход: <b>demo@lotte.ru</b> / <b>123456</b>
      </div>
    </section>
  );
}
