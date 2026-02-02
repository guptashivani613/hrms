import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="text-center">
        <div className='flex justify-center'>
        <img
          src="https://storage.googleapis.com/a1aa/image/50cd1f3e-4470-45d9-a405-d86a11567182.jpeg"
          alt="404 Not Found"
          className="w-80 h-auto mb-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
        />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          It seems like you've wandered off into uncharted territory. Don't worry, we'll guide you back to safety.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 hover:from-blue-600 hover:to-purple-600"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
