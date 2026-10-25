import { useId, useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons.jsx';
import s from './TextField.module.css';


export default function TextField({ label, error, type = 'text', ...rest }) {
  const [shown, setShown] = useState(false);
  const id = useId();
  const isPassword = type === 'password';

  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div className={`${s.control} ${error ? s.invalid : ''}`}>
        <input
          id={id}
          className={s.input}
          type={isPassword && shown ? 'text' : type}
          aria-invalid={Boolean(error)}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={s.eye}
            aria-label={shown ? 'Скрыть пароль' : 'Показать пароль'}
            onClick={() => setShown((v) => !v)}
          >
            {shown ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <div className={s.error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
