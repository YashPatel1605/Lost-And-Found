import React from 'react';

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-3xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">✕</button>
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">Please login to access the Report page.</p>
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AuthModal;

