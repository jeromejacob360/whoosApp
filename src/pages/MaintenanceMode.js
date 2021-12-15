import React from 'react';
import maintenance from '../assets/images/maintenance.png';

export default function MaintenanceMode() {
  return (
    <div className="h-screen w-screen bg-gray-200 flex items-center justify-center">
      <img className="shadow-2xl" src={maintenance} alt="maintenance mode" />
    </div>
  );
}
