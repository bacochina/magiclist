'use client';

import React from 'react';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormContainer({ children, onSubmit }: FormContainerProps) {
  return (
    <form onSubmit={onSubmit} className="bg-gray-800 shadow-md rounded-lg p-6 mx-auto max-w-4xl">
      <div className="space-y-8">
        {children}
      </div>
    </form>
  );
} 