import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export const FadeInSection = ({ children, className = '' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Toggle visibility based on intersection (fades in when on screen, fades out when off)
        setVisible(entry.isIntersecting);
      });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${className}`}
    >
      {children}
    </div>
  );
};

FadeInSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
