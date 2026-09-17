import PropTypes from 'prop-types';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-bg-primary border-2 border-brand-primary/10 rounded-3xl shadow-[var(--shadow)] overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
