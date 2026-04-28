import React from "react";

export default function ReportItem({ selected, setSelected }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-3">
        <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-1 rounded-full">
          SUBMIT REPORT
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Report an Item
      </h1>

      <p className="text-gray-500 mb-6 text-sm md:text-base">
        Fill in the details below to help others find or recover the item.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setSelected("found")}
          className={`rounded-2xl p-6 md:p-8 text-center shadow-sm transition cursor-pointer border-2 ${
            selected === "found"
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 bg-white hover:shadow-md"
          }`}
        >
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            I Found an Item
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Report something you found on campus
          </p>
        </div>

        <div
          onClick={() => setSelected("lost")}
          className={`rounded-2xl p-6 md:p-8 text-center shadow-sm transition cursor-pointer border-2 ${
            selected === "lost"
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 bg-white hover:shadow-md"
          }`}
        >
          <div className="text-4xl mb-4">😟</div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            I Lost an Item
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Report something you've lost
          </p>
        </div>
      </div>
    </div>
  );
}