import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import TextField from '../components/TextField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { validateLogin } from '../utils/validate.js';
import s from './AuthForm.module.css';
import axios from "axios"

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Уже вошли — на главную
  if (user) return <Navigate to="/" replace />;

  const bind = (field) => ({
    value: form[field],
    error: errors[field],
    onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateLogin(form);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    navigate('/');
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
      { 
      // <div className={s.hint}>
        //Демо-вход: <b>demo@lotte.ru</b> / <b>123456</b>
      // </div>
      }
    </section>
  );
}
