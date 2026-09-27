import { useState } from 'react';

const EyeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
    <path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" />
    <circle cx="10" cy="10" r="2.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
    <path d="M2.5 2.5l15 15" />
    <path d="M8.35 4.24A8.94 8.94 0 0 1 10 4c5.5 0 8.5 6 8.5 6a15.6 15.6 0 0 1-2.6 3.44M5.6 5.6C3.2 7.1 1.5 10 1.5 10s3 6 8.5 6a8.7 8.7 0 0 0 3.15-.58" />
    <path d="M8.2 8.2a2.5 2.5 0 0 0 3.54 3.54" />
  </svg>
);

const PasswordInput = ({ id, className = '', ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className={`${className} pr-11`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-nu-blue"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};

export default PasswordInput;
