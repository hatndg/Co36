import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a href="#" className={`flex items-center ${className}`}>
    <span className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500">
      36
    </span>
    <span className="text-2xl font-bold text-white ml-2">Cờ 36</span>
  </a>
);

export default Logo;
