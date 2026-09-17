import React, { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  error, 
  className = "", 
  as: Component = "input",
  ...props 
}, ref) => {
  const isTextarea = Component === 'textarea';
  
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-bold text-brand-primary">
          {label}
        </label>
      )}
      <Component
        ref={ref}
        className={`bg-white border-2 rounded-xl px-4 ${isTextarea ? 'py-3 resize-none' : 'py-3'} outline-none transition-colors ${
          error 
            ? 'border-red-500 focus:border-red-600 bg-red-50/50' 
            : 'border-brand-primary/10 focus:border-brand-accent'
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-semibold text-red-500 mt-1 animate-in slide-in-from-top-1 fade-in duration-200">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
