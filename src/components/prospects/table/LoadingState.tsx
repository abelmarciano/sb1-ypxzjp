import React from 'react';
import { LoadingSpinner } from '../../common/LoadingSpinner';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-96">
      <LoadingSpinner message="Chargement des prospects..." />
    </div>
  );
}