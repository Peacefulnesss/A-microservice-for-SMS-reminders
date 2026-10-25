import { createContext, useContext, useState } from 'react';

// ВРЕМЕННАЯ авторизация: пользователи и сессия хранятся в localStorage браузера.
// Когда появится настоящий бэкенд, замените тела login / register / logout
// запросами к API (и храните токен вместо пароля) — остальной код менять не придётся.

const USERS_KEY = 'lotte_users';
const SESSION_KEY = 'lotte_session';

// Демо-пользователь, чтобы можно было сразу войти: demo@lotte.ru / 123456
const SEED_USERS = [{ name: 'Иванов И. И.', email: 'demo@lotte.ru', password: '123456' }];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* хранилище недоступно — работаем без сохранения */
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION_KEY, null));

  function startSession(found) {
    const session = { name: found.name, email: found.email };
    write(SESSION_KEY, session);
    setUser(session);
  }

  function login(email, password) {
    const users = read(USERS_KEY, SEED_USERS);
    const found = users.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Неверный email или пароль' };
    startSession(found);
    return { ok: true };
  }

  function register({ name, email, password }) {
    const users = read(USERS_KEY, SEED_USERS);
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) {
      return { ok: false, error: 'Пользователь с таким email уже зарегистрирован' };
    }
    const created = { name: name.trim(), email: normalized, password };
    write(USERS_KEY, [...users, created]);
    startSession(created);
    return { ok: true };
  }

  function logout() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
