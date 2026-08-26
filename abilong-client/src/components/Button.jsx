import { Link } from 'react-router-dom';

const variantClasses = {
 
  primary: 'bg-nu-blue text-white border-nu-blue hover:bg-nu-blue-light hover:border-nu-blue-light shadow-sm',
 
  secondary: 'bg-transparent text-nu-blue border-nu-blue hover:bg-nu-blue hover:text-white',
  
  gold: 'bg-nu-gold text-nu-blue border-nu-gold font-bold hover:bg-nu-gold-light hover:border-nu-gold-light shadow-sm',

  outline: 'bg-transparent text-white border-white hover:bg-white hover:text-nu-blue',
};

const Button = ({
  children,
  to,
  type = 'button',
  variant = 'secondary',
  className = '',
  ...rest
}) => {
  const classes = [
    'inline-flex items-center justify-center rounded-full border-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant] ?? variantClasses.secondary,
    className,
  ]
    .join(' ')
    .trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
