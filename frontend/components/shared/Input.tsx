import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export function Input({ 
  className = '',
  error,
  label,
  type = 'text',
  ...props 
}: InputProps) {
  const baseStyles = [
    'w-full bg-[#1C1C1E] text-white rounded-lg px-4 py-3',
    'border border-gray-700',
    'placeholder:text-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ].join(' ');

  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  const classes = `${baseStyles} ${errorStyles} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-400 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}