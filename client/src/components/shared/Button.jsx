import PropTypes from 'prop-types';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent px-6 py-3';

  const variants = {
    primary: 'bg-brand-primary text-bg-primary hover:opacity-90',
    secondary: 'bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-bg-primary',
    ghost: 'bg-transparent text-text-primary hover:bg-brand-primary/10',
    accent: 'bg-brand-accent text-white hover:opacity-90'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'accent']),
  className: PropTypes.string,
};
