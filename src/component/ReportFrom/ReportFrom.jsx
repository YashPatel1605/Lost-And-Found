import React, { useEffect, useRef, useState } from "react";
import { uploadImage, reportItem } from "../authApi/authApi";
import { toast } from "react-toastify";

export default function ReportForm({ selectedType }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: selectedType || "found",
    itemTitle: "",
    category: "",
    dateFound: "",
    description: "",
    location: "",
    name: "",
    contactNumber: "",
    email: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type: selectedType,
    }));
  }, [selectedType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(selectedFile.type)) {
      toast.error("Only PNG and JPG images are allowed ❌");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.itemTitle ||
      !formData.category ||
      !formData.dateFound ||
      !formData.description ||
      !formData.location ||
      !formData.name ||
      !formData.contactNumber ||
      !formData.email
    ) {
      toast.warn("Please fill all required fields ⚠️");
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = "";

      if (file) {
        const uploadRes = await uploadImage(file);
        uploadedImageUrl =
          uploadRes?.data?.url || uploadRes?.data?.imageUrl || uploadRes?.data?.image || "";
        console.log("Uploaded Image URL:", uploadedImageUrl);
      }

      const finalReport = {
        type: formData.type,
        itemTitle: formData.itemTitle,
        category: formData.category,
        dateFound: formData.dateFound,
        description: formData.description,
        location: formData.location,
        name: formData.name,
        contactNumber: formData.contactNumber,
        email: formData.email,
        image: uploadedImageUrl,
      };

      console.log("Sending payload:", finalReport);

      const res = await reportItem(finalReport);
      console.log("Report success:", res.data);

      toast.success("Report submitted successfully! 🎉");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Submit Error:", err);
      console.log("Status:", err.response?.status);
      console.log("Error Data:", err.response?.data);
      console.log("Message:", err.response?.data?.message);

      toast.error(err.response?.data?.message || "Failed to submit report ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 pb-10 px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10"
      >
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-10 text-center mb-8 hover:border-blue-400 cursor-pointer"
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="mx-auto max-h-48 rounded-lg object-cover"
            />
          ) : (
            <div className="text-gray-500">📷 Click to upload image</div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-5">
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-4 py-3 outline-none"
          >
            <option value="lost">Lost Item</option>
            <option value="found">Found Item</option>
          </select>

          <input
            name="itemTitle"
            value={formData.itemTitle}
            onChange={handleInputChange}
            placeholder="Item Title *"
            className="w-full border rounded-lg px-4 py-3 outline-none"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-3 outline-none"
              required
            >
              <option value="">Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Wallet">Wallet</option>
              <option value="ID Cards">ID Cards</option>
            </select>

            <input
              type="date"
              name="dateFound"
              value={formData.dateFound}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-3 outline-none"
              required
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description *"
            rows="3"
            className="w-full border rounded-lg px-4 py-3 outline-none"
            required
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location *"
            className="w-full border rounded-lg px-4 py-3 outline-none"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name *"
              className="border rounded-lg px-4 py-3 outline-none"
              required
            />
            <input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Contact Number *"
              className="border rounded-lg px-4 py-3 outline-none"
              required
            />
          </div>

          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email *"
            type="email"
            className="w-full border rounded-lg px-4 py-3 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}