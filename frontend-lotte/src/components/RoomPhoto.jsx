import s from './RoomPhoto.module.css';

export default function RoomPhoto({ className = '', label = 'Фото номера' }) {
  return <div className={`${s.photo} ${className}`} role="img" aria-label={label} />;
}
