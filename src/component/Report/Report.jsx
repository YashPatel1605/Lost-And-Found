import { useState } from "react";
import Footer from "../Footer/Footer";
import ReportForm from "../ReportFrom/ReportFrom";
import ReportItem from "../ReportItem/ReportItem";

export default function Report() {
  const [selectedType, setSelectedType] = useState("found");

  return (
    <div className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 space-y-6">
      <ReportItem selected={selectedType} setSelected={setSelectedType} />
      <ReportForm selectedType={selectedType} />
      <Footer />
    </div>
  );
}