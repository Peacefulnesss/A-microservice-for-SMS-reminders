// Все иконки в одном месте. Цвет берут из currentColor, размер задаётся через CSS.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const HomeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v10h13V10" />
    <path d="M10 20v-5.5h4V20" />
  </svg>
);

// big — вариант покрупнее для иконки напоминания на главной
export const CalendarIcon = ({ big, ...p }) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx={big ? 3 : 2.5} />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    {[8.5, 12, 15.5].map((cx) => (
      <circle key={cx} cx={cx} cy="14.5" r={big ? 0.9 : 0.6} fill="currentColor" />
    ))}
  </svg>
);

export const HistoryIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4 4v4h4" />
    <path d="M12 8v4.5l3 1.5" />
  </svg>
);

export const BellIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2h-15z" />
    <path d="M10 21h4" />
  </svg>
);

export const LogoutIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
    <path d="M9 12h11M16 8l4 4-4 4" />
  </svg>
);

export const UserIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
  </svg>
);

export const GuestIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6z" />
  </svg>
);

export const EyeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.1A10.5 10.5 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1" />
    <path d="M6.6 6.6A16.6 16.6 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4.4-1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

export const ChevronDown = (p) => (
  <svg {...base} strokeWidth={2.2} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronRight = (p) => (
  <svg {...base} strokeWidth={2.6} {...p}>
    <path d="m9 4 8 8-8 8" />
  </svg>
);

export const ArrowRight = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

export const PercentIcon = (p) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="M18 5 6 19" />
    <circle cx="7.5" cy="7.5" r="2.3" />
    <circle cx="16.5" cy="16.5" r="2.3" />
  </svg>
);

export const CheckBoxIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3.5" fill="currentColor" />
    <path d="m8.5 12.3 2.4 2.4 4.6-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SendIcon = (p) => (
  <svg {...base} strokeWidth={1.7} {...p}>
    <path d="M21 3 3 10.5l7 3 3 7z" />
    <path d="m21 3-11 10.5" />
  </svg>
);
