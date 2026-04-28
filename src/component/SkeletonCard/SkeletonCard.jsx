import React from "react";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
    <div className="bg-blue-50 h-40 flex items-center justify-center relative">
      <div className="absolute top-4 left-4 w-16 h-5 bg-gray-200 rounded-full"></div>
      <div className="absolute top-4 right-4 w-16 h-5 bg-gray-200 rounded-full"></div>
      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
    </div>
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;