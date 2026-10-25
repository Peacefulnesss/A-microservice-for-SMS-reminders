import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import TextField from '../components/TextField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { validateRegister } from '../utils/validate.js';
import s from './AuthForm.module.css';
import axios from "axios"

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const bind = (field) => ({
    value: form[field],
    error: errors[field],
    onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateRegister(form);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        console.log('Успех:', response.data);
        navigate('/login');
        // например, сохранить токен и редиректнуть:
        // localStorage.setItem('token', response.data.token);
        // navigate('/');
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Ошибка регистрации. Попробуйте позже.';
        setFormError(message);
      }
    }

  return (
    <section className={s.card}>
      <h1 className={s.title}>Регистрация</h1>
      <p className={s.subtitle}>Создайте аккаунт, чтобы продлевать проживание онлайн</p>

      <form className={s.form} onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className={s.formError} role="alert">
            {formError}
          </div>
        )}
        <TextField label="ФИО" placeholder="Иванов Иван Иванович" autoComplete="name" {...bind('name')} />
        <TextField label="Email" type="email" placeholder="name@example.com" autoComplete="email" {...bind('email')} />
        <TextField
          label="Пароль"
          type="password"
          placeholder="Не менее 6 символов"
          autoComplete="new-password"
          {...bind('password')}
        />
        <TextField
          label="Повторите пароль"
          type="password"
          placeholder="Ещё раз пароль"
          autoComplete="new-password"
          {...bind('confirm')}
        />
        <button type="submit" className={s.submit}>
          Зарегистрироваться
        </button>
      </form>

      <p className={s.switch}>
        Уже есть аккаунт?<Link to="/login">Войти</Link>
      </p>
    </section>
  );
}
